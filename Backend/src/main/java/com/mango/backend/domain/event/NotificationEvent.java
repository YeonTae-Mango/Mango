package com.mango.backend.domain.event;


public record NotificationEvent(
    Long userId,
    String title,
    String message
) {

  public static NotificationEvent from(Long userId, String title, String message) {
    return new NotificationEvent(userId, title, message);
  }
}
