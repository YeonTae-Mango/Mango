package com.mango.backend.domain.consumptionpattern.repository;

import com.mango.backend.domain.consumptionpattern.entity.ConsumptionPattern;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConsumptionPatternRepository extends MongoRepository<ConsumptionPattern, String> {

    Optional<ConsumptionPattern> findFirstByUserIdOrderByStartDateDesc(Long userId);

    ConsumptionPattern findFirstByUserIdOrderByEndDateDesc(Long userId);
}
