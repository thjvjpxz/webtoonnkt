package com.thjvjpxx.backend_comic.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.StorageService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TestController {
    StorageService storageService;

    @PostMapping("/remove")
    public BaseResponse<?> remove(@RequestBody Map<String, String> request) {
        String url = request.get("url");
        return storageService.remove(url);
    }

    @PostMapping("/list-files")
    public BaseResponse<?> listFiles(@RequestBody Map<String, String> request) {
        String folder = request.get("folder");
        return storageService.getAllFiles(folder);
    }

    @PostMapping("/rename")
    public BaseResponse<?> rename(@RequestBody Map<String, String> request) {
        String url = request.get("url");
        String newName = request.get("newName");
        return storageService.rename(url, newName);
    }
}
