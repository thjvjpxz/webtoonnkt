package com.thjvjpxx.backend_comic.config;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.checksums.RequestChecksumCalculation;
import software.amazon.awssdk.core.checksums.ResponseChecksumValidation;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

/**
 * Cấu hình Backblaze B2
 */
@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BackblazeB2Config {
    @Value("${b2.accessKeyId}")
    String accessKeyId;

    @Value("${b2.secretKey}")
    String secretKey;

    @Value("${b2.endpoint}")
    String endpoint;

    @Value("${b2.region}")
    String region;

    /**
     * Tạo S3Client cho Backblaze B2
     * 
     * @return S3Client cho Backblaze B2
     */
    @Bean
    public S3Client s3Client() {
        URI uri = URI.create(endpoint);
        return S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId, secretKey)))
                .endpointOverride(uri)
                .region(Region.of(region))
                .requestChecksumCalculation(RequestChecksumCalculation.WHEN_REQUIRED)
                .responseChecksumValidation(ResponseChecksumValidation.WHEN_REQUIRED)
                .build();
    }
}
