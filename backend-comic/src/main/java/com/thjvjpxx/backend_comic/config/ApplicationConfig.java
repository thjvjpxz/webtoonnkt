package com.thjvjpxx.backend_comic.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * Cấu hình ứng dụng cho crawler
 */
@Configuration
public class ApplicationConfig {

    /**
     * Cấu hình thread pool cho crawler
     * 
     * @return TaskExecutor cho crawler
     */
    @Bean
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(10);
        executor.setThreadNamePrefix("crawler-");
        executor.initialize();
        return executor;
    }
}