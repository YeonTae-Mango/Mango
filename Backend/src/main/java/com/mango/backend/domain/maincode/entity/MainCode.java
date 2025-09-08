package com.mango.backend.domain.maincode.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
@Table(name = "main_code")
public class MainCode {

  @Id
  @Column(name = "main_code", nullable = false, length = 20)
  private String mainCode;

  @Column(name = "main_code_name", nullable = false, length = 100)
  private String mainCodeName;

  @Column(name = "main_code_description", length = 1000)
  private String mainCodeDescription;

  @Column(name = "use_yn")
  private Boolean useYn;

}