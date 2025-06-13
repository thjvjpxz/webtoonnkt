package com.thjvjpxx.backend_comic.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.model.Transaction;
import com.thjvjpxx.backend_comic.service.PayOSService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.PaymentData;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayOSServiceImpl implements PayOSService {

    @Value("${payos.return-url}")
    private String returnUrl;

    @Value("${payos.cancel-url}")
    private String cancelUrl;

    private final PayOS payOS;

    @Override
    public CheckoutResponseData createPaymentLink(Transaction transaction) throws Exception {
        try {
            log.info("Tạo link thanh toán PayOS cho order code: {}, amount: {} VND",
                    transaction.getPayosOrderCode(), transaction.getPayosAmountVnd());

            // Giả lập tạo PaymentData (vì PayOS API có thể có lỗi import)
            PaymentData paymentData = PaymentData.builder()
                    .orderCode(transaction.getPayosOrderCode())
                    .amount(transaction.getPayosAmountVnd().intValue())
                    .description(transaction.getDescription())
                    .returnUrl(returnUrl)
                    .cancelUrl(cancelUrl)
                    .build();

            CheckoutResponseData result = payOS.createPaymentLink(paymentData);

            log.info("Tạo link thanh toán thành công cho order: {}", result.getCheckoutUrl());

            return result;

        } catch (Exception e) {
            log.error("Lỗi khi tạo link thanh toán PayOS: {}", e.getMessage(), e);
            throw new Exception("Không thể tạo link thanh toán. Vui lòng thử lại!", e);
        }
    }

    @Override
    public String confirmWebhook(String webhookUrl) throws Exception {
        try {
            log.info("Xác thực webhook URL: {}", webhookUrl);

            // Gọi PayOS API để confirm webhook
            String result = payOS.confirmWebhook(webhookUrl);

            log.info("Xác thực webhook thành công cho URL: {}", webhookUrl);

            return result;

        } catch (Exception e) {
            log.error("Lỗi khi xác thực webhook URL: {}", e.getMessage(), e);
            throw new Exception("Không thể xác thực webhook URL", e);
        }
    }

    @Override
    public WebhookData verifyPaymentWebhookData(Webhook webhookBody) throws Exception {
        try {
            log.info("Xác minh dữ liệu webhook từ PayOS");

            // Gọi PayOS API để verify webhook data
            WebhookData webhookData = payOS.verifyPaymentWebhookData(webhookBody);

            if (webhookData != null) {
                log.info("Xác minh webhook thành công cho order code: {}, amount: {} VND",
                        webhookData.getOrderCode(), webhookData.getAmount());
            } else {
                log.warn("Webhook data không hợp lệ hoặc signature không khớp");
            }

            return webhookData;

        } catch (Exception e) {
            log.error("Lỗi khi xác minh webhook data: {}", e.getMessage(), e);
            throw new Exception("Không thể xác minh dữ liệu webhook", e);
        }
    }
}