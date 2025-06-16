package com.thjvjpxx.backend_comic.service;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
/**
 * Service xử lý lưu trữ file
 */
public interface StorageService {
    
    /**
     * Upload file lên hệ thống lưu trữ
     * 
     * @param file       File cần upload
     * @param typeFolder Loại thư mục để phân loại file (ví dụ: images, documents)
     * @param fileName   Tên file sau khi upload
     * @return BaseResponse chứa thông tin file đã upload
     */
    BaseResponse<?> uploadFile(MultipartFile file, String typeFolder, String fileName);

    /**
     * Xóa file khỏi hệ thống lưu trữ
     * 
     * @param url URL của file cần xóa
     * @return BaseResponse thông báo kết quả xóa file
     */
    BaseResponse<?> remove(String url);

    /**
     * Đổi tên file trong hệ thống lưu trữ
     * 
     * @param url     URL của file cần đổi tên
     * @param newName Tên mới cho file
     * @return BaseResponse thông báo kết quả đổi tên file
     */
    BaseResponse<?> rename(String url, String newName);

    /**
     * Lấy danh sách tất cả file trong thư mục
     * 
     * @param folder Tên thư mục cần lấy danh sách file
     * @return BaseResponse chứa danh sách file trong thư mục
     */
    BaseResponse<?> getAllFiles(String folder);
}