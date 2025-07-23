package com.thjvjpxx.backend_comic.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.B2Constants;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.FileItemResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.service.StorageService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CopyObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Object;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StorageServiceImpl implements StorageService {
    final S3Client s3Client;

    @Value("${b2.bucket-name}")
    String bucketName;

    @Override
    public BaseResponse<?> uploadFile(MultipartFile file, String typeFolder, String folder) {
        String folderName;
        switch (typeFolder) {
            case B2Constants.FOLDER_KEY_THUMBNAIL:
                folderName = B2Constants.FOLDER_KEY_THUMBNAIL;
                break;
            case B2Constants.FOLDER_KEY_COMIC:
                folderName = B2Constants.FOLDER_KEY_COMIC;
                break;
            case B2Constants.FOLDER_KEY_LEVEL:
                folderName = B2Constants.FOLDER_KEY_LEVEL;
                break;
            case B2Constants.FOLDER_KEY_AVATAR:
                folderName = B2Constants.FOLDER_KEY_AVATAR;
                break;
            default:
                throw new BaseException(ErrorCode.TYPE_NOT_FOUND);
        }
        folderName += "/" + folder;
        return uploadFileToFolder(file, folderName);
    }

    private BaseResponse<?> uploadFileToFolder(MultipartFile file, String key) {
        if (file.isEmpty()) {
            throw new BaseException(ErrorCode.FILE_NOT_FOUND);
        }

        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            String url = getPublicUrl(key);
            return BaseResponse.success(url);
        } catch (IOException e) {
            throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
        }
    }

    @Override
    public BaseResponse<?> remove(String url) {
        try {
            String actualKey = url;
            if (url.startsWith(B2Constants.URL_PREFIX)) {
                String urlWithoutPrefix = url.substring(B2Constants.URL_PREFIX.length());
                String expectedPrefix = bucketName + "/";
                if (urlWithoutPrefix.startsWith(expectedPrefix)) {
                    String keyWithQueryParams = urlWithoutPrefix.substring(expectedPrefix.length());
                    // Loại bỏ query parameters (phần sau dấu ?)
                    int queryParamIndex = keyWithQueryParams.indexOf('?');
                    if (queryParamIndex != -1) {
                        actualKey = keyWithQueryParams.substring(0, queryParamIndex);
                    } else {
                        actualKey = keyWithQueryParams;
                    }
                } else {
                    throw new BaseException(ErrorCode.INVALID_ARGUMENT);
                }
            }

            // Kiểm tra xem đây có phải là thư mục không (không có extension file)
            if (!actualKey.contains(".") || actualKey.endsWith("/")) {
                // Đây là thư mục - xóa tất cả files bên trong
                return removeFolder(actualKey);
            } else {
                // Đây là file đơn lẻ
                return removeFile(actualKey);
            }
        } catch (BaseException e) {
            throw e;
        } catch (Exception e) {
            throw new BaseException(ErrorCode.DELETE_FILE_FAILED);
        }
    }

    /**
     * Xóa một file đơn lẻ
     */
    private BaseResponse<?> removeFile(String key) {
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build());

            return BaseResponse.success("Xóa file thành công");
        } catch (Exception e) {
            throw new BaseException(ErrorCode.DELETE_FILE_FAILED);
        }
    }

    /**
     * Xóa thư mục và tất cả nội dung bên trong
     */
    private BaseResponse<?> removeFolder(String folderKey) {
        try {
            // Chuẩn hóa folder path
            String folderPrefix = folderKey;
            if (!folderPrefix.isEmpty() && !folderPrefix.endsWith("/")) {
                folderPrefix += "/";
            }

            List<ObjectIdentifier> objectsToDelete = new ArrayList<>();
            String continuationToken = null;
            int totalDeleted = 0;

            do {
                // List tất cả objects có prefix là folderPrefix
                ListObjectsV2Request.Builder requestBuilder = ListObjectsV2Request.builder()
                        .bucket(bucketName)
                        .prefix(folderPrefix)
                        .maxKeys(1000); // Giới hạn số lượng objects mỗi lần request

                if (continuationToken != null) {
                    requestBuilder.continuationToken(continuationToken);
                }

                ListObjectsV2Response response = s3Client.listObjectsV2(requestBuilder.build());

                // Thêm tất cả objects vào danh sách xóa
                for (S3Object s3Object : response.contents()) {
                    objectsToDelete.add(ObjectIdentifier.builder()
                            .key(s3Object.key())
                            .build());
                }

                // Nếu có quá nhiều objects, xóa theo batch
                if (objectsToDelete.size() >= 1000) {
                    deleteObjectsBatch(objectsToDelete);
                    totalDeleted += objectsToDelete.size();
                    objectsToDelete.clear();
                }

                continuationToken = response.nextContinuationToken();
            } while (continuationToken != null);

            // Xóa batch cuối cùng (nếu có)
            if (!objectsToDelete.isEmpty()) {
                deleteObjectsBatch(objectsToDelete);
                totalDeleted += objectsToDelete.size();
            }

            if (totalDeleted > 0) {
                return BaseResponse.success("Xóa thư mục thành công. Đã xóa " + totalDeleted + " file(s)");
            } else {
                return BaseResponse.success("Thư mục không tồn tại hoặc đã trống");
            }
        } catch (Exception e) {
            throw new BaseException(ErrorCode.DELETE_FILE_FAILED);
        }
    }

    /**
     * Xóa một batch objects bằng cách xóa từng file một
     * (Tránh bulk delete để không gây lỗi checksum với Backblaze B2)
     */
    private void deleteObjectsBatch(List<ObjectIdentifier> objectsToDelete) {
        if (objectsToDelete.isEmpty()) {
            return;
        }

        // Xóa từng object một để tránh lỗi checksum với bulk delete
        for (ObjectIdentifier objectId : objectsToDelete) {
            try {
                s3Client.deleteObject(DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(objectId.key())
                        .build());
            } catch (Exception e) {
                // Log lỗi nhưng tiếp tục xóa các file khác
                System.err.println("Lỗi khi xóa file: " + objectId.key() + " - " + e.getMessage());
            }
        }
    }

    private String getPublicUrl(String key) {
        String version = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return B2Constants.URL_PREFIX + bucketName + "/" + key + "?v=" + version;
    }

    @Override
    public BaseResponse<?> rename(String url, String newName) {
        try {
            // Lấy key cũ từ URL
            String oldKey = url;
            if (url.startsWith(B2Constants.URL_PREFIX)) {
                String urlWithoutPrefix = url.substring(B2Constants.URL_PREFIX.length());
                String expectedPrefix = bucketName + "/";
                if (urlWithoutPrefix.startsWith(expectedPrefix)) {
                    String keyWithQueryParams = urlWithoutPrefix.substring(expectedPrefix.length());
                    // Loại bỏ query parameters (phần sau dấu ?)
                    int queryParamIndex = keyWithQueryParams.indexOf('?');
                    if (queryParamIndex != -1) {
                        oldKey = keyWithQueryParams.substring(0, queryParamIndex);
                    } else {
                        oldKey = keyWithQueryParams;
                    }
                } else {
                    throw new BaseException(ErrorCode.INVALID_ARGUMENT);
                }
            }

            // Kiểm tra xem đây có phải là folder không
            if (isFolder(oldKey)) {
                return renameFolder(oldKey, newName);
            } else {
                return renameFile(oldKey, newName);
            }
        } catch (BaseException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new BaseException(ErrorCode.RENAME_FILE_FAILED);
        }
    }

    /**
     * Kiểm tra xem key có phải là folder không
     */
    private boolean isFolder(String key) {
        // Folder thường kết thúc bằng "/" hoặc không có extension file
        return key.endsWith("/") || (!key.contains(".") && !key.isEmpty());
    }

    /**
     * Đổi tên file đơn lẻ
     */
    private BaseResponse<?> renameFile(String oldKey, String newName) {
        try {
            String[] pathParts = oldKey.split("/");
            if (pathParts.length < 1) {
                throw new BaseException(ErrorCode.INVALID_ARGUMENT);
            }

            // Tạo key mới bằng cách thay thế tên file
            StringBuilder newKeyBuilder = new StringBuilder();
            for (int i = 0; i < pathParts.length - 1; i++) {
                newKeyBuilder.append(pathParts[i]).append("/");
            }
            newKeyBuilder.append(newName);
            String newKey = newKeyBuilder.toString();

            // Copy object với key mới
            s3Client.copyObject(CopyObjectRequest.builder()
                    .sourceBucket(bucketName)
                    .sourceKey(oldKey)
                    .destinationBucket(bucketName)
                    .destinationKey(newKey)
                    .build());

            // Xóa object cũ
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(oldKey)
                    .build());

            // Trả về URL mới
            String newUrl = getPublicUrl(newKey);
            return BaseResponse.success(newUrl);
        } catch (Exception e) {
            throw new BaseException(ErrorCode.RENAME_FILE_FAILED);
        }
    }

    /**
     * Đổi tên folder và tất cả nội dung bên trong
     */
    private BaseResponse<?> renameFolder(String oldFolderKey, String newName) {
        try {
            // Chuẩn hóa folder path cũ
            String oldFolderPrefix = oldFolderKey;
            if (!oldFolderPrefix.isEmpty() && !oldFolderPrefix.endsWith("/")) {
                oldFolderPrefix += "/";
            }

            // Tạo folder path mới
            String[] pathParts = oldFolderKey.split("/");
            if (pathParts.length < 1) {
                throw new BaseException(ErrorCode.INVALID_ARGUMENT);
            }

            StringBuilder newFolderPrefixBuilder = new StringBuilder();
            for (int i = 0; i < pathParts.length - 1; i++) {
                if (!pathParts[i].isEmpty()) {
                    newFolderPrefixBuilder.append(pathParts[i]).append("/");
                }
            }
            newFolderPrefixBuilder.append(newName);
            if (!newFolderPrefixBuilder.toString().endsWith("/")) {
                newFolderPrefixBuilder.append("/");
            }
            String newFolderPrefix = newFolderPrefixBuilder.toString();

            // Lấy danh sách tất cả objects trong folder cũ
            List<S3Object> objectsToRename = new ArrayList<>();
            String continuationToken = null;

            do {
                ListObjectsV2Request.Builder requestBuilder = ListObjectsV2Request.builder()
                        .bucket(bucketName)
                        .prefix(oldFolderPrefix)
                        .maxKeys(1000);

                if (continuationToken != null) {
                    requestBuilder.continuationToken(continuationToken);
                }

                ListObjectsV2Response response = s3Client.listObjectsV2(requestBuilder.build());
                objectsToRename.addAll(response.contents());
                continuationToken = response.nextContinuationToken();
            } while (continuationToken != null);

            if (objectsToRename.isEmpty()) {
                throw new BaseException(ErrorCode.FILE_NOT_FOUND);
            }

            int renamedCount = 0;
            List<String> failedFiles = new ArrayList<>();

            // Copy tất cả objects với tên mới
            for (S3Object s3Object : objectsToRename) {
                try {
                    String oldObjectKey = s3Object.key();
                    String relativePath = oldObjectKey.substring(oldFolderPrefix.length());
                    String newObjectKey = newFolderPrefix + relativePath;

                    // Copy object
                    s3Client.copyObject(CopyObjectRequest.builder()
                            .sourceBucket(bucketName)
                            .sourceKey(oldObjectKey)
                            .destinationBucket(bucketName)
                            .destinationKey(newObjectKey)
                            .build());

                    renamedCount++;
                } catch (Exception e) {
                    failedFiles.add(s3Object.key());
                    System.err.println("Lỗi khi copy file: " + s3Object.key() + " - " + e.getMessage());
                }
            }

            // Xóa tất cả objects cũ nếu copy thành công
            if (failedFiles.isEmpty()) {
                for (S3Object s3Object : objectsToRename) {
                    try {
                        s3Client.deleteObject(DeleteObjectRequest.builder()
                                .bucket(bucketName)
                                .key(s3Object.key())
                                .build());
                    } catch (Exception e) {
                        System.err.println("Lỗi khi xóa file cũ: " + s3Object.key() + " - " + e.getMessage());
                    }
                }
            } else {
                // Nếu có lỗi, rollback các file đã copy
                for (S3Object s3Object : objectsToRename) {
                    if (!failedFiles.contains(s3Object.key())) {
                        try {
                            String oldObjectKey = s3Object.key();
                            String relativePath = oldObjectKey.substring(oldFolderPrefix.length());
                            String newObjectKey = newFolderPrefix + relativePath;

                            s3Client.deleteObject(DeleteObjectRequest.builder()
                                    .bucket(bucketName)
                                    .key(newObjectKey)
                                    .build());
                        } catch (Exception e) {
                            System.err.println("Lỗi khi rollback file: " + s3Object.key() + " - " + e.getMessage());
                        }
                    }
                }
                throw new BaseException(ErrorCode.RENAME_FILE_FAILED);
            }

            // Trả về thông tin thành công
            String message = String.format("Đổi tên folder thành công. Đã xử lý %d file(s)", renamedCount);
            return BaseResponse.success(message);

        } catch (BaseException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new BaseException(ErrorCode.RENAME_FILE_FAILED);
        }
    }

    @Override
    public BaseResponse<?> getAllFiles(String folder) {
        try {
            // Chuẩn hóa folder path
            String folderPrefix = folder;
            if (!folderPrefix.isEmpty() && !folderPrefix.endsWith("/")) {
                folderPrefix += "/";
            }

            List<FileItemResponse> items = new ArrayList<>();
            Set<String> processedFolders = new HashSet<>();
            String continuationToken = null;

            do {
                // Tạo request để list objects
                ListObjectsV2Request.Builder requestBuilder = ListObjectsV2Request.builder()
                        .bucket(bucketName)
                        .prefix(folderPrefix)
                        .maxKeys(1000);

                if (continuationToken != null) {
                    requestBuilder.continuationToken(continuationToken);
                }

                ListObjectsV2Response response = s3Client.listObjectsV2(requestBuilder.build());

                // Xử lý từng object trong response
                for (S3Object s3Object : response.contents()) {
                    String objectKey = s3Object.key();

                    // Bỏ qua object nếu đó chính là folder prefix
                    if (objectKey.equals(folderPrefix)) {
                        continue;
                    }

                    // Lấy phần path sau folder prefix
                    String relativePath = objectKey.substring(folderPrefix.length());

                    // Kiểm tra xem đây có phải là file trực tiếp trong folder hay nằm trong
                    // subfolder
                    if (relativePath.contains("/")) {
                        // Đây là file trong subfolder, chỉ lấy tên subfolder
                        String subfolderName = relativePath.substring(0, relativePath.indexOf("/"));
                        String subfolderPath = folderPrefix + subfolderName;

                        // Kiểm tra xem đã xử lý subfolder này chưa
                        if (!processedFolders.contains(subfolderPath)) {
                            processedFolders.add(subfolderPath);
                            items.add(new FileItemResponse(
                                    subfolderName,
                                    subfolderPath,
                                    null, // Folder không có URL
                                    "folder",
                                    null, // Folder không có size
                                    null, // Không lấy lastModified cho folder để tối ưu performance
                                    null // Folder không có contentType
                            ));
                        }
                    } else {
                        // Đây là file trực tiếp trong folder
                        String fileName = relativePath;
                        items.add(new FileItemResponse(
                                fileName,
                                objectKey,
                                getPublicUrl(objectKey),
                                "file",
                                s3Object.size(),
                                LocalDateTime.ofInstant(s3Object.lastModified(), ZoneId.systemDefault()),
                                determineContentType(fileName)));
                    }
                }

                continuationToken = response.nextContinuationToken();
            } while (continuationToken != null);

            return BaseResponse.success(items);
        } catch (Exception e) {
            throw new BaseException(ErrorCode.HAS_ERROR);
        }
    }

    /**
     * Xác định content type dựa trên extension của file
     */
    private String determineContentType(String fileName) {
        if (fileName == null) {
            return "application/octet-stream";
        }

        String lowerFileName = fileName.toLowerCase();

        // Image types
        if (lowerFileName.endsWith(".jpg") || lowerFileName.endsWith(".jpeg")) {
            return "image/jpeg";
        }
        if (lowerFileName.endsWith(".png")) {
            return "image/png";
        }
        if (lowerFileName.endsWith(".gif")) {
            return "image/gif";
        }
        if (lowerFileName.endsWith(".webp")) {
            return "image/webp";
        }
        if (lowerFileName.endsWith(".svg")) {
            return "image/svg+xml";
        }

        // Document types
        if (lowerFileName.endsWith(".pdf")) {
            return "application/pdf";
        }
        if (lowerFileName.endsWith(".txt")) {
            return "text/plain";
        }

        // Default
        return "application/octet-stream";
    }
}
