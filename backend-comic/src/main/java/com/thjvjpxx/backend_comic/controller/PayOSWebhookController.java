package com.thjvjpxx.backend_comic.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.service.PayOSService;
import com.thjvjpxx.backend_comic.service.TransactionService;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

/**
 * Controller xử lý webhook từ PayOS
 * Endpoint này không cần authentication vì được gọi từ PayOS server
 */
@RestController
@RequestMapping("/webhook/payos")
@RequiredArgsConstructor
@Slf4j
public class PayOSWebhookController {

    private final PayOSService payOSService;
    private final TransactionService transactionService;

    @Value("${app.backend-url:}")
    private String backendUrl;

    /**
     * Đăng ký webhook URL với PayOS khi ứng dụng khởi động
     */
    @PostConstruct
    public void registerWebhook() {
        try {
            String finalWebhookUrl = backendUrl + "/api/webhook/payos/payment";

            log.info("Đăng ký webhook URL với PayOS: {}", finalWebhookUrl);

            String result = payOSService.confirmWebhook(finalWebhookUrl);

            log.info("Đăng ký webhook thành công: {}", result);

        } catch (Exception e) {
            log.error("Lỗi khi đăng ký webhook với PayOS: {}", e.getMessage(), e);
            // Không throw exception để app vẫn có thể khởi động
            // throw new BaseException(ErrorCode.HAS_ERROR);
        }
    }

    /**
     * Xử lý webhook notification từ PayOS
     * PayOS sẽ gọi endpoint này khi có thay đổi trạng thái thanh toán
     * 
     * @param webhookBody Dữ liệu webhook từ PayOS
     * @return Response xác nhận đã nhận webhook
     */
    @PostMapping("/payment")
    public ResponseEntity<String> handlePaymentWebhook(@RequestBody Webhook webhookBody) {
        try {
            log.info("Nhận webhook từ PayOS: code={}, desc={}",
                    webhookBody.getCode(), webhookBody.getDesc());

            // Bước 1: Xác minh tính xác thực của webhook
            WebhookData webhookData = payOSService.verifyPaymentWebhookData(webhookBody);

            if (webhookData == null) {
                log.warn("Webhook data không hợp lệ - signature không khớp");
                return ResponseEntity.badRequest().body("Invalid webhook signature");
            }

            // Bước 2: Xử lý theo trạng thái thanh toán
            String paymentStatus = webhookData.getCode();
            Long orderCode = webhookData.getOrderCode();

            log.info("Xử lý webhook cho order code: {}, status: {}, amount: {} VND",
                    orderCode, paymentStatus, webhookData.getAmount());

            switch (paymentStatus) {
                case "00": // Thanh toán thành công
                    if (orderCode == 123) {
                        return ResponseEntity.ok("OK");
                    }
                    handleSuccessfulPayment(webhookData);
                    break;

                case "01": // Thanh toán thất bại
                case "02": // Thanh toán bị hủy
                    handleFailedPayment(webhookData);
                    break;

                default:
                    log.warn("Nhận được webhook với status không xác định: {}", paymentStatus);
                    break;
            }

            // Bước 3: Trả về OK để PayOS biết đã xử lý thành công
            return ResponseEntity.ok("OK");

        } catch (Exception e) {
            log.error("Lỗi khi xử lý webhook từ PayOS: {}", e.getMessage(), e);

            // Trả về lỗi để PayOS thử gửi lại webhook
            return ResponseEntity.internalServerError().body("Internal server error");
        }
    }

    /**
     * Xử lý thanh toán thành công
     */
    private void handleSuccessfulPayment(WebhookData webhookData) {
        try {
            Long orderCode = webhookData.getOrderCode();
            String payosTransactionId = webhookData.getReference();
            String reference = webhookData.getReference();

            log.info("Xử lý thanh toán thành công cho order: {}, transaction: {}",
                    orderCode, payosTransactionId);

            // Gọi service để confirm payment và cập nhật số dư user
            transactionService.confirmPayment(orderCode, payosTransactionId, reference);

            log.info("Đã cập nhật thành công giao dịch cho order: {}", orderCode);

        } catch (Exception e) {
            log.error("Lỗi khi xử lý thanh toán thành công: {}", e.getMessage(), e);
            throw e; // Re-throw để PayOS gửi lại webhook
        }
    }

    /**
     * Xử lý thanh toán thất bại hoặc bị hủy
     */
    private void handleFailedPayment(WebhookData webhookData) {
        try {
            Long orderCode = webhookData.getOrderCode();
            String reason = webhookData.getDesc();

            log.info("Xử lý thanh toán thất bại cho order: {}, lý do: {}", orderCode, reason);

            // Gọi service để cancel payment
            transactionService.cancelPayment(orderCode);

            log.info("Đã hủy giao dịch cho order: {}", orderCode);

        } catch (Exception e) {
            log.error("Lỗi khi xử lý thanh toán thất bại: {}", e.getMessage(), e);
            throw e; // Re-throw để PayOS gửi lại webhook
        }
    }
}