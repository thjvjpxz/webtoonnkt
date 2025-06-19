package com.thjvjpxx.backend_comic.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * Cấu hình ứng dụng cho crawler và async processing
 */
@Configuration
@EnableAsync
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

    /**
     * Cấu hình thread pool cho async tasks (webhook registration, etc.)
     * 
     * @return TaskExecutor cho async tasks
     */
    @Bean("asyncExecutor")
    public TaskExecutor asyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(1);
        executor.setMaxPoolSize(3);
        executor.setQueueCapacity(5);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}