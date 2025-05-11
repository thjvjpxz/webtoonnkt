package com.thjvjpxx.backend_comic.service;

public interface GoogleDriveService extends StorageService {
    void rename(String folderId, String newName);
}
