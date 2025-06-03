package com.thjvjpxx.backend_comic.service;

public interface EmailService {
    void sendVerificationEmail(String email, String verificationToken);

    void sendResetPasswordEmail(String email, String resetPasswordToken);
}
