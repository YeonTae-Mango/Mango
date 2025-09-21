package com.mango.backend.global.config.firebase;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

@Component
public class FirebaseConfig {

  @Value("${firebase.type}")
  private String type;

  @Value("${firebase.project-id}")
  private String projectId;

  @Value("${firebase.private-key-id}")
  private String privateKeyId;

  @Value("${firebase.private-key}")
  private String privateKey;

  @Value("${firebase.client-email}")
  private String clientEmail;

  @Value("${firebase.client-id}")
  private String clientId;

  @Value("${firebase.auth-uri}")
  private String authUri;

  @Value("${firebase.token-uri}")
  private String tokenUri;

  @Value("${firebase.auth-provider-x509-cert-url}")
  private String authProviderX509CertUrl;

  @Value("${firebase.client-x509-cert-url}")
  private String clientX509CertUrl;

  @Value("${firebase.universe-domain}")
  private String universeDomain;

  @PostConstruct
  public void init() {
    try {
      if (FirebaseApp.getApps().isEmpty()) {

        String json = String.format(
                "{"
                        + "\"type\":\"%s\","
                        + "\"project_id\":\"%s\","
                        + "\"private_key_id\":\"%s\","
                        + "\"private_key\":\"%s\","
                        + "\"client_email\":\"%s\","
                        + "\"client_id\":\"%s\","
                        + "\"auth_uri\":\"%s\","
                        + "\"token_uri\":\"%s\","
                        + "\"auth_provider_x509_cert_url\":\"%s\","
                        + "\"client_x509_cert_url\":\"%s\","
                        + "\"universe_domain\":\"%s\""
                        + "}",
                type,
                projectId,
                privateKeyId,
                privateKey,
                clientEmail,
                clientId,
                authUri,
                tokenUri,
                authProviderX509CertUrl,
                clientX509CertUrl,
                universeDomain
        );

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(
                        new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8))
                ))
                .build();

        FirebaseApp.initializeApp(options);
      }
    } catch (Exception e) {
      throw new RuntimeException("Firebase 초기화 실패", e);
    }
  }
}
