package com.thjvjpxx.backend_comic.service;

/**
 * Service xử lý gửi email
 */
public interface EmailService {

    /**
     * Gửi email xác thực tài khoản
     * 
     * @param email             Địa chỉ email người nhận
     * @param verificationToken Token xác thực
     */
    void sendVerificationEmail(String email, String verificationToken);

    /**
     * Gửi email đặt lại mật khẩu
     * 
     * @param email              Địa chỉ email người nhận
     * @param resetPasswordToken Token đặt lại mật khẩu
     */
    void sendResetPasswordEmail(String email, String resetPasswordToken);
}
