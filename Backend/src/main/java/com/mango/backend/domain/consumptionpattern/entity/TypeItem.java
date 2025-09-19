package com.mango.backend.domain.consumptionpattern.entity;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class TypeItem {
    private String name;
    private Double prob;
}