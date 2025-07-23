package com.thjvjpxx.backend_comic.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.thjvjpxx.backend_comic.interceptor.VipStatusInterceptor;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * Cấu hình Web
 */
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WebConfig implements WebMvcConfigurer {

    VipStatusInterceptor vipStatusInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(vipStatusInterceptor)
                .addPathPatterns("/**") // Áp dụng cho tất cả path
                .excludePathPatterns(
                        "/auth/**" // Loại trừ authentication endpoints
                );
    }
}