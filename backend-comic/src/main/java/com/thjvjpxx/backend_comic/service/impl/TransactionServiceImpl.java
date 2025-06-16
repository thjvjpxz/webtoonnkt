package com.thjvjpxx.backend_comic.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thjvjpxx.backend_comic.constant.PaymentConstants;
import com.thjvjpxx.backend_comic.dto.request.TopupRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.TransactionResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.enums.TransactionStatus;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Transaction;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.repository.TransactionRepository;
import com.thjvjpxx.backend_comic.repository.UserRepository;
import com.thjvjpxx.backend_comic.service.PayOSService;
import com.thjvjpxx.backend_comic.service.TransactionService;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.payos.type.CheckoutResponseData;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final PayOSService payOSService;

    @Override
    @Transactional
    public BaseResponse<?> createTopup(TopupRequest request, User user) {
        try {
            // Validate số linh thạch nạp
            if (request.getAmount() < PaymentConstants.MIN_TOPUP_LINHHACH ||
                    request.getAmount() > PaymentConstants.MAX_TOPUP_LINHHACH) {
                throw new BaseException(ErrorCode.TOPUP_AMOUNT_TOO_LOW);
            }

            // Tính số tiền VND cần thanh toán
            Double vndAmount = PaymentConstants.convertLinhThachToVnd(request.getAmount());

            // Tạo order code unique
            Long orderCode = generateOrderCode();

            // Tạo mã giao dịch unique
            String transactionCode = generateTransactionCode(user, orderCode);
            String description = transactionCode;

            // Tạo transaction record
            Transaction transaction = Transaction.builder()
                    .user(user)
                    .amount(request.getAmount())
                    .payosAmountVnd(vndAmount)
                    .payosOrderCode(orderCode)
                    .status(TransactionStatus.PENDING)
                    .description(description)
                    .paymentMethod("PayOS")
                    .build();

            // Lưu transaction
            transaction = transactionRepository.save(transaction);

            // Tạo payment link với PayOS
            CheckoutResponseData paymentData = payOSService.createPaymentLink(transaction);
            Map<String, String> response = new HashMap<>();
            response.put("paymentLink", paymentData.getCheckoutUrl());

            log.info("Đã tạo giao dịch nạp tiền cho user {}: {} Linh Thạch = {} VND",
                    user.getUsername(), request.getAmount(), vndAmount);

            return BaseResponse.success(response, "Tạo link thanh toán thành công!");

        } catch (BaseException e) {
            throw e;
        } catch (Exception e) {
            log.error("Lỗi khi tạo giao dịch nạp tiền: {}", e.getMessage(), e);
            throw new BaseException(ErrorCode.PAYOS_CREATE_PAYMENT_FAILED);
        }
    }

    @Override
    @Transactional
    public Transaction confirmPayment(Long orderCode, String payosTransactionId, String reference) {
        try {
            Transaction transaction = transactionRepository.findByPayosOrderCode(orderCode)
                    .orElseThrow(() -> new BaseException(ErrorCode.TRANSACTION_NOT_FOUND));

            if (transaction.getStatus() != TransactionStatus.PENDING) {
                log.warn("Giao dịch {} đã được xử lý trước đó: {}", orderCode, transaction.getStatus());
                return transaction;
            }

            // Cập nhật thông tin thanh toán
            transaction.setStatus(TransactionStatus.COMPLETED);
            transaction.setPayosTransactionId(payosTransactionId);

            // Cập nhật số dư user
            User user = transaction.getUser();
            user.setBalance(user.getBalance() + transaction.getAmount());
            userRepository.save(user);

            // Lưu transaction
            transaction = transactionRepository.save(transaction);

            log.info("Đã xác nhận thanh toán thành công cho order code {}: +{} Linh Thạch cho user {}",
                    orderCode, transaction.getAmount(), user.getUsername());

            return transaction;

        } catch (BaseException e) {
            throw e;
        } catch (Exception e) {
            log.error("Lỗi khi xác nhận thanh toán cho order code {}: {}", orderCode, e.getMessage(), e);
            throw new BaseException(ErrorCode.HAS_ERROR);
        }
    }

    @Override
    @Transactional
    public BaseResponse<?> cancelPayment(Long orderCode) {
        try {
            Transaction transaction = transactionRepository.findByPayosOrderCode(orderCode)
                    .orElseThrow(() -> new BaseException(ErrorCode.TRANSACTION_NOT_FOUND));

            if (transaction.getStatus() != TransactionStatus.PENDING) {
                log.warn("Giao dịch {} không thể hủy vì đã được xử lý: {}", orderCode, transaction.getStatus());
                throw new BaseException(ErrorCode.TRANSACTION_NOT_FOUND);
            }

            transaction.setStatus(TransactionStatus.CANCELLED);
            transaction = transactionRepository.save(transaction);

            TransactionResponse response = convertToTransactionResponse(transaction);

            return BaseResponse.success(response, "Hủy giao dịch thành công!");

        } catch (BaseException e) {
            throw e;
        } catch (Exception e) {
            log.error("Lỗi khi hủy giao dịch order code {}: {}", orderCode, e.getMessage(), e);
            throw new BaseException(ErrorCode.HAS_ERROR);
        }
    }

    @Override
    public BaseResponse<List<TransactionResponse>> getUserTransactions(User user, int page, int limit) {
        try {
            Pageable pageable = PaginationUtils.createPageableWithSort(page, limit, "updatedAt", Sort.Direction.DESC);
            Page<Transaction> transactionPage = transactionRepository.findByUser(user, pageable);

            List<TransactionResponse> transactions = transactionPage.getContent().stream()
                    .map(this::convertToTransactionResponse)
                    .collect(Collectors.toList());

            return BaseResponse.success(
                    transactions,
                    page,
                    (int) transactionPage.getTotalElements(),
                    limit,
                    transactionPage.getTotalPages());

        } catch (Exception e) {
            log.error("Lỗi khi lấy lịch sử giao dịch của user {}: {}", user.getUsername(), e.getMessage(), e);
            throw new BaseException(ErrorCode.HAS_ERROR);
        }
    }

    @Override
    public BaseResponse<TransactionResponse> getTransactionById(String transactionId, User user) {
        try {
            Transaction transaction = transactionRepository.findById(transactionId)
                    .orElseThrow(() -> new BaseException(ErrorCode.TRANSACTION_NOT_FOUND));

            // Kiểm tra quyền truy cập
            if (!transaction.getUser().getId().equals(user.getId()) &&
                    !user.getRole().getName().equals("ADMIN")) {
                throw new BaseException(ErrorCode.PERMISSION_DENIED);
            }

            TransactionResponse response = convertToTransactionResponse(transaction);
            return BaseResponse.success(response);

        } catch (BaseException e) {
            throw e;
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin giao dịch {}: {}", transactionId, e.getMessage(), e);
            throw new BaseException(ErrorCode.HAS_ERROR);
        }
    }

    @Override
    public BaseResponse<TransactionResponse> getTransactionByOrderCode(Long orderCode, User user) {
        try {
            Transaction transaction = transactionRepository.findByPayosOrderCode(orderCode)
                    .orElseThrow(() -> new BaseException(ErrorCode.TRANSACTION_NOT_FOUND));

            // Kiểm tra quyền truy cập
            if (!transaction.getUser().getId().equals(user.getId()) &&
                    !user.getRole().getName().equals("ADMIN")) {
                throw new BaseException(ErrorCode.PERMISSION_DENIED);
            }

            TransactionResponse response = convertToTransactionResponse(transaction);
            return BaseResponse.success(response);

        } catch (BaseException e) {
            throw e;
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin giao dịch order code {}: {}", orderCode, e.getMessage(), e);
            throw new BaseException(ErrorCode.HAS_ERROR);
        }
    }

    @Override
    public BaseResponse<List<TransactionResponse>> getAllTransactions(int page, int limit, String status) {
        try {
            Pageable pageable = PageRequest.of(page, limit, Sort.by("createdAt").descending());
            Page<Transaction> transactionPage;

            if (status != null && !status.isEmpty()) {
                TransactionStatus transactionStatus = TransactionStatus.valueOf(status.toUpperCase());
                transactionPage = transactionRepository.findByStatus(transactionStatus)
                        .stream()
                        .collect(Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    int start = page * limit;
                                    int end = Math.min(start + limit, list.size());
                                    return new org.springframework.data.domain.PageImpl<>(
                                            list.subList(start, end), pageable, list.size());
                                }));
            } else {
                transactionPage = transactionRepository.findAll(pageable);
            }

            List<TransactionResponse> transactions = transactionPage.getContent().stream()
                    .map(this::convertToTransactionResponse)
                    .collect(Collectors.toList());

            return BaseResponse.success(
                    transactions,
                    page,
                    (int) transactionPage.getTotalElements(),
                    limit,
                    transactionPage.getTotalPages());

        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách tất cả giao dịch: {}", e.getMessage(), e);
            throw new BaseException(ErrorCode.HAS_ERROR);
        }
    }

    /**
     * Chuyển đổi Transaction entity sang TransactionResponse DTO
     */
    private TransactionResponse convertToTransactionResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .transactionCode(transaction.getPayosOrderCode())
                .amount(transaction.getAmount())
                .payosAmountVnd(transaction.getPayosAmountVnd())
                .status(transaction.getStatus().toString())
                .description(transaction.getDescription())
                .paymentMethod(transaction.getPaymentMethod())
                .durationDays(transaction.getDurationDays())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }

    /**
     * Chuyển đổi Transaction entity sang TransactionResponse DTO với thông tin user
     * (cho admin)
     */
    private TransactionResponse convertToTransactionResponseWithUser(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .transactionCode(transaction.getPayosOrderCode())
                .amount(transaction.getAmount())
                .payosAmountVnd(transaction.getPayosAmountVnd())
                .status(transaction.getStatus().toString())
                .description(transaction.getDescription())
                .paymentMethod(transaction.getPaymentMethod())
                .durationDays(transaction.getDurationDays())
                .userId(transaction.getUser().getId())
                .username(transaction.getUser().getUsername())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }

    /**
     * Tạo order code unique cho PayOS
     */
    private Long generateOrderCode() {
        // Tạo order code với timestamp + random số để đảm bảo unique
        long timestamp = System.currentTimeMillis() / 1000; // Unix timestamp
        int random = new Random().nextInt(999) + 100; // Random 3 chữ số
        return Long.parseLong(timestamp + String.valueOf(random));
    }

    /**
     * Tạo mã giao dịch unique cho từng topup
     * Format: NAP_[USER_ID_SHORT]_[TIMESTAMP]_[RANDOM]
     */
    private String generateTransactionCode(User user, Long orderCode) {
        // Lấy 8 ký tự đầu của user ID
        String userIdShort = user.getId().substring(0, Math.min(8, user.getId().length())).toUpperCase();

        // Timestamp (6 chữ số cuối)
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000).substring(4);

        // Random 3 ký tự
        String random = generateRandomString(3);

        return String.format("NAP_%s_%s_%s", userIdShort, timestamp, random);
    }

    /**
     * Tạo chuỗi random với độ dài cho trước
     */
    private String generateRandomString(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder result = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            result.append(chars.charAt(random.nextInt(chars.length())));
        }
        return result.toString();
    }

    // === IMPLEMENTATION CÁC PHƯƠNG THỨC MỚI ===

    @Override
    public BaseResponse<List<TransactionResponse>> getAllTransactionsWithFilter(
            int page, int limit, String search, String status, String paymentMethod) {
        try {
            log.info(
                    "Lấy danh sách giao dịch với filter - page: {}, limit: {}, search: {}, status: {}, paymentMethod: {}",
                    page, limit, search, status, paymentMethod);

            // Tạo Pageable với sắp xếp
            Pageable pageable = PaginationUtils.createPageableWithSort(page, limit, "createdAt", Sort.Direction.DESC);

            Page<Transaction> transactionPage;

            // Áp dụng filter đơn giản
            if (status != null && !status.isEmpty()) {
                // Filter theo status
                TransactionStatus transactionStatus = TransactionStatus.valueOf(status.toUpperCase());
                transactionPage = transactionRepository.findByStatus(transactionStatus, pageable);
            } else {
                // Không có filter, lấy tất cả
                transactionPage = transactionRepository.findAll(pageable);
            }

            // Filter thêm theo search và paymentMethod trong memory nếu cần
            List<Transaction> filteredTransactions = transactionPage.getContent();

            if (search != null && !search.isEmpty()) {
                filteredTransactions = filteredTransactions.stream()
                        .filter(t -> (t.getUser().getUsername().toLowerCase().contains(search.toLowerCase()) ||
                                (t.getDescription() != null
                                        && t.getDescription().toLowerCase().contains(search.toLowerCase()))))
                        .collect(Collectors.toList());
            }

            if (paymentMethod != null && !paymentMethod.isEmpty()) {
                filteredTransactions = filteredTransactions.stream()
                        .filter(t -> paymentMethod.equalsIgnoreCase(t.getPaymentMethod()))
                        .collect(Collectors.toList());
            }

            // Chuyển đổi sang TransactionResponse với thông tin user cho admin
            List<TransactionResponse> transactions = filteredTransactions.stream()
                    .map(this::convertToTransactionResponseWithUser)
                    .collect(Collectors.toList());

            log.info("Tìm thấy {} giao dịch phù hợp với filter", transactions.size());

            return BaseResponse.success(
                    transactions,
                    page,
                    (int) transactionPage.getTotalElements(),
                    limit,
                    transactionPage.getTotalPages());

        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách giao dịch với filter: {}", e.getMessage(), e);
            throw new BaseException(ErrorCode.HAS_ERROR);
        }
    }

}