package com.crewpilot.backend.controller;

import com.crewpilot.backend.entity.Recommendation;
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
  public List<Recommendation> getRecommendations(
    @PathVariable Long eventId
  ) {
    return recommendationEngine.getRecommendationsForEvent(eventId);
  }

  @PostMapping("/event/{eventId}/generate")
  public List<Recommendation> generateRecommendations(
    @PathVariable Long eventId
  ) {
    return recommendationEngine.generateRecommendations(eventId);
  }
}
