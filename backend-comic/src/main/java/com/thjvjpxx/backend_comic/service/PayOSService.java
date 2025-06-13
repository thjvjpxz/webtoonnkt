package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.model.Transaction;

import vn.payos.type.CheckoutResponseData;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

public interface PayOSService {

    /**
     * Tạo link thanh toán PayOS
     * 
     * @param transaction Giao dịch cần tạo thanh toán
     * @return CheckoutResponseData chứa thông tin thanh toán
     */
    CheckoutResponseData createPaymentLink(Transaction transaction) throws Exception;

    /**
     * Xác thực URL Webhook của kênh thanh toán
     * 
     * @param webhookUrl URL webhook cần xác thực
     * @return String kết quả xác thực
     */
    String confirmWebhook(String webhookUrl) throws Exception;

    /**
     * Xác minh dữ liệu nhận được qua webhook sau khi thanh toán
     * 
     * @param webhookBody Dữ liệu webhook từ PayOS
     * @return WebhookData dữ liệu đã được xác minh
     */
    WebhookData verifyPaymentWebhookData(Webhook webhookBody) throws Exception;
}