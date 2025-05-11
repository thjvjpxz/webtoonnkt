package com.thjvjpxx.backend_comic.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Component
@Getter
@RequiredArgsConstructor
public class StorageFactory {
    private final GoogleDriveService googleDriveService;
    private final B2StorageService b2StorageService;

    @Value("${storage.provider}")
    private String storageProvider;

    public StorageService getStorageService() {
        switch (storageProvider) {
            case "googleDrive":
                return googleDriveService;
            case "b2":
                return b2StorageService;
            default:
                return b2StorageService;
        }
    }
}
