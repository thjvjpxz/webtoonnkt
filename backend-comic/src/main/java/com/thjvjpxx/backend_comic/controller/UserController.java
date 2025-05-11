package com.thjvjpxx.backend_comic.controller;

import java.util.List;

import org.springframework.http.MediaType;
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

    @GetMapping
    public BaseResponse<List<User>> getUsers(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer limit,
            @RequestParam(required = false) String roleId,
            @RequestParam(required = false) String search) {
        return userService.getUsers(page, limit, search, roleId);
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public BaseResponse<User> createUser(
            @Valid @RequestPart("data") UserRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        return userService.createUser(request, avatar);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public BaseResponse<User> updateUser(
            @PathVariable String id,
            @Valid @RequestPart("data") UserRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        return userService.updateUser(id, request, avatar);
    }

    @PutMapping("/{id}/block")
    public BaseResponse<User> blockUser(@PathVariable String id) {
        return userService.blockUser(id);
    }

    @PutMapping("/{id}/unblock")
    public BaseResponse<User> unblockUser(@PathVariable String id) {
        return userService.unblockUser(id);
    }

    @DeleteMapping("/{id}")
    public BaseResponse<User> deleteUser(@PathVariable String id) {
        return userService.deleteUser(id);
    }
}
