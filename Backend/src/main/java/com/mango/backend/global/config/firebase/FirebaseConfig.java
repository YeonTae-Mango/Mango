package com.mango.backend.global.config.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FirebaseConfig {

  @Value("${FIREBASE_KEY_PATH:src/main/resources/FireBaseKey.json}")
  private String firebaseKeyPath;

  @PostConstruct
  public void init() {
    try {
      if (FirebaseApp.getApps().isEmpty()) {
        FileInputStream serviceAccount = new FileInputStream(firebaseKeyPath);

        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .build();

        FirebaseApp.initializeApp(options);
      }
    } catch (Exception e) {
      throw new RuntimeException("Firebase 초기화 실패", e);
    }
  }
}