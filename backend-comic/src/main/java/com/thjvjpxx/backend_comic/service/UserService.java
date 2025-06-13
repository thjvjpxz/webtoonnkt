package com.thjvjpxx.backend_comic.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.UserRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.User;

public interface UserService {
    BaseResponse<List<User>> getUsers(int page, int limit, String search, String roleId, Boolean deleted);

    BaseResponse<User> createUser(UserRequest request, MultipartFile avatar);

    BaseResponse<User> updateUser(String id, UserRequest request, MultipartFile avatar);

    BaseResponse<User> blockUser(String id);

    BaseResponse<User> unblockUser(String id);

    BaseResponse<User> deleteUser(String id);
}
