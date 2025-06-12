package com.thjvjpxx.backend_comic.service;

import java.util.List;

import com.thjvjpxx.backend_comic.dto.request.TopupRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.TransactionResponse;
import com.thjvjpxx.backend_comic.dto.response.TransactionStatsResponse;
import com.thjvjpxx.backend_comic.model.Transaction;
import com.thjvjpxx.backend_comic.model.User;

public interface TransactionService {

    /**
     * Tạo giao dịch nạp tiền
     * 
     * @param request Thông tin nạp tiền
     * @param user    Người dùng thực hiện nạp tiền
     * @return Response chứa link thanh toán
     */
    BaseResponse<?> createTopup(TopupRequest request, User user);

    /**
     * Xác nhận thanh toán thành công từ PayOS webhook
     * 
     * @param orderCode          Mã đơn hàng PayOS
     * @param payosTransactionId ID giao dịch PayOS
     * @param reference          Mã giao dịch PayOS
     * @return Transaction đã cập nhật
     */
    Transaction confirmPayment(Long orderCode, String payosTransactionId, String reference);

    /**
     * Hủy giao dịch khi thanh toán thất bại
     * 
     * @param orderCode Mã đơn hàng PayOS
     * @return Response chứa thông tin giao dịch
     */
    BaseResponse<?> cancelPayment(Long orderCode);

    /**
     * Lấy lịch sử giao dịch của user
     * 
     * @param user  Người dùng
     * @param page  Trang hiện tại
     * @param limit Số lượng mỗi trang
     * @return Danh sách giao dịch
     */
    BaseResponse<List<TransactionResponse>> getUserTransactions(User user, int page, int limit);

    /**
     * Lấy thông tin giao dịch theo ID
     * 
     * @param transactionId ID giao dịch
     * @param user          Người dùng (để kiểm tra quyền)
     * @return Thông tin giao dịch
     */
    BaseResponse<TransactionResponse> getTransactionById(String transactionId, User user);

    /**
     * Lấy thông tin giao dịch theo PayOS order code
     * 
     * @param orderCode Mã đơn hàng PayOS
     * @param user      Người dùng (để kiểm tra quyền)
     * @return Thông tin giao dịch
     */
    BaseResponse<TransactionResponse> getTransactionByOrderCode(Long orderCode, User user);

    /**
     * Lấy tất cả giao dịch (dành cho admin)
     * 
     * @param page   Trang hiện tại
     * @param limit  Số lượng mỗi trang
     * @param status Trạng thái giao dịch (optional)
     * @return Danh sách giao dịch
     */
    BaseResponse<List<TransactionResponse>> getAllTransactions(int page, int limit, String status);

    /**
     * Lấy tất cả giao dịch với filtering nâng cao (dành cho admin)
     * 
     * @param page          Trang hiện tại
     * @param limit         Số lượng mỗi trang
     * @param search        Tìm kiếm theo username hoặc description
     * @param status        Lọc theo trạng thái
     * @param paymentMethod Lọc theo phương thức thanh toán
     * @return Danh sách giao dịch đã lọc
     */
    BaseResponse<List<TransactionResponse>> getAllTransactionsWithFilter(
            int page, int limit, String search, String status, String paymentMethod);

    /**
     * Lấy thống kê giao dịch
     * 
     * @return Thống kê giao dịch
     */
    BaseResponse<TransactionStatsResponse> getTransactionStats();
}