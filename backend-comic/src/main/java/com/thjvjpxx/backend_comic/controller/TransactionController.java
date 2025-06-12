package com.thjvjpxx.backend_comic.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.request.TopupRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.TransactionResponse;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.service.TransactionService;
import com.thjvjpxx.backend_comic.utils.SecurityUtils;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@RequestMapping("/transactions")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TransactionController {

    TransactionService transactionService;
    SecurityUtils securityUtils;

    /**
     * Tạo giao dịch nạp tiền
     * POST /transactions/topup
     */
    @PostMapping("/topup")
    public BaseResponse<?> createTopup(@Valid @RequestBody TopupRequest request) {

        User currentUser = securityUtils.getCurrentUser();
        return transactionService.createTopup(request, currentUser);
    }

    @GetMapping("/status/{orderCode}")
    public BaseResponse<TransactionResponse> checkPaymentStatus(
            @PathVariable Long orderCode) {
        return transactionService.getTransactionByOrderCode(orderCode, securityUtils.getCurrentUser());
    }

    @PutMapping("/cancel/{orderCode}")
    public BaseResponse<?> cancelPayment(@PathVariable Long orderCode) {
        return transactionService.cancelPayment(orderCode);
    }

    /**
     * Lấy lịch sử giao dịch của user hiện tại
     * GET /transactions/me?page=0&limit=10
     */
    @GetMapping("/me")
    public BaseResponse<List<TransactionResponse>> getMyTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        User currentUser = securityUtils.getCurrentUser();
        return transactionService.getUserTransactions(currentUser, page, limit);
    }

    /**
     * Lấy thông tin giao dịch theo ID
     * GET /transactions/{id}
     */
    @GetMapping("/{id}")
    public BaseResponse<TransactionResponse> getTransactionById(
            @PathVariable String id) {

        User currentUser = securityUtils.getCurrentUser();
        return transactionService.getTransactionById(id, currentUser);
    }

    /**
     * Lấy tất cả giao dịch (dành cho admin)
     * GET /transactions?page=0&limit=10&status=COMPLETED
     */
    @GetMapping
    public BaseResponse<List<TransactionResponse>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String status) {

        return transactionService.getAllTransactions(page, limit, status);
    }
}