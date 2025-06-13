package com.thjvjpxx.backend_comic.service.impl;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.config.JwtConfig;
import com.thjvjpxx.backend_comic.dto.request.LoginRequest;
import com.thjvjpxx.backend_comic.dto.request.RegisterRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.LoginResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Level;
import com.thjvjpxx.backend_comic.model.Role;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.repository.RoleRepository;
import com.thjvjpxx.backend_comic.repository.UserRepository;
import com.thjvjpxx.backend_comic.service.AuthService;
import com.thjvjpxx.backend_comic.service.EmailService;
import com.thjvjpxx.backend_comic.service.LevelService;
import com.thjvjpxx.backend_comic.utils.StringUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthServiceImpl implements AuthService {

    final UserRepository userRepository;
    final RoleRepository roleRepository;
    final JwtConfig jwtConfig;
    final BCryptPasswordEncoder passwordEncoder;
    final LevelService levelService;
    final EmailService emailService;

    @Value("${app.frontend-url}")
    String frontendUrl;

    @Value("${app.verification-token-expiration}")
    Long verificationTokenExpiration;

    @Override
    public BaseResponse<?> login(LoginRequest loginRequest) {
        Optional<User> userOptByUsername = userRepository.findByUsername(loginRequest.getUsername());
        Optional<User> userOptByEmail = userRepository.findByEmail(loginRequest.getUsername());

        User user;
        if (userOptByUsername.isPresent()) {
            user = userOptByUsername.get();
        } else if (userOptByEmail.isPresent()) {
            user = userOptByEmail.get();
        } else {
            throw new BaseException(ErrorCode.USER_NOT_FOUND);
        }

        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BaseException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        if (user.getBlocked()) {
            throw new BaseException(ErrorCode.USER_ALREADY_BLOCKED);
        }

        if (user.getDeleted()) {
            throw new BaseException(ErrorCode.USER_ALREADY_DELETED);
        }

        // // Kiểm tra trạng thái tài khoản
        // if (!user.getActive() && !user.getRole().getName().equals("ADMIN")) {
        // throw new BaseException(ErrorCode.USER_INACTIVE);
        // }

        // Tạo token
        String accessToken = jwtConfig.generateToken(user.getUsername());
        String refreshToken = jwtConfig.generateRefreshToken(user.getUsername());

        // Tạo response
        LoginResponse loginResponse = LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .id(user.getId())
                .username(user.getUsername())
                .imgUrl(user.getImgUrl())
                .vip(user.getVip())
                .role(user.getRole())
                .build();

        return BaseResponse.success(loginResponse);
    }

    @Override
    public BaseResponse<?> refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new BaseException(ErrorCode.REFRESH_TOKEN_REQUIRED);
        }

        // Xác thực refresh token
        if (!jwtConfig.validateToken(refreshToken)) {
            throw new BaseException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        // Lấy username từ refresh token
        String username = jwtConfig.extractUsername(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        // Tạo access token mới
        String newAccessToken = jwtConfig.generateToken(username);

        // Tạo response
        LoginResponse loginResponse = LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .id(user.getId())
                .username(user.getUsername())
                .imgUrl(user.getImgUrl())
                .vip(user.getVip())
                .role(user.getRole())
                .build();

        return BaseResponse.success(loginResponse);
    }

    @Override
    public BaseResponse<?> validateToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new BaseException(ErrorCode.TOKEN_REQUIRED);
        }

        // Xử lý "Bearer " nếu có
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!jwtConfig.validateToken(token)) {
            throw new BaseException(ErrorCode.INVALID_TOKEN);
        }

        String username = jwtConfig.extractUsername(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        LoginResponse loginResponse = LoginResponse.builder()
                .accessToken(token)
                .id(user.getId())
                .username(user.getUsername())
                .imgUrl(user.getImgUrl())
                .vip(user.getVip())
                .role(user.getRole())
                .build();

        return BaseResponse.success(loginResponse);
    }

    @Override
    public BaseResponse<?> register(RegisterRequest registerRequest) {
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new BaseException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new BaseException(ErrorCode.USERNAME_EXISTS);
        }

        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new BaseException(ErrorCode.EMAIL_EXISTS);
        }

        Role role = roleRepository.findByName("READER").orElseThrow(() -> new BaseException(ErrorCode.ROLE_NOT_FOUND));
        Level level = levelService.getLevelDefaultUser();

        String verificationToken = StringUtils.generateVerificationToken();

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(role);
        user.setLevel(level);
        user.setVip(false);
        user.setActive(false);
        user.setVerificationToken(verificationToken);

        String verificationUrl = frontendUrl + "/verify?token=" + verificationToken;
        emailService.sendVerificationEmail(user.getEmail(), verificationUrl);

        userRepository.save(user);

        return BaseResponse.success(user);
    }

    @Override
    public BaseResponse<?> verify(String token) {
        Optional<User> userOpt = userRepository.findByVerificationToken(token);

        if (!userOpt.isPresent()) {
            throw new BaseException(ErrorCode.USER_NOT_FOUND);
        }

        User user = userOpt.get();

        long veriSeconds = verificationTokenExpiration / 1000;

        if (user.getCreatedAt().plusSeconds(veriSeconds).isBefore(LocalDateTime.now())) {
            throw new BaseException(ErrorCode.VERIFICATION_TOKEN_EXPIRED);
        }

        user.setActive(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return BaseResponse.success(user);
    }
}