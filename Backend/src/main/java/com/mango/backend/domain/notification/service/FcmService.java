package com.mango.backend.domain.notification.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FcmService {

  public void sendMessage(String token, String title, String body) {
    try {
      Message message = Message.builder()
          .setToken(token)
          .putData("title", title)
          .putData("body", body)
          .build();

      // 알림이 필요하다는 응답을 보내는 부분
      String response = FirebaseMessaging.getInstance().send(message);
      System.out.println("Successfully sent message: " + response);
    } catch (Exception e) {
      throw new RuntimeException("FCM 전송 실패", e);
    }
  }
}
