package com.mango.backend.global.config.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FirebaseConfig {

  @PostConstruct
  public void init() {
    try {
      if (FirebaseApp.getApps().isEmpty()) {
        FileInputStream serviceAccount =
            //TODO : 환경변수로 JSON 빼야 함
            new FileInputStream("src/main/resources/FireBaseKey.json");

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
