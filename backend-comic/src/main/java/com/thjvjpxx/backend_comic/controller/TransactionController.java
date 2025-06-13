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
     * 
     * @param request Dữ liệu nạp tiền
     * @return Response chứa thông báo thành công
     */
    @PostMapping("/topup")
    public BaseResponse<?> createTopup(@Valid @RequestBody TopupRequest request) {

        User currentUser = securityUtils.getCurrentUser();
        return transactionService.createTopup(request, currentUser);
    }

    /**
     * Kiểm tra trạng thái thanh toán
     * GET /transactions/status/{orderCode}
     * 
     * @param orderCode Mã đơn hàng
     * @return Response chứa thông tin giao dịch
     */
    @GetMapping("/status/{orderCode}")
    public BaseResponse<TransactionResponse> checkPaymentStatus(
            @PathVariable Long orderCode) {
        return transactionService.getTransactionByOrderCode(orderCode, securityUtils.getCurrentUser());
    }

    /**
     * Hủy giao dịch
     * PUT /transactions/cancel/{orderCode}
     * 
     * @param orderCode Mã đơn hàng
     * @return Response chứa thông báo thành công
     */
    @PutMapping("/cancel/{orderCode}")
    public BaseResponse<?> cancelPayment(@PathVariable Long orderCode) {
        return transactionService.cancelPayment(orderCode);
    }

    /**
     * Lấy lịch sử giao dịch của user hiện tại
     * GET /transactions/me?page=0&limit=10
     * 
     * @param page  Trang hiện tại
     * @param limit Số lượng mỗi trang
     * @return Response chứa danh sách giao dịch của user
     */
    @GetMapping("/me")
    public BaseResponse<List<TransactionResponse>> getMyTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {

        User currentUser = securityUtils.getCurrentUser();
        return transactionService.getUserTransactions(currentUser, page, limit);
    }

    /**
     * Lấy tất cả giao dịch với filtering nâng cao (dành cho admin)
     * GET /transactions/filter
     * 
     * @param page          Trang hiện tại
     * @param limit         Số lượng mỗi trang
     * @param search        Từ khóa tìm kiếm
     * @param status        Trạng thái giao dịch
     * @param paymentMethod Phương thức thanh toán
     * @return Response chứa danh sách giao dịch đã lọc
     */
    @GetMapping("/filter")
    public BaseResponse<List<TransactionResponse>> getAllTransactionsWithFilter(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentMethod) {
        return transactionService.getAllTransactionsWithFilter(page, limit, search, status, paymentMethod);
    }

}