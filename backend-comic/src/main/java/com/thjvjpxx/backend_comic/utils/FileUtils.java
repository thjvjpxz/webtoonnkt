package com.thjvjpxx.backend_comic.utils;

import com.thjvjpxx.backend_comic.constant.B2Constants;
import com.thjvjpxx.backend_comic.service.StorageService;

/**
 * Lớp tiện ích cho các thao tác xử lý file
 */
public class FileUtils {

    /**
     * Xóa file từ Backblaze B2 storage dựa trên URL
     * 
     * @param url              URL của file cần xóa từ B2 storage
     * @param b2StorageService Service để thực hiện các thao tác với B2 storage
     * @throws IllegalArgumentException nếu URL không hợp lệ hoặc không thuộc B2
     */
    public static void deleteFileFromB2(String url, StorageService b2StorageService) {
        if (url != null && !url.isEmpty() && url.startsWith(B2Constants.URL_PREFIX)) {
            b2StorageService.remove(url);
        }
    }
}
