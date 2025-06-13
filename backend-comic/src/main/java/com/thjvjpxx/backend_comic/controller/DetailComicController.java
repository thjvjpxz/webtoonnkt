package com.thjvjpxx.backend_comic.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.service.DetailComicService;
import com.thjvjpxx.backend_comic.utils.SecurityUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/comic")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DetailComicController {

    DetailComicService detailComicService;
    SecurityUtils securityUtils;

    /**
     * Lấy chi tiết comic
     * GET /comic/{slug}
     * 
     * @param slug Slug comic
     * @return Response chứa comic
     */
    @GetMapping("/{slug}")
    public BaseResponse<?> getComicDetail(@PathVariable String slug) {
        User user = null;
        try {
            user = securityUtils.getCurrentUser();
        } catch (Exception e) {
        }
        return detailComicService.getComicDetail(slug, user);
    }

    /**
     * Theo dõi comic
     * POST /comic/{comicId}/follow
     * 
     * @param comicId ID comic
     * @return Response chứa comic đã theo dõi
     */
    @PostMapping("/{comicId}/follow")
    public BaseResponse<?> followComic(@PathVariable String comicId) {
        String currentUserId = securityUtils.getCurrentUserId();
        return detailComicService.followComic(comicId, currentUserId);
    }

    /**
     * Bỏ theo dõi comic
     * POST /comic/{comicId}/unfollow
     * 
     * @param comicId ID comic
     * @return Response chứa comic đã bỏ theo dõi
     */
    @PostMapping("/{comicId}/unfollow")
    public BaseResponse<?> unfollowComic(@PathVariable String comicId) {
        String currentUserId = securityUtils.getCurrentUserId();
        return detailComicService.unfollowComic(comicId, currentUserId);
    }

    /**
     * Kiểm tra trạng thái theo dõi comic
     * GET /comic/{comicId}/check-follow
     * 
     * @param comicId ID comic
     * @return Response chứa trạng thái theo dõi
     */
    @GetMapping("/{comicId}/check-follow")
    public BaseResponse<?> checkFollowStatus(@PathVariable String comicId) {
        String currentUserId = securityUtils.getCurrentUserId();
        return detailComicService.checkFollowStatus(comicId, currentUserId);
    }

    /**
     * Lấy chi tiết chapter
     * GET /comic/{slug}/{chapterId}
     * 
     * @param slug      Slug comic
     * @param chapterId ID chapter
     * @return Response chứa chapter
     */
    @GetMapping("/{slug}/{chapterId}")
    public BaseResponse<?> getChapterDetail(@PathVariable String slug, @PathVariable String chapterId) {
        String currentUserId = null;
        try {
            currentUserId = securityUtils.getCurrentUserId();
        } catch (Exception e) {
        }
        return detailComicService.getChapterDetail(chapterId, currentUserId);
    }
}
