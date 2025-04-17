package com.thjvjpxx.backend_comic.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.GoogleDriveConstants;
import com.thjvjpxx.backend_comic.dto.request.ChapterRequest;
import com.thjvjpxx.backend_comic.dto.request.DetailChapterRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.mapper.ChapterMapper;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.DetailChapter;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.repository.DetailChapterRepository;
import com.thjvjpxx.backend_comic.service.ChapterService;
import com.thjvjpxx.backend_comic.service.GoogleDriveService;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;
import com.thjvjpxx.backend_comic.utils.StringUtils;
import com.thjvjpxx.backend_comic.utils.ValidationUtils;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChapterServiceImpl implements ChapterService {
    ChapterRepository chapterRepository;
    ComicRepository comicRepository;
    ChapterMapper chapterMapper;
    GoogleDriveService googleDriveService;
    DetailChapterRepository detailChapterRepository;

    @Override
    public BaseResponse<?> getAllChapters(int page, int limit, String search, String comicId) {
        Pageable pageForQuery = PaginationUtils.createPageable(page, limit);
        int originalPage = page;

        Page<Chapter> chapters = null;
        Sort sort = Sort.by(Sort.Direction.ASC, "chapterNumber");
        PageRequest pageWithSort = PageRequest.of(pageForQuery.getPageNumber(), pageForQuery.getPageSize(), sort);

        if (search != null && !search.isEmpty() && comicId != null && !comicId.isEmpty()) {
            chapters = chapterRepository.findByTitleContainingAndComicId(search, comicId, pageWithSort);
        } else if (search != null && !search.isEmpty()) {
            chapters = chapterRepository.findByTitleContaining(search, pageWithSort);
        } else if (comicId != null && !comicId.isEmpty()) {
            chapters = chapterRepository.findByComicId(comicId, pageWithSort);
        } else {
            chapters = chapterRepository.findAll(pageWithSort);
        }

        List<Chapter> chapterList = chapters.getContent();

        if (chapterList.isEmpty()) {
            return BaseResponse.success(
                    new ArrayList<>(),
                    originalPage,
                    0,
                    limit,
                    0);
        }

        List<ChapterResponse> chapterResponses = chapterList.stream()
                .map(chapterMapper::toChapterResponse)
                .sorted((a, b) -> Integer.compare(a.getChapterNumber(), b.getChapterNumber()))
                .collect(Collectors.toList());

        return BaseResponse.success(
                chapterResponses,
                originalPage,
                (int) chapters.getTotalElements(),
                limit,
                chapters.getTotalPages());
    }

    private void validateChapterRequest(ChapterRequest chapterRequest) {
        if (chapterRequest == null) {
            throw new BaseException(ErrorCode.CHAPTER_REQUEST_NOT_NULL);
        }

        if (chapterRequest.getChapterNumber() < 0) {
            throw new BaseException(ErrorCode.CHAPTER_NUMBER_NOT_MIN);
        }

    }

    private void validateChapterNumber(ChapterRequest chapterRequest, String oldChapterId) {
        chapterRepository.findByChapterNumberAndComicId(
                chapterRequest.getChapterNumber(),
                chapterRequest.getComicId(),
                oldChapterId).ifPresent(
                        chapter -> {
                            throw new BaseException(ErrorCode.CHAPTER_NUMBER_EXISTS);
                        });
    }

    @Override
    public BaseResponse<?> createChapter(ChapterRequest chapterRequest, List<MultipartFile> files) {
        validateChapterRequest(chapterRequest);
        validateChapterNumber(chapterRequest, null);

        Chapter chapter = chapterMapper.toChapter(chapterRequest);
        Comic comic = comicRepository.findById(chapterRequest.getComicId())
                .orElseThrow(() -> new BaseException(ErrorCode.COMIC_NOT_FOUND));

        List<DetailChapter> detailChapters = new ArrayList<>();

        String folderName = String.format("chapter-%s", chapterRequest.getChapterNumber());

        String folderId = googleDriveService.getFileId(folderName, comic.getFolderId());
        if (folderId == null) {
            folderId = googleDriveService.createFolder(folderName, comic.getFolderId());
        }

        String imgUrl = null;
        int orderNumber = 1;

        for (var file : files) {
            String fileName = String.valueOf(orderNumber);
            var response = googleDriveService.uploadFileToFolder(file, fileName, folderId);

            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }

            imgUrl = response.getMessage();
            detailChapters.add(DetailChapter.builder()
                    .imgUrl(imgUrl)
                    .orderNumber(orderNumber)
                    .chapter(chapter)
                    .build());
            orderNumber++;
        }

        chapter.setComic(comic);
        chapter.setDetailChapters(detailChapters);

        chapterRepository.save(chapter);

        return BaseResponse.success(chapterMapper.toChapterResponse(chapter));
    }

    @Override
    public BaseResponse<?> updateChapter(String id, ChapterRequest chapterRequest, List<MultipartFile> files) {
        ValidationUtils.checkNullId(id);
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));

        // Cập nhật thông tin cơ bản
        chapter.setTitle(chapterRequest.getTitle());
        chapter.setChapterNumber(chapterRequest.getChapterNumber());
        chapterRepository.save(chapter);

        // Nếu không có thông tin chi tiết chương, không cần xử lý ảnh
        if (chapterRequest.getDetailChapters() == null || chapterRequest.getDetailChapters().isEmpty()) {
            return BaseResponse.success(chapterMapper.toChapterResponse(chapter));
        }

        // 1. Lấy danh sách chi tiết hiện tại
        List<DetailChapter> existingDetails = detailChapterRepository.findByChapterId(id);

        // 2. Tạo danh sách chi tiết mới
        List<DetailChapter> newDetails = new ArrayList<>();

        // 3. Map để lưu chi tiết cũ theo URL
        Map<String, DetailChapter> existingDetailsMap = existingDetails.stream()
                .collect(Collectors.toMap(DetailChapter::getImgUrl, Function.identity(), (a, b) -> a));

        // 4. Tạo danh sách các chi tiết sẽ bị xóa
        List<DetailChapter> detailsToRemove = new ArrayList<>(existingDetails);

        // 5. Biến để theo dõi index của file mới
        int fileIndex = 0;

        // Lấy folderId của comic
        Comic comic = chapter.getComic();
        String folderName = String.format("chapter-%s", chapter.getChapterNumber());

        // 6. Xử lý từng chi tiết từ request
        for (DetailChapterRequest detailRequest : chapterRequest.getDetailChapters()) {
            // Kiểm tra nếu chi tiết cần xóa thì bỏ qua
            if (detailRequest.isHasRemove()) {
                // Tìm và xóa file ảnh trên Google Drive nếu cần
                if (detailRequest.getImgUrl() != null && !detailRequest.getImgUrl().isEmpty()
                        && !detailRequest.getImgUrl().startsWith("blob:")) {
                    if (detailRequest.getImgUrl().startsWith(GoogleDriveConstants.URL_IMG_GOOGLE_DRIVE)) {
                        // Xóa file trên Google Drive
                        String idOld = StringUtils.getIdFromUrl(detailRequest.getImgUrl());
                        googleDriveService.remove(idOld);
                    }

                    // Tìm và lấy bản ghi cần xóa
                    DetailChapter detailToRemove = existingDetails.stream()
                            .filter(detailChapter -> detailChapter.getImgUrl() != null &&
                                    detailChapter.getImgUrl().equals(detailRequest.getImgUrl()))
                            .findFirst()
                            .orElse(null);

                    // Nếu tìm thấy thì xóa bằng ID
                    if (detailToRemove != null) {
                        detailChapterRepository.deleteById(detailToRemove.getId());
                        // Đảm bảo loại bỏ khỏi danh sách
                        existingDetails.remove(detailToRemove);
                        detailsToRemove.remove(detailToRemove);
                    }
                }
                continue; // Bỏ qua không thêm vào danh sách chi tiết mới
            }

            DetailChapter detail;

            if (detailRequest.isNewImage()) {
                detail = new DetailChapter();
                // Tạo mới chi tiết
                detail.setChapter(chapter);
                // 6.1. Đây là ảnh mới, cần tạo mới và upload file
                if (files != null && fileIndex < files.size()) {
                    // Kiểm tra và lấy folder ID của chapter
                    String folderId = googleDriveService.getFileId(folderName, comic.getFolderId());
                    if (folderId == null) {
                        folderId = googleDriveService.createFolder(folderName, comic.getFolderId());
                    }

                    // Tìm detailChapter cũ bằng orderNumber và xử lý an toàn
                    existingDetails.stream()
                            .filter(detailChapter -> detailChapter.getOrderNumber() == detailRequest.getOrderNumber())
                            .findFirst()
                            .ifPresent(detailChapter -> {
                                String urlOld = detailChapter.getImgUrl();
                                if (urlOld != null && !urlOld.isEmpty()) {
                                    String idOld = StringUtils.getIdFromUrl(urlOld);
                                    googleDriveService.remove(idOld);
                                }
                            });

                    // Xoá file cũ trong folder
                    // Upload file mới vào Google Drive và lấy URL
                    String fileName = String.valueOf(detailRequest.getOrderNumber());
                    var response = googleDriveService.uploadFileToFolder(files.get(fileIndex), fileName, folderId);

                    if (response.getStatus() != HttpStatus.OK.value()) {
                        throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
                    }

                    detail.setImgUrl(response.getMessage());
                    fileIndex++;
                } else {
                    detail.setImgUrl(detailRequest.getImgUrl());
                }
            } else {
                // 6.2. Đây là ảnh cũ
                String imgUrl = detailRequest.getImgUrl();

                // Kiểm tra xem có phải là URL blob không
                if (imgUrl != null && imgUrl.startsWith("blob:")) {
                    // Nếu là URL blob nhưng không có file tương ứng, bỏ qua
                    if (fileIndex < files.size()) {
                        // Tạo mới chi tiết
                        detail = new DetailChapter();
                        detail.setChapter(chapter);

                        // Kiểm tra và lấy folder ID của chapter
                        String folderId = googleDriveService.getFileId(folderName, comic.getFolderId());
                        if (folderId == null) {
                            folderId = googleDriveService.createFolder(folderName, comic.getFolderId());
                        }

                        // Upload file mới vào Google Drive và lấy URL
                        String fileName = String.valueOf(detailRequest.getOrderNumber());
                        var response = googleDriveService.uploadFileToFolder(files.get(fileIndex), fileName, folderId);

                        if (response.getStatus() != HttpStatus.OK.value()) {
                            throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
                        }

                        detail.setImgUrl(response.getMessage());
                        fileIndex++;
                    } else {
                        continue; // Bỏ qua nếu không có file tương ứng
                    }
                } else {
                    // Đây là URL Google Drive hợp lệ, kiểm tra xem có tồn tại không
                    detail = existingDetailsMap.get(imgUrl);
                    if (detail != null) {
                        // Nếu tìm thấy, loại bỏ khỏi danh sách cần xóa
                        detailsToRemove.remove(detail);
                    } else {
                        // Nếu không tìm thấy, tạo mới
                        detail = new DetailChapter();
                        detail.setChapter(chapter);
                        detail.setImgUrl(imgUrl);
                    }
                }
            }
            // 6.4. Thêm vào danh sách chi tiết mới
            detail.setOrderNumber(detailRequest.getOrderNumber());
            newDetails.add(detail);
        }

        // 7. Xóa các chi tiết không còn sử dụng
        if (!detailsToRemove.isEmpty()) {
            detailChapterRepository.deleteAll(detailsToRemove);
        }

        // 8. Lưu tất cả chi tiết mới
        detailChapterRepository.saveAll(newDetails);

        // 9. Xử lý lại thứ tự tên file trên Google Drive
        if (!newDetails.isEmpty()) {
            String folderId = googleDriveService.getFileId(folderName, comic.getFolderId());

            if (folderId != null) {
                // Sắp xếp lại danh sách theo orderNumber
                List<DetailChapter> sortedDetails = newDetails.stream()
                        .sorted((a, b) -> Integer.compare(a.getOrderNumber(), b.getOrderNumber()))
                        .collect(Collectors.toList());

                // Duyệt qua và đổi tên file nếu cần
                for (int i = 0; i < sortedDetails.size(); i++) {
                    DetailChapter detail = sortedDetails.get(i);
                    // Tạo tên file theo định dạng "image_[orderNumber]" để tránh trùng lặp
                    String newFileName = "image_" + detail.getOrderNumber();

                    // Lấy ID file từ URL
                    String fileId = StringUtils.getIdFromUrl(detail.getImgUrl());
                    if (fileId != null) {
                        // Đổi tên file trên Google Drive
                        googleDriveService.rename(fileId, newFileName);
                    }
                }
            }
        }

        return BaseResponse.success(chapterMapper.toChapterResponse(chapter));
    }

    @Override
    @Transactional
    public BaseResponse<?> deleteChapter(String id) {
        ValidationUtils.checkNullId(id);
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));

        if (chapter.getDetailChapters().size() > 0
                && (chapter.getDomainCdn() == null || chapter.getChapterPath() == null)) {
            String folderName = String.format("chapter-%s", chapter.getChapterNumber());
            String folderId = googleDriveService.getFileId(folderName, chapter.getComic().getFolderId());
            if (folderId != null) {
                googleDriveService.remove(folderId);
            }
        }
        chapterRepository.delete(chapter);

        return BaseResponse.success(chapterMapper.toChapterResponse(chapter));
    }

}
