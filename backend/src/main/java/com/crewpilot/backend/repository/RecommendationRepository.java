package com.crewpilot.backend.repository;

import com.crewpilot.backend.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommendationRepository
  extends JpaRepository<Recommendation, Long> {

  List<Recommendation> findByEventId(Long eventId);
}
