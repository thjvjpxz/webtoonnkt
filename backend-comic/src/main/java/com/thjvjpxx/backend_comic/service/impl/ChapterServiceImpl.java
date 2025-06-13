package com.thjvjpxx.backend_comic.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.B2Constants;
import com.thjvjpxx.backend_comic.dto.request.ChapterRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse.DetailChapterResponse;
import com.thjvjpxx.backend_comic.enums.ChapterStatus;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.DetailChapter;
import com.thjvjpxx.backend_comic.model.Level;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.service.ChapterService;
import com.thjvjpxx.backend_comic.service.StorageService;
import com.thjvjpxx.backend_comic.utils.ChapterUtils;
import com.thjvjpxx.backend_comic.utils.ComicUtils;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;
import com.thjvjpxx.backend_comic.utils.ValidationUtils;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChapterServiceImpl implements ChapterService {
    final ChapterRepository chapterRepository;
    final ComicRepository comicRepository;
    final StorageService b2StorageService;
    final ComicUtils comicUtils;

    @Value("${b2.bucketName}")
    String bucketName;

    final ChapterUtils chapterUtils;

    /**
     * Lấy danh sách chương
     * 
     * @param page    trang hiện tại
     * @param limit   số lượng phần tử trên mỗi trang
     * @param search  từ khóa tìm kiếm
     * @param comicId id của comic
     * @return BaseResponse<?>
     */
    @Override
    public BaseResponse<?> getAllChapters(int page, int limit, String search, String comicId) {
        Pageable pageForQuery = PaginationUtils.createPageableWithSort(page, limit, "updatedAt",
                Sort.Direction.DESC);
        int originalPage = page;

        Page<Chapter> chapters = null;

        if (search != null && !search.isEmpty() && comicId != null && !comicId.isEmpty()) {
            chapters = chapterRepository.findByTitleContainingAndComicId(search, comicId, pageForQuery);
        } else if (search != null && !search.isEmpty()) {
            chapters = chapterRepository.findByTitleContaining(search, pageForQuery);
        } else if (comicId != null && !comicId.isEmpty()) {
            chapters = chapterRepository.findByComicId(comicId, pageForQuery);
        } else {
            chapters = chapterRepository.findAll(pageForQuery);
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

        List<ChapterResponse> chapterResponses = new ArrayList<>();
        for (Chapter chapter : chapterList) {
            List<DetailChapterResponse> detailChapterResponses = chapter.getDetailChapters().stream()
                    .map(detailChapter -> DetailChapterResponse.builder()
                            .id(detailChapter.getId())
                            .imgUrl(detailChapter.getImgUrl())
                            .orderNumber(detailChapter.getOrderNumber())
                            .build())
                    .collect(Collectors.toList());

            String publisherName = chapter.getComic().getPublisher() != null
                    ? chapter.getComic().getPublisher().getUsername()
                    : null;
            Level publisherLevel = chapter.getComic().getPublisher() != null
                    ? chapter.getComic().getPublisher().getLevel()
                    : null;

            ChapterResponse chapterResponse = chapterUtils.convertChapterToChapterResponse(chapter,
                    detailChapterResponses, publisherName, publisherLevel);

            chapterResponses.add(chapterResponse);
        }

        return BaseResponse.success(
                chapterResponses,
                originalPage,
                (int) chapters.getTotalElements(),
                limit,
                chapters.getTotalPages());
    }

    /**
     * Validate chapter request
     * 
     * @param chapterRequest
     */
    private void validateChapterRequest(ChapterRequest chapterRequest) {
        if (chapterRequest == null) {
            throw new BaseException(ErrorCode.CHAPTER_REQUEST_NOT_NULL);
        }

        if (chapterRequest.getChapterNumber() < 0) {
            throw new BaseException(ErrorCode.CHAPTER_NUMBER_NOT_MIN);
        }

    }

    /**
     * Validate chapter number
     * 
     * @param chapterRequest
     */
    private void validateChapterNumber(ChapterRequest chapterRequest) {
        chapterRepository.findByComicIdAndChapterNumber(
                chapterRequest.getComicId(),
                chapterRequest.getChapterNumber()).ifPresent(
                        chapter -> {
                            throw new BaseException(ErrorCode.CHAPTER_NUMBER_EXISTS);
                        });
    }

    /**
     * Validate chapter number cho update
     * 
     * @param chapterRequest
     * @param currentChapterId
     */
    private void validateChapterNumberForUpdate(ChapterRequest chapterRequest, String currentChapterId) {
        chapterRepository.findByChapterNumberAndComicId(
                chapterRequest.getChapterNumber(),
                chapterRequest.getComicId(),
                currentChapterId).ifPresent(
                        chapter -> {
                            throw new BaseException(ErrorCode.CHAPTER_NUMBER_EXISTS);
                        });
    }

    /**
     * Tạo chương mới
     * 
     * @param chapterRequest
     * @param files
     * @return BaseResponse<?>
     */
    @Override
    @Transactional
    public BaseResponse<?> createChapter(ChapterRequest chapterRequest, List<MultipartFile> files, User publisher) {

        if (publisher != null) {
            comicUtils.validateComicOwnershipByComicId(publisher, chapterRequest.getComicId());
        }

        validateChapterRequest(chapterRequest);
        validateChapterNumber(chapterRequest);

        Chapter chapter = Chapter.builder()
                .title(chapterRequest.getTitle())
                .chapterNumber(chapterRequest.getChapterNumber())
                .status(chapterRequest.getStatus())
                .price(chapterRequest.getStatus() == ChapterStatus.FREE ? 0.0 : chapterRequest.getPrice())
                .build();

        String path = null;
        String domainCdn = null;

        List<DetailChapter> detailChapters = null;

        Comic comic = comicRepository.findById(chapterRequest.getComicId())
                .orElseThrow(() -> new BaseException(ErrorCode.COMIC_NOT_FOUND));

        if (chapterRequest.getIsFileUploaded()) {
            // Lưu vào path: /comics/slugComic/slugChapter/
            path = String.format(
                    "%s/chapter-%s",
                    comic.getSlug(),
                    chapterRequest.getChapterNumber());
            detailChapters = handleIsFileUploaded(files, path, chapter);

            domainCdn = B2Constants.URL_PREFIX + bucketName + "/" + B2Constants.FOLDER_KEY_COMIC;
        } else {
            detailChapters = handleIsNotFileUploaded(chapterRequest, chapter);
        }

        chapter.setComic(comic);
        chapter.setDetailChapters(detailChapters);
        chapter.setChapterPath(path);
        chapter.setDomainCdn(domainCdn);

        chapterRepository.save(chapter);

        return BaseResponse.success("Thêm chương " + chapter.getChapterNumber() + " thành công");
    }

    /**
     * Xử lý khi là dạng file
     * 
     * @param files
     * @param key
     * @param chapter
     * @return List<DetailChapter>
     */
    private List<DetailChapter> handleIsFileUploaded(List<MultipartFile> files, String slugChapter, Chapter chapter) {
        List<DetailChapter> detailChapters = new ArrayList<>();

        String fileName = null;
        String pathName = null;
        int orderNumber = 1;

        for (var file : files) {
            fileName = file.getOriginalFilename();
            pathName = slugChapter + "/" + fileName;

            var response = b2StorageService.uploadFile(file, B2Constants.FOLDER_KEY_COMIC, pathName);

            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }

            var splitUrl = response.getMessage().split("/");
            fileName = splitUrl[splitUrl.length - 1];

            detailChapters.add(DetailChapter.builder()
                    .imgUrl(fileName)
                    .orderNumber(orderNumber)
                    .chapter(chapter)
                    .build());
            orderNumber++;
        }

        return detailChapters;
    }

    /**
     * Xử lý khi là dạng url
     * 
     * @param chapterRequest
     * @param chapter
     * @return List<DetailChapter>
     */
    private List<DetailChapter> handleIsNotFileUploaded(ChapterRequest chapterRequest, Chapter chapter) {
        List<DetailChapter> detailChapters = new ArrayList<>();

        for (var item : chapterRequest.getDetailChapters()) {

            if ("https://sv1.otruyencdn.com".contains(item.getImgUrl())) {
                item.setImgUrl(extractFilenameFromCdnUrl(item.getImgUrl()));
            }

            DetailChapter detailChapter = DetailChapter.builder()
                    .chapter(chapter)
                    .imgUrl(item.getImgUrl())
                    .orderNumber(item.getOrderNumber())
                    .build();
            detailChapters.add(detailChapter);
        }

        return detailChapters;
    }

    /**
     * Extract filename từ CDN URL
     * Ví dụ:
     * https://cdn.kimthi1708.id.vn/file/webtoon-thjvjpxx/comics/thidz/chapter-1.0/3.jpg?v=20250611112659
     * -> 3.jpg?v=20250611112659
     * 
     * @param fullUrl URL đầy đủ từ CDN
     * @return filename hoặc URL gốc nếu không phải CDN URL
     */
    private String extractFilenameFromCdnUrl(String fullUrl) {
        if (fullUrl == null || fullUrl.trim().isEmpty()) {
            return fullUrl;
        }

        // Kiểm tra nếu là blob URL thì bỏ qua (sẽ được xử lý từ file upload)
        if (fullUrl.startsWith("blob:")) {
            return null;
        }

        // Kiểm tra nếu là CDN URL
        if (fullUrl.contains(B2Constants.URL_PREFIX)) {
            // Tìm vị trí cuối cùng của dấu "/"
            int lastSlashIndex = fullUrl.lastIndexOf('/');
            if (lastSlashIndex != -1 && lastSlashIndex < fullUrl.length() - 1) {
                return fullUrl.substring(lastSlashIndex + 1);
            }
        }

        if (fullUrl.contains("https://sv1.otruyencdn.com")) {
            String[] splitUrl = fullUrl.split("/");
            return splitUrl[splitUrl.length - 1];
        }

        // Trả về URL gốc nếu không phải CDN URL
        return fullUrl;
    }

    /**
     * Cập nhật chương
     * 
     * @param id             id của chương
     * @param chapterRequest thông tin cập nhật
     * @param files          danh sách file upload (có thể null)
     * @return BaseResponse<?>
     */
    @Override
    @Transactional
    public BaseResponse<?> updateChapter(String id, ChapterRequest chapterRequest, List<MultipartFile> files,
            User publisher) {
        if (publisher != null) {
            comicUtils.validateComicOwnershipByComicId(publisher, chapterRequest.getComicId());
        }

        // Validate input
        ValidationUtils.checkNullId(id);
        validateChapterRequest(chapterRequest);

        // Tìm chapter hiện tại
        Chapter existingChapter = chapterRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));

        // Validate comic tồn tại
        Comic comic = comicRepository.findById(chapterRequest.getComicId())
                .orElseThrow(() -> new BaseException(ErrorCode.COMIC_NOT_FOUND));

        // Validate chapter number không trùng lặp (trừ chính nó)
        if (!existingChapter.getChapterNumber().equals(chapterRequest.getChapterNumber())) {
            validateChapterNumberForUpdate(chapterRequest, id);
        }

        // Cập nhật thông tin cơ bản
        existingChapter.setTitle(chapterRequest.getTitle());
        existingChapter.setStatus(chapterRequest.getStatus());
        existingChapter.setPrice(chapterRequest.getStatus() == ChapterStatus.FREE ? 0.0 : chapterRequest.getPrice());

        String path = existingChapter.getChapterPath();
        String domainCdn = existingChapter.getDomainCdn();
        List<DetailChapter> newDetailChapters = new ArrayList<>();

        // Kiểm tra nếu chapterNumber thay đổi và chapter có file trên storage
        boolean chapterNumberChanged = !existingChapter.getChapterNumber().equals(chapterRequest.getChapterNumber());
        if (chapterNumberChanged && path != null) {
            // Tạo path mới với chapterNumber mới
            String newPath = String.format(
                    "%s/chapter-%s",
                    comic.getSlug(),
                    chapterRequest.getChapterNumber());

            // Đổi tên folder trên storage từ path cũ sang path mới
            String oldFolderUrl = B2Constants.FOLDER_KEY_COMIC + "/" + path + "/";
            String newFolderName = "chapter-" + chapterRequest.getChapterNumber();

            try {
                // Sử dụng rename method của StorageService để đổi tên folder
                var renameResponse = b2StorageService.rename(oldFolderUrl, newFolderName);

                if (renameResponse.getStatus() == 200) {
                    path = newPath;
                } else {
                    throw new BaseException(ErrorCode.RENAME_FILE_FAILED);
                }

            } catch (Exception e) {
                throw new BaseException(ErrorCode.RENAME_FILE_FAILED);
            }
        }

        // Cập nhật chapterNumber sau khi xử lý path
        existingChapter.setChapterNumber(chapterRequest.getChapterNumber());

        // Xử lý detail chapters từ URL (ảnh cũ đã có)
        if (chapterRequest.getDetailChapters() != null && !chapterRequest.getDetailChapters().isEmpty()) {
            for (var item : chapterRequest.getDetailChapters()) {
                String extractedFilename = extractFilenameFromCdnUrl(item.getImgUrl());

                // Chỉ thêm nếu không phải blob URL
                if (extractedFilename != null) {
                    DetailChapter detailChapter = DetailChapter.builder()
                            .chapter(existingChapter)
                            .imgUrl(extractedFilename)
                            .orderNumber(item.getOrderNumber())
                            .build();
                    newDetailChapters.add(detailChapter);
                }
            }
        }

        // Nếu có file upload mới, thêm vào cuối danh sách
        if (chapterRequest.getIsFileUploaded() != null && chapterRequest.getIsFileUploaded()
                && files != null && !files.isEmpty()) {

            // Tạo hoặc cập nhật path cho chapter nếu chưa có
            if (path == null) {
                path = String.format(
                        "%s/chapter-%s",
                        comic.getSlug(),
                        chapterRequest.getChapterNumber());
                domainCdn = B2Constants.URL_PREFIX + bucketName + "/" + B2Constants.FOLDER_KEY_COMIC;
            }

            // Tìm orderNumber lớn nhất hiện tại để thêm ảnh mới vào cuối
            int maxOrderNumber = newDetailChapters.stream()
                    .mapToInt(DetailChapter::getOrderNumber)
                    .max()
                    .orElse(0);

            // Upload và thêm file mới vào cuối danh sách
            List<DetailChapter> uploadedDetailChapters = handleIsFileUploaded(files, path, existingChapter);

            // Cập nhật orderNumber cho các ảnh mới
            for (DetailChapter uploadedDetail : uploadedDetailChapters) {
                uploadedDetail.setOrderNumber(++maxOrderNumber);
                newDetailChapters.add(uploadedDetail);
            }
        }

        // Xóa tất cả detail chapters cũ và thêm mới (sử dụng collection hiện có)
        existingChapter.getDetailChapters().clear();
        existingChapter.getDetailChapters().addAll(newDetailChapters);

        // Cập nhật thông tin chapter
        existingChapter.setChapterPath(path);
        existingChapter.setDomainCdn(domainCdn);

        // Lưu chapter đã cập nhật
        chapterRepository.save(existingChapter);

        return BaseResponse.success("Cập nhật chương " + existingChapter.getChapterNumber() + " thành công");
    }

    /**
     * Xóa chương
     * 
     * @param id id của chương
     * @return BaseResponse<?>
     */
    @Override
    @Transactional
    public BaseResponse<?> deleteChapter(String id, User publisher) {

        ValidationUtils.checkNullId(id);
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));

        if (publisher != null) {
            comicUtils.validateComicOwnershipByComicId(publisher, chapter.getComic().getId());
        }

        String key = B2Constants.FOLDER_KEY_COMIC + "/" + chapter.getChapterPath() + "/";
        b2StorageService.remove(key);

        chapterRepository.delete(chapter);

        return BaseResponse.success(ChapterResponse.builder()
                .chapterNumber(chapter.getChapterNumber())
                .comicName(chapter.getComic().getName())
                .build());
    }

}
