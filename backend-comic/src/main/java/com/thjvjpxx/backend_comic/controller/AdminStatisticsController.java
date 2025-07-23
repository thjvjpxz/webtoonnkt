package com.thjvjpxx.backend_comic.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.AdminStatisticsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/statistics")
@RequiredArgsConstructor
public class AdminStatisticsController {

    private final AdminStatisticsService adminStatisticsService;

    /**
     * Lấy tất cả thống kê cho Admin dashboard
     *
     * @return ResponseEntity chứa tất cả thống kê
     */
    @GetMapping
    public BaseResponse<?> getAllStatistics() {
        AdminStatisticsResponse statistics = adminStatisticsService.getAllStatistics();
        return BaseResponse.success(statistics, "Lấy thống kê thành công");
    }
}