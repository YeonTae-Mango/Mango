package com.mango.backend.domain.notification.service;

import com.mango.backend.domain.event.NotificationEvent;
import com.mango.backend.domain.notification.repository.NotificationRepository;
import com.mango.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

  private final UserRepository userRepository;
  private final NotificationRepository notificationRepository;
  private final FcmService fcmService;
  private final ApplicationEventPublisher eventPublisher;

  public void publishNotification(Long userId, String title, String message) {
    if (userRepository.existsById(userId)) {
      eventPublisher.publishEvent(new NotificationEvent(userId, title, message));
    }
  }
}
