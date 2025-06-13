package com.thjvjpxx.backend_comic.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.UserRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.service.UserService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/users")
public class UserController {
    UserService userService;

    /**
     * Lấy danh sách user
     * GET /users
     * 
     * @param page    Trang hiện tại
     * @param limit   Số lượng mỗi trang
     * @param roleId  ID vai trò
     * @param search  Từ khóa tìm kiếm
     * @param deleted Trạng thái xóa
     * @return Response chứa danh sách user
     */
    @GetMapping
    public BaseResponse<List<User>> getUsers(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer limit,
            @RequestParam(required = false) String roleId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean deleted) {
        return userService.getUsers(page, limit, search, roleId, deleted);
    }

    /**
     * Tạo user mới
     * POST /users
     * 
     * @param request Dữ liệu user
     * @param avatar  Ảnh đại diện
     * @return Response chứa user đã tạo
     */
    @PostMapping
    public BaseResponse<User> createUser(
            @Valid @RequestPart("data") UserRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        return userService.createUser(request, avatar);
    }

    /**
     * Cập nhật user
     * PUT /users/{id}
     * 
     * @param id      ID user
     * @param request Dữ liệu user
     * @param avatar  Ảnh đại diện
     * @return Response chứa user đã cập nhật
     */
    @PutMapping(value = "/{id}")
    public BaseResponse<User> updateUser(
            @PathVariable String id,
            @Valid @RequestPart("data") UserRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        return userService.updateUser(id, request, avatar);
    }

    /**
     * Khóa user
     * PUT /users/{id}/block
     * 
     * @param id ID user
     * @return Response chứa user đã khóa
     */
    @PutMapping("/{id}/block")
    public BaseResponse<User> blockUser(@PathVariable String id) {
        return userService.blockUser(id);
    }

    /**
     * Mở khóa user
     * PUT /users/{id}/unblock
     * 
     * @param id ID user
     * @return Response chứa user đã mở khóa
     */
    @PutMapping("/{id}/unblock")
    public BaseResponse<User> unblockUser(@PathVariable String id) {
        return userService.unblockUser(id);
    }

    /**
     * Xóa user
     * DELETE /users/{id}
     * 
     * @param id ID user
     * @return Response chứa user đã xóa
     */
    @DeleteMapping("/{id}")
    public BaseResponse<User> deleteUser(@PathVariable String id) {
        return userService.deleteUser(id);
    }
}
