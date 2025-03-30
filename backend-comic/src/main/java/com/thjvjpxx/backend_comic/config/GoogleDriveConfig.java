package com.thjvjpxx.backend_comic.config;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GoogleDriveConfig {
    String APPLICATION_NAME = "comic-backend";
    String CREDENTIALS_FILE_PATH = "src/main/resources/api-sheets-445501-930fee148b70.json";

    @Bean
    Drive driveService() throws GeneralSecurityException, IOException {
        GoogleCredentials credentials = GoogleCredentials
                .fromStream(new FileInputStream(CREDENTIALS_FILE_PATH))
                .createScoped(Collections.singleton(DriveScopes.DRIVE));

        return new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }
}
