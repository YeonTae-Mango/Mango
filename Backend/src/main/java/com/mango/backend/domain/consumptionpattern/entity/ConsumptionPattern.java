package com.mango.backend.domain.consumptionpattern.entity;

import com.mango.backend.domain.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
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
@Table(name = "consumption_patterns")
public class ConsumptionPattern {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "pattern_id", nullable = false)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "primary_category")
  private String primaryCategory;

  @Column(name = "analysis_period_start", nullable = false)
  private LocalDate analysisPeriodStart;

  @Column(name = "analysis_period_end", nullable = false)
  private LocalDate analysisPeriodEnd;

}