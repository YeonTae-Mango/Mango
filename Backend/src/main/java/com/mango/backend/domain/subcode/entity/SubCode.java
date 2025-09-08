package com.mango.backend.domain.subcode.entity;

import com.mango.backend.domain.maincode.entity.MainCode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Table(name = "sub_code")
public class SubCode {

  @Id
  @Column(name = "sub_code", nullable = false, length = 30)
  private String subCode;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "main_code", nullable = false)
  private MainCode mainCode;

  @Column(name = "sub_code_name", nullable = false, length = 100)
  private String subCodeName;

  @Column(name = "sub_code_description", length = 1000)
  private String subCodeDescription;

  @ColumnDefault("1")
  @Column(name = "level")
  private Byte level;

  @Column(name = "parent_code", length = 30)
  private String parentCode;

  @Column(name = "sort_order")
  private Integer sortOrder;

  @Column(name = "use_yn")
  private Boolean useYn;

}