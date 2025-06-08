package com.thjvjpxx.backend_comic.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.GlobalConstants;
import com.thjvjpxx.backend_comic.dto.request.UserRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Level;
import com.thjvjpxx.backend_comic.model.Role;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.repository.RoleRepository;
import com.thjvjpxx.backend_comic.repository.UserRepository;
import com.thjvjpxx.backend_comic.service.LevelService;
import com.thjvjpxx.backend_comic.service.StorageService;
import com.thjvjpxx.backend_comic.service.UserService;
import com.thjvjpxx.backend_comic.utils.FileUtils;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;
import com.thjvjpxx.backend_comic.utils.StringUtils;
import com.thjvjpxx.backend_comic.utils.ValidationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    LevelService levelService;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    StorageService b2StorageService;

    @Override
    public BaseResponse<List<User>> getUsers(int page, int limit, String search, String roleId, Boolean deleted) {
        Pageable pageable = PaginationUtils.createPageable(page, limit);
        int originalPage = page;
        Page<User> users = null;

        // Nếu deleted = null thì mặc định hiển thị user chưa bị xóa
        deleted = deleted == null ? false : deleted;

        if (deleted == false) {
            // Hiển thị những user chưa bị xóa (deleted = false)
            if (search != null && !search.isEmpty() && roleId != null && !roleId.isEmpty()) {
                Role role = roleRepository.findById(roleId)
                        .orElseThrow(() -> new BaseException(ErrorCode.ROLE_NOT_FOUND));
                users = userRepository.findByDeletedFalseAndRoleAndUsernameOrEmailContaining(role, search, pageable);
            } else if (search != null && !search.isEmpty()) {
                users = userRepository.findByDeletedFalseAndUsernameContainingOrEmailContaining(search, search,
                        pageable);
            } else if (roleId != null && !roleId.isEmpty()) {
                Role role = roleRepository.findById(roleId)
                        .orElseThrow(() -> new BaseException(ErrorCode.ROLE_NOT_FOUND));
                users = userRepository.findByDeletedFalseAndRole(role, pageable);
            } else {
                users = userRepository.findByDeletedFalse(pageable);
            }
        } else {
            // Hiển thị những user đã bị xóa (deleted = true)
            if (search != null && !search.isEmpty() && roleId != null && !roleId.isEmpty()) {
                Role role = roleRepository.findById(roleId)
                        .orElseThrow(() -> new BaseException(ErrorCode.ROLE_NOT_FOUND));
                users = userRepository.findByDeletedTrueAndRoleAndUsernameOrEmailContaining(role, search, pageable);
            } else if (search != null && !search.isEmpty()) {
                users = userRepository.findByDeletedTrueAndUsernameContainingOrEmailContaining(search, search,
                        pageable);
            } else if (roleId != null && !roleId.isEmpty()) {
                Role role = roleRepository.findById(roleId)
                        .orElseThrow(() -> new BaseException(ErrorCode.ROLE_NOT_FOUND));
                users = userRepository.findByDeletedTrueAndRole(role, pageable);
            } else {
                users = userRepository.findByDeletedTrue(pageable);
            }
        }

        return BaseResponse.success(
                users.getContent(),
                originalPage,
                (int) users.getTotalElements(),
                limit,
                users.getTotalPages());
    }

    private void validateUsername(String username) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new BaseException(ErrorCode.USERNAME_EXISTS);
        }
    }

    private void validateEmail(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new BaseException(ErrorCode.EMAIL_EXISTS);
        }
    }

    @Override
    public BaseResponse<User> createUser(UserRequest request, MultipartFile avatar) {
        validateUsername(request.getUsername());
        validateEmail(request.getEmail());

        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new BaseException(ErrorCode.PASSWORD_NOT_EMPTY);
        }

        String imgUrl = null;
        if (avatar != null) {
            var response = b2StorageService.uploadFile(avatar, GlobalConstants.TYPE_AVATAR,
                    request.getUsername());
            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
            imgUrl = response.getMessage();
        }
        Level levelDefault = levelService.getLevelDefaultUser();

        Role role = roleRepository.findByName("READER")
                .orElseThrow(() -> new BaseException(ErrorCode.ROLE_NOT_FOUND));

        String passwordEncode = passwordEncoder.encode(request.getPassword());

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncode);
        user.setLevel(levelDefault);
        user.setRole(role);
        user.setActive(true);
        user.setImgUrl(imgUrl);

        userRepository.save(user);
        return BaseResponse.success(user);
    }

    @Override
    public BaseResponse<User> updateUser(String id, UserRequest request, MultipartFile avatar) {
        ValidationUtils.checkNullId(id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        String imgUrl = user.getImgUrl();
        if (avatar != null) {
            FileUtils.deleteFileFromB2(imgUrl, b2StorageService);

            var response = b2StorageService.uploadFile(avatar, GlobalConstants.TYPE_AVATAR,
                    request.getUsername());
            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
            imgUrl = response.getMessage();
        }

        if (!user.getUsername().equals(request.getUsername())) {
            validateUsername(request.getUsername());
            String newUsername = StringUtils.generateSlug(request.getUsername());
            var response = b2StorageService.rename(user.getImgUrl(), newUsername);
            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.RENAME_FILE_FAILED);
            }
            imgUrl = response.getMessage();
        }

        if (!user.getEmail().equals(request.getEmail())) {
            validateEmail(request.getEmail());
        }

        if (request.getLevelId() != null) {
            Level level = levelService.getLevelById(request.getLevelId());
            user.setLevel(level);
        }

        if (request.getRoleId() != null) {
            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new BaseException(ErrorCode.ROLE_NOT_FOUND));
            user.setRole(role);
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setActive(request.getActive());
        user.setVip(request.getVip());
        user.setBalance(request.getBalance());
        user.setImgUrl(imgUrl);

        userRepository.save(user);
        return BaseResponse.success(user);
    }

    @Override
    public BaseResponse<User> blockUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));
        user.setBlocked(true);
        userRepository.save(user);
        return BaseResponse.success(user);
    }

    @Override
    public BaseResponse<User> unblockUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));
        user.setBlocked(false);
        userRepository.save(user);
        return BaseResponse.success(user);
    }

    @Override
    public BaseResponse<User> deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        if (user.getDeleted()) {
            throw new BaseException(ErrorCode.USER_ALREADY_DELETED);
        }

        // Đánh dấu user là đã xóa (soft delete)
        user.setDeleted(true);
        userRepository.save(user);

        return BaseResponse.success(user);
    }

}
