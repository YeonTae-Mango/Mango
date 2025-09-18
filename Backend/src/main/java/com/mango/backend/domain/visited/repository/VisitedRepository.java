package com.mango.backend.domain.visited.repository;

import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.visited.entity.Visited;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitedRepository extends JpaRepository<Visited, Long> {

  List<Visited> findAllByFrom(User from);
}