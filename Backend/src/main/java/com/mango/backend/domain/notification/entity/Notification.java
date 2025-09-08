package com.mango.backend.domain.notification.entity;

import com.mango.backend.domain.subcode.entity.SubCode;
import com.mango.backend.domain.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Table(name = "notifications")
public class Notification {

  @Id
  @Column(name = "notification_id", nullable = false)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "notification_type", nullable = false)
  private SubCode notificationType;

  @Column(name = "title", nullable = false, length = 100)
  private String title;

  @Lob
  @Column(name = "message", nullable = false)
  private String message;

  @Column(name = "reference_id")
  private Long referenceId;

  @Column(name = "is_read")
  private Boolean isRead;

}