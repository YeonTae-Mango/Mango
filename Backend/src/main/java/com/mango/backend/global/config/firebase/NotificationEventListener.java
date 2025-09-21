package com.mango.backend.global.config.firebase;

import com.mango.backend.domain.event.NotificationEvent;
import com.mango.backend.domain.notification.entity.Notification;
import com.mango.backend.domain.notification.repository.NotificationRepository;
import com.mango.backend.domain.notification.service.FcmService;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

  private final UserRepository userRepository;
  private final NotificationRepository notificationRepository;
  private final FcmService fcmService;

  @TransactionalEventListener
  public void handleNotificationEvent(NotificationEvent event) {
    User user = userRepository.findById(event.userId())
        .orElse(null);
    if (user == null) {
      return;
    }

    String fcmToken = user.getFcmToken();
    if (fcmToken != null && !fcmToken.isBlank()) {
      fcmService.sendMessage(fcmToken, event.title(), event.message());

      //TODO : 어떤 때 알림 보낼 지 확정을 낸 후 Subcode 추가 필요
      Notification notification = Notification.builder()
          .user(user)
          .title(event.title())
          .message(event.message())
          .isRead(false)
          .build();
      notificationRepository.save(notification);
    }
  }
}
