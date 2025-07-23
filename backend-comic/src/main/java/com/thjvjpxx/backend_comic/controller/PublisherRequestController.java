package com.thjvjpxx.backend_comic.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.PublisherRequestStatus;
import com.thjvjpxx.backend_comic.service.PublisherRequestService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@RequestMapping("publisher-requests")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PublisherRequestController {

    PublisherRequestService publisherRequestService;

    /**
     * Lấy danh sách yêu cầu trở thành publisher
     * GET /publisher-requests
     * 
     * @param page   Trang hiện tại
     * @param size   Số lượng yêu cầu trên mỗi trang
     * @param search Từ khóa tìm kiếm
     * @param status Trạng thái yêu cầu
     * @return Response chứa danh sách yêu cầu trở thành publisher
     */
    @GetMapping
    public BaseResponse<?> getPublisherRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        return publisherRequestService.getPublisherRequests(page, size, search, status);
    }

    /**
     * Cập nhật trạng thái yêu cầu trở thành publisher
     * PUT /publisher-requests/{id}
     * 
     * @param id      ID yêu cầu
     * @param request Request body chứa trạng thái yêu cầu
     * @return Response thông báo cập nhật trạng thái yêu cầu thành công
     */
    @PutMapping("/{id}")
    public BaseResponse<?> updatePublisherRequestStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        PublisherRequestStatus publisherRequestStatus = PublisherRequestStatus.valueOf(status);

        return publisherRequestService.updatePublisherRequestStatus(id, publisherRequestStatus);
    }
}
