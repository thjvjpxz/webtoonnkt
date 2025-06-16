package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.User;

public interface DetailComicService {
    /**
     * Lấy chi tiết comic
     * 
     * @param slug Slug comic
     * @param user User
     * @return Response chứa comic
     */
    BaseResponse<?> getComicDetail(String slug, User user);

    /**
     * Theo dõi comic
     * 
     * @param comicId ID comic
     * @param userId  ID user
     * @return Response chứa comic đã theo dõi
     */
    BaseResponse<?> followComic(String comicId, String userId);

    /**
     * Bỏ theo dõi comic
     * 
     * @param comicId ID comic
     * @param userId  ID user
     * @return Response chứa comic đã bỏ theo dõi
     */
    BaseResponse<?> unfollowComic(String comicId, String userId);

    /**
     * Kiểm tra trạng thái theo dõi comic
     * 
     * @param comicId ID comic
     * @param userId  ID user
     * @return Response chứa trạng thái theo dõi
     */
    BaseResponse<?> checkFollowStatus(String comicId, String userId);

    /**
     * Lấy chi tiết chapter
     * 
     * @param chapterId     ID chapter
     * @param user          User
     * @return Response chứa chapter
     */
    BaseResponse<?> getChapterDetail(String chapterId, User user);

}
