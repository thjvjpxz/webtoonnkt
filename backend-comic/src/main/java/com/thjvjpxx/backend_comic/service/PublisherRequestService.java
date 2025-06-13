package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.PublisherRequestStatus;
import com.thjvjpxx.backend_comic.model.User;

public interface PublisherRequestService {
    /**
     * Gửi yêu cầu trở thành publisher (chỉ dành cho user)
     * 
     * @param user
     * @return Response thông báo gửi yêu cầu thành công
     */
    BaseResponse<?> sendPublisherRequest(User user);

    /**
     * Lấy danh sách yêu cầu trở thành publisher
     * 
     * @param page
     * @param size
     * @param status
     * @return Response chứa danh sách yêu cầu trở thành publisher
     */
    BaseResponse<?> getPublisherRequests(int page, int size, String search, String status);

    /**
     * Cập nhật trạng thái yêu cầu trở thành publisher
     * 
     * @param id
     * @param status
     * @return Response thông báo cập nhật trạng thái yêu cầu thành công
     */
    BaseResponse<?> updatePublisherRequestStatus(String id, PublisherRequestStatus status);

}
