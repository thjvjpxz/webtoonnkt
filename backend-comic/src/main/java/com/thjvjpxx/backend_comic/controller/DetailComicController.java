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

    @GetMapping("/{slug}")
    public BaseResponse<?> getComicDetail(@PathVariable String slug) {
        User user = null;
        try {
            user = securityUtils.getCurrentUser();
        } catch (Exception e) {
            // User chưa đăng nhập, user = null
        }
        return detailComicService.getComicDetail(slug, user);
    }

    @PostMapping("/{comicId}/follow")
    public BaseResponse<?> followComic(@PathVariable String comicId) {
        String currentUserId = securityUtils.getCurrentUserId();
        return detailComicService.followComic(comicId, currentUserId);
    }

    @PostMapping("/{comicId}/unfollow")
    public BaseResponse<?> unfollowComic(@PathVariable String comicId) {
        String currentUserId = securityUtils.getCurrentUserId();
        return detailComicService.unfollowComic(comicId, currentUserId);
    }

    @GetMapping("/{comicId}/check-follow")
    public BaseResponse<?> checkFollowStatus(@PathVariable String comicId) {
        String currentUserId = securityUtils.getCurrentUserId();
        return detailComicService.checkFollowStatus(comicId, currentUserId);
    }

    @GetMapping("/{slug}/{chapterId}")
    public BaseResponse<?> getChapterDetail(@PathVariable String slug, @PathVariable String chapterId) {
        // Lấy user hiện tại (có thể null nếu là anonymous user)
        String currentUserId = null;
        try {
            currentUserId = securityUtils.getCurrentUserId();
        } catch (Exception e) {
            // User chưa đăng nhập, currentUserId = null
        }
        return detailComicService.getChapterDetail(chapterId, currentUserId);
    }
}
