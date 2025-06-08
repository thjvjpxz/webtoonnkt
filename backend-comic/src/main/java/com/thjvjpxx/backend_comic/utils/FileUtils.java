package com.thjvjpxx.backend_comic.utils;

import com.thjvjpxx.backend_comic.constant.B2Constants;
import com.thjvjpxx.backend_comic.service.StorageService;

public class FileUtils {
    public static void deleteFileFromB2(String url, StorageService b2StorageService) {
        if (url != null && !url.isEmpty() && url.startsWith(B2Constants.URL_PREFIX)) {
            b2StorageService.remove(url);
        }
    }
}
