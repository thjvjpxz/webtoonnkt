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
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

/**
 * Controller xử lý webhook từ PayOS
 * Endpoint này không cần authentication vì được gọi từ PayOS server
 */
@RestController
@RequestMapping("/webhook/payos")
@RequiredArgsConstructor
public class PayOSWebhookController {

    private final PayOSService payOSService;
    private final TransactionService transactionService;

    @Value("${app.backend-url:}")
    private String backendUrl;

    /**
     * Đăng ký webhook URL với PayOS khi ứng dụng khởi động
     * 
     * POST /webhook/payos
     * 
     * @return Response chứa thông báo thành công
     */
    @PostConstruct
    public void registerWebhook() {
        try {
            String finalWebhookUrl = backendUrl + "/api/webhook/payos/payment";
            payOSService.confirmWebhook(finalWebhookUrl);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Xử lý webhook notification từ PayOS
     * PayOS sẽ gọi endpoint này khi có thay đổi trạng thái thanh toán
     * 
     * POST /webhook/payos/payment
     * 
     * @param webhookBody Dữ liệu webhook từ PayOS
     * @return Response xác nhận đã nhận webhook
     */
    @PostMapping("/payment")
    public ResponseEntity<String> handlePaymentWebhook(@RequestBody Webhook webhookBody) {
        try {
            // Bước 1: Xác minh tính xác thực của webhook
            WebhookData webhookData = payOSService.verifyPaymentWebhookData(webhookBody);

            if (webhookData == null) {
                return ResponseEntity.badRequest().body("Invalid webhook signature");
            }

            // Bước 2: Xử lý theo trạng thái thanh toán
            String paymentStatus = webhookData.getCode();
            Long orderCode = webhookData.getOrderCode();

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
                    break;
            }

            // Bước 3: Trả về OK để PayOS biết đã xử lý thành công
            return ResponseEntity.ok("OK");

        } catch (Exception e) {
            // Trả về lỗi để PayOS thử gửi lại webhook
            return ResponseEntity.internalServerError().body("Internal server error");
        }
    }

    /**
     * Xử lý thanh toán thành công
     * 
     * @param webhookData Dữ liệu webhook từ PayOS
     */
    private void handleSuccessfulPayment(WebhookData webhookData) {
        try {
            Long orderCode = webhookData.getOrderCode();
            String payosTransactionId = webhookData.getReference();
            String reference = webhookData.getReference();

            // Gọi service để confirm payment và cập nhật số dư user
            transactionService.confirmPayment(orderCode, payosTransactionId, reference);

        } catch (Exception e) {
            throw e; // Re-throw để PayOS gửi lại webhook
        }
    }

    /**
     * Xử lý thanh toán thất bại hoặc bị hủy
     * 
     * @param webhookData Dữ liệu webhook từ PayOS
     */
    private void handleFailedPayment(WebhookData webhookData) {
        try {
            Long orderCode = webhookData.getOrderCode();

            // Gọi service để cancel payment
            transactionService.cancelPayment(orderCode);

        } catch (Exception e) {
            throw e; // Re-throw để PayOS gửi lại webhook
        }
    }
}