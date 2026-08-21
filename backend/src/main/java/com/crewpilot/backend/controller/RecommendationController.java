package com.crewpilot.backend.controller;

import com.crewpilot.backend.dto.RecommendationResponse;
import com.crewpilot.backend.dto.RecommendedCrewResponse;
import com.crewpilot.backend.entity.Recommendation;
import com.crewpilot.backend.entity.RecommendedCrew;
import com.crewpilot.backend.service.RecommendationEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@CrossOrigin
public class RecommendationController {

  private final RecommendationEngine recommendationEngine;

  @GetMapping("/event/{eventId}")
  public List<RecommendationResponse> getRecommendations(
    @PathVariable Long eventId
  ) {
    return recommendationEngine
      .getRecommendationsForEvent(eventId)
      .stream()
      .map(this::toResponse)
      .toList();
  }

  @PostMapping("/event/{eventId}/generate")
  public List<RecommendationResponse> generateRecommendations(
    @PathVariable Long eventId
  ) {
    return recommendationEngine
      .generateRecommendations(eventId)
      .stream()
      .map(this::toResponse)
      .toList();
  }

  private RecommendationResponse toResponse(
    Recommendation recommendation
  ) {
    return new RecommendationResponse(
      recommendation.getId(),
      recommendation.getEvent() != null
        ? recommendation.getEvent().getId()
        : null,
      recommendation.getOverallScore(),
      recommendation.getTotalCost(),
      recommendation.getPredictedReliability(),
      recommendation.getGeneratedAt(),
      recommendation.getRecommendedCrew()
        .stream()
        .map(this::toRecommendedCrewResponse)
        .toList()
    );
  }

  private RecommendedCrewResponse toRecommendedCrewResponse(
    RecommendedCrew recommendedCrew
  ) {
    return new RecommendedCrewResponse(
      recommendedCrew.getId(),
      recommendedCrew.getCrewMember() != null
        ? recommendedCrew.getCrewMember().getId()
        : null,
      recommendedCrew.getCrewMember() != null
        ? recommendedCrew.getCrewMember().getName()
        : null,
      recommendedCrew.getRole() != null
        ? recommendedCrew.getRole().getId()
        : null,
      recommendedCrew.getRole() != null
        ? recommendedCrew.getRole().getName()
        : null,
      recommendedCrew.getPriority(),
      recommendedCrew.getIndividualScore(),
      recommendedCrew.getPredictedReliability(),
      recommendedCrew.getEstimatedCost()
    );
  }
}
