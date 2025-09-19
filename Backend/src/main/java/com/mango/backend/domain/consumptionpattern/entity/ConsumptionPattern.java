package com.mango.backend.domain.consumptionpattern.entity;

import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Document(collection = "consumption_patterns")
public class ConsumptionPattern {

  @Id
  private String id;

  @Field("user_id")
  private Long userId;

  @Field("main_type")
  private List<TypeItem> mainType;

  @Field("keyword")
  private List<KeywordItem> keyword;

  @Field("foods")
  private List<FoodItem> food;

  @Field("start_date")
  private LocalDateTime startDate;

  @Field("end_date")
  private LocalDateTime endDate;

}