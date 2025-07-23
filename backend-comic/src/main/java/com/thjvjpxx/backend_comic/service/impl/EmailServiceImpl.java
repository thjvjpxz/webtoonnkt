package com.thjvjpxx.backend_comic.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailServiceImpl implements EmailService {

	final JavaMailSender javaMailSender;

	@Value("${spring.mail.properties.mail.smtp.from}")
	String from;

	@Value("${spring.mail.default-encoding}")
	String encoding;

	/**
	 * Gửi email với nội dung HTML
	 * 
	 * @param to      Địa chỉ email người nhận
	 * @param subject Tiêu đề email
	 * @param html    Nội dung email dạng HTML
	 * @throws MessagingException
	 */
	private void sendHtmlEmail(String to, String subject, String html) throws MessagingException {
		MimeMessage message = javaMailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true, encoding);
		helper.setFrom(from);
		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(html, true);
		javaMailSender.send(message);
	}

	@Override
	public void sendVerificationEmail(String email, String verificationToken) {
		String html = buildVerificationEmailTemplate(email, verificationToken);
		try {
			sendHtmlEmail(email, "Xác thực tài khoản", html);
		} catch (MessagingException e) {
			throw new BaseException(ErrorCode.EMAIL_SEND_FAILED);
		}
	}

	@Override
	public void sendResetPasswordEmail(String email, String resetPasswordToken) {
		String html = buildPasswordResetEmailTemplate(email, resetPasswordToken);
		try {
			sendHtmlEmail(email, "Đặt lại mật khẩu", html);
		} catch (MessagingException e) {
			throw new BaseException(ErrorCode.EMAIL_SEND_FAILED);
		}
	}

	/**
	 * Tạo template HTML cho email xác thực
	 * 
	 * @param username        Tên người dùng
	 * @param verificationUrl URL xác thực
	 * @return Template HTML
	 */
	private String buildVerificationEmailTemplate(String username, String verificationUrl) {
		return """
				<!DOCTYPE html>
				<html>
				  <head>
				    <meta charset="UTF-8" />
				    <title>Xác thực tài khoản</title>
				    <style>
				      body {
				        font-family: Arial, sans-serif;
				        line-height: 1.6;
				        color: #333;
				      }
				      .container {
				        max-width: 600px;
				        margin: 0 auto;
				        padding: 20px;
				      }
				      .header {
				        background-color: #4caf50;
				        color: white;
				        padding: 20px;
				        text-align: center;
				        border-radius: 8px 8px 0 0;
				      }
				      .content {
				        padding: 30px;
				        background-color: #f9f9f9;
				      }
				      .button {
				        display: inline-block;
				        padding: 15px 30px;
				        background-color: #4caf50;
				        color: white !important;
				        text-decoration: none;
				        border-radius: 5px;
				        margin: 20px 0;
				        font-weight: bold;
				      }
				      .footer {
				        text-align: center;
				        padding: 20px;
				        color: #666;
				        font-size: 12px;
				        background-color: #f0f0f0;
				        border-radius: 0 0 8px 8px;
				      }
				      .warning {
				        background-color: #fff3cd;
				        border-left: 4px solid #ffc107;
				        padding: 15px;
				        margin: 15px 0;
				      }
				    </style>
				  </head>
				  <body>
				    <div class="container">
				      <div class="header">
				        <h1>Chào mừng đến với WebtoonNKT!</h1>
				      </div>
				      <div class="content">
				        <h2>Xin chào %s!</h2>
				        <p>
				          Cảm ơn bạn đã đăng ký tài khoản tại <strong>WebtoonNKT</strong>. Để
				          hoàn tất quá trình đăng ký, vui lòng nhấp vào nút bên dưới để xác thực
				          email của bạn:
				        </p>

				        <div style="text-align: center">
				          <a href="%s" class="button">✅ Xác thực tài khoản</a>
				        </div>

				        <div class="warning">
				          <strong>⚠️ Lưu ý quan trọng:</strong>
				          <ul>
				            <li>Link xác thực này sẽ hết hạn sau <strong>30 phút</strong></li>
				            <li>
				              Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này
				            </li>
				            <li>Không chia sẻ link này với bất kỳ ai khác</li>
				          </ul>
				        </div>
				      </div>
				      <div class="footer">
				        <p><strong>© 2025 Nguyễn Kim Thi</strong></p>
				        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
				      </div>
				    </div>
				  </body>
				</html>
				"""
				.formatted(username, verificationUrl, verificationUrl);
	}

	/**
	 * Tạo template HTML cho email đặt lại mật khẩu
	 * 
	 * @param username Tên người dùng
	 * @param resetUrl URL đặt lại mật khẩu
	 * @return Template HTML
	 */
	private String buildPasswordResetEmailTemplate(String username, String resetUrl) {
		return """
				<!DOCTYPE html>
				 <html>
				   <head>
				     <meta charset="UTF-8" />
				     <title>Đặt lại mật khẩu</title>
				     <style>
				       body {
				         font-family: Arial, sans-serif;
				         line-height: 1.6;
				         color: #333;
				       }
				       .container {
				         max-width: 600px;
				         margin: 0 auto;
				         padding: 20px;
				       }
				       .header {
				         background-color: #ff6b6b;
				         color: white;
				         padding: 20px;
				         text-align: center;
				         border-radius: 8px 8px 0 0;
				       }
				       .content {
				         padding: 30px;
				         background-color: #f9f9f9;
				       }
				       .button {
				         display: inline-block;
				         padding: 15px 30px;
				         background-color: #ff6b6b;
				         color: white !important;
				         text-decoration: none;
				         border-radius: 5px;
				         margin: 20px 0;
				         font-weight: bold;
				       }
				       .footer {
				         text-align: center;
				         padding: 20px;
				         color: #666;
				         font-size: 12px;
				         background-color: #f0f0f0;
				         border-radius: 0 0 8px 8px;
				       }
				       .warning {
				         background-color: #ffe6e6;
				         border-left: 4px solid #ff6b6b;
				         padding: 15px;
				         margin: 15px 0;
				       }
				     </style>
				   </head>
				   <body>
				     <div class="container">
				       <div class="header">
				         <h1>🔐 Đặt lại mật khẩu</h1>
				       </div>
				       <div class="content">
				         <h2>Xin chào %s!</h2>
				         <p>
				           Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản WebtoonNKT của
				           bạn.
				         </p>

				         <div class="warning">
				           <strong>🛡️ Bảo mật quan trọng:</strong><br />
				           Nếu bạn <strong>KHÔNG</strong> yêu cầu đặt lại mật khẩu, vui lòng bỏ
				           qua email này. Mật khẩu của bạn sẽ không bị thay đổi.
				         </div>

				         <p>Để đặt lại mật khẩu, vui lòng nhấp vào nút bên dưới:</p>

				         <div style="text-align: center">
				           <a href="%s" class="button">🔑 Đặt lại mật khẩu</a>
				         </div>

				         <p>
				           <strong>⏰ Quan trọng:</strong> Link này sẽ hết hạn sau
				           <strong>30 phút</strong> vì lý do bảo mật.
				         </p>
				       </div>
				       <div class="footer">
				         <p><strong>© 2025 Nguyễn Kim Thi</strong></p>
				         <p>Email này được gửi tự động, vui lòng không trả lời.</p>
				       </div>
				     </div>
				   </body>
				 </html>
				 """
				.formatted(username, resetUrl, resetUrl);
	}
}
