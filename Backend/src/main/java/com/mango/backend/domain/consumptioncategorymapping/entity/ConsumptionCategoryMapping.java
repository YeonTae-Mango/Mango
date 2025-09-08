package com.mango.backend.domain.consumptioncategorymapping.entity;

import com.mango.backend.domain.consumptionpattern.entity.ConsumptionPattern;
import com.mango.backend.domain.subcode.entity.SubCode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
@Table(name = "consumption_category_mapping")
public class ConsumptionCategoryMapping {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "mapping_id", nullable = false)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "sub_code", nullable = false)
  private SubCode subCode;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "pattern_id", nullable = false)
  private ConsumptionPattern pattern;

  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "food_code", nullable = false)
  private SubCode foodCode;
}