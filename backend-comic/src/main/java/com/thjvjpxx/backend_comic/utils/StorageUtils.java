package com.thjvjpxx.backend_comic.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.B2Constants;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.service.StorageService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * Utility class chứa các helper methods chung cho Storage operations
 */
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StorageUtils {

    StorageService storageService;

    /**
     * Upload thumbnail với validation
     * 
     * @param coverFile File ảnh cover
     * @param slug      Slug của comic
     * @return URL của ảnh cover đã upload
     */
    public String uploadThumbnail(MultipartFile coverFile, String slug) {
        if (coverFile == null || coverFile.isEmpty()) {
            return null;
        }

        BaseResponse<?> response = storageService.uploadFile(
                coverFile,
                B2Constants.FOLDER_KEY_THUMBNAIL,
                slug + "_thumb." + StringUtils.getExtension(coverFile.getOriginalFilename()));

        if (response.getStatus() != 200) {
            throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
        }

        return (String) response.getMessage();
    }

    /**
     * Xóa thumbnail cũ
     * 
     * @param thumbUrl URL của ảnh cover cũ
     */
    public void removeOldThumbnail(String thumbUrl) {
        if (thumbUrl != null && !thumbUrl.isEmpty() && thumbUrl.startsWith(B2Constants.URL_PREFIX)) {
            BaseResponse<?> response = storageService.remove(thumbUrl);
            if (response.getStatus() != 200) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
        }
    }

    /**
     * Rename thumbnail
     * 
     * @param currentThumbUrl URL của ảnh cover cũ
     * @param newSlug         Slug mới của comic
     * @return URL của ảnh cover đã đổi tên
     */
    public String renameThumbnail(String currentThumbUrl, String newSlug) {
        if (currentThumbUrl == null || currentThumbUrl.isEmpty()) {
            return null;
        }

        BaseResponse<?> response = storageService.rename(currentThumbUrl, newSlug + "_thumb");
        if (response.getStatus() != 200) {
            throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
        }

        return (String) response.getMessage();
    }

    /**
     * Xử lý upload file mới (xóa cũ nếu cần)
     * 
     * @param currentThumbUrl URL của ảnh cover cũ
     * @param slug            Slug của comic
     * @param cover           File ảnh cover mới
     * @param shouldRemoveOld true nếu cần xóa ảnh cover cũ
     * @return URL của ảnh cover đã upload
     */
    public String handleNewImageUpload(String currentThumbUrl, String slug, MultipartFile cover,
            boolean shouldRemoveOld) {
        // Xóa ảnh cũ nếu cần
        if (shouldRemoveOld) {
            removeOldThumbnail(currentThumbUrl);
        }

        // Upload ảnh mới
        return uploadThumbnail(cover, slug);
    }

    /**
     * Kiểm tra xem URL có phải là file từ B2 storage không
     * 
     * @param url URL cần kiểm tra
     * @return true nếu URL là từ B2 storage, ngược lại false
     */
    public boolean isB2StorageUrl(String url) {
        return url != null && !url.isEmpty() && url.startsWith(B2Constants.URL_PREFIX);
    }

    /**
     * Upload multiple files cho chapter images
     * 
     * @param image         File ảnh chapter
     * @param comicSlug     Slug của comic
     * @param chapterNumber Số thứ tự chapter
     * @param pageIndex     Số thứ tự trang
     * @return URL của ảnh chapter đã upload
     */
    public String uploadChapterImage(MultipartFile image, String comicSlug, Double chapterNumber, int pageIndex) {
        if (image == null || image.isEmpty()) {
            return null;
        }

        String fileName = String.format("%s_chapter_%s_page_%d.%s",
                comicSlug,
                chapterNumber.toString().replace(".", "_"),
                pageIndex + 1,
                StringUtils.getExtension(image.getOriginalFilename()));

        BaseResponse<?> response = storageService.uploadFile(
                image,
                B2Constants.FOLDER_KEY_COMIC, // Sử dụng FOLDER_KEY_COMIC cho chapter images
                fileName);

        if (response.getStatus() != 200) {
            throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
        }

        return (String) response.getMessage();
    }
}