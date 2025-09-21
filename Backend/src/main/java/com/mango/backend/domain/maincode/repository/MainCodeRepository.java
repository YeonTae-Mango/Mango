package com.mango.backend.domain.maincode.repository;

import com.mango.backend.domain.maincode.entity.MainCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MainCodeRepository extends JpaRepository<MainCode, Long> {
    List<MainCode> findByMainCodeStartingWith(String prefix);
}
