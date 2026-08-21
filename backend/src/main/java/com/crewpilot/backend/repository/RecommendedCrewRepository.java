package com.crewpilot.backend.repository;

import com.crewpilot.backend.entity.RecommendedCrew;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommendedCrewRepository
  extends JpaRepository<RecommendedCrew, Long> {

  List<RecommendedCrew> findByRecommendationId(Long recommendationId);

  List<RecommendedCrew> findByCrewMemberId(Long crewMemberId);

  List<RecommendedCrew> findByPriority(String priority);
}
