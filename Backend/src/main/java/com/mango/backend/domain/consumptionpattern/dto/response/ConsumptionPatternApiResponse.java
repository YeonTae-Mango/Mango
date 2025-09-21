package com.mango.backend.domain.consumptionpattern.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mango.backend.domain.consumptionpattern.entity.FoodItem;
import com.mango.backend.domain.consumptionpattern.entity.KeywordItem;
import com.mango.backend.domain.consumptionpattern.entity.TypeItem;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ConsumptionPatternApiResponse {
    @JsonProperty("main_type")
     List<TypeItem> mainType;

    @JsonProperty("keyword")
     List<KeywordItem> keyword;

    @JsonProperty("foods")
     List<FoodItem> foods;
}
