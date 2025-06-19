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

import jakarta.transaction.Transactional;
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

        if (!user.getActive()) {
            throw new BaseException(ErrorCode.USER_NOT_ACTIVE);
        }

        if (user.getBlocked()) {
            throw new BaseException(ErrorCode.USER_ALREADY_BLOCKED);
        }

        if (user.getDeleted()) {
            throw new BaseException(ErrorCode.USER_ALREADY_DELETED);
        }

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

        if (checkTokenExpired(user.getCreatedAt())) {
            throw new BaseException(ErrorCode.VERIFICATION_TOKEN_EXPIRED);
        }

        user.setActive(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return BaseResponse.success(user);
    }

    @Override
    @Transactional
    public BaseResponse<?> forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));
        String resetPasswordToken = StringUtils.generateVerificationToken();
        String resetPasswordUrl = frontendUrl + "/reset-password?token=" + resetPasswordToken;

        emailService.sendResetPasswordEmail(email, resetPasswordUrl);

        user.setResetPasswordToken(resetPasswordToken);
        userRepository.save(user);

        return BaseResponse.success("Vui lòng kiểm tra email để đặt lại mật khẩu!");
    }

    @Override
    public BaseResponse<?> resetPassword(String token, String password, String confirmPassword) {
        if (token == null || token.isEmpty()) {
            throw new BaseException(ErrorCode.TOKEN_REQUIRED);
        }
        if (!password.equals(confirmPassword)) {
            throw new BaseException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        try {
            User user = userRepository.findByResetPasswordToken(token)
                    .orElseThrow(() -> new BaseException(ErrorCode.RESET_PASSWORD_TOKEN_INVALID));

            if (checkTokenExpired(user.getUpdatedAt())) {
                throw new BaseException(ErrorCode.RESET_PASSWORD_TOKEN_EXPIRED);
            }

            user.setPassword(passwordEncoder.encode(password));
            user.setResetPasswordToken(null);
            userRepository.save(user);

            return BaseResponse.success("Đặt lại mật khẩu thành công!");

        } catch (Exception e) {
            throw new BaseException(ErrorCode.RESET_PASSWORD_TOKEN_INVALID);
        }
    }

    @Override
    public BaseResponse<?> checkResetPasswordTokenExpired(String token) {
        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new BaseException(ErrorCode.RESET_PASSWORD_TOKEN_INVALID));

        return BaseResponse.success(checkTokenExpired(user.getUpdatedAt()));
    }

    // ======================== HELPER METHODS ========================
    private boolean checkTokenExpired(LocalDateTime time) {
        long veriSeconds = verificationTokenExpiration / 1000;
        return time.plusSeconds(veriSeconds).isBefore(LocalDateTime.now());
    }
}