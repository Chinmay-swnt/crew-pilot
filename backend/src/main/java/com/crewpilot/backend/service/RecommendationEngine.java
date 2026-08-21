package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.Event;
import com.crewpilot.backend.entity.EventRequirement;
import com.crewpilot.backend.entity.Recommendation;
import com.crewpilot.backend.repository.EventRepository;
import com.crewpilot.backend.repository.EventRequirementRepository;
import com.crewpilot.backend.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationEngine {

  private final EventRepository eventRepository;
  private final EventRequirementRepository eventRequirementRepository;
  private final RecommendationRepository recommendationRepository;

  public List<Recommendation> getRecommendationsForEvent(Long eventId) {

    if (!eventRepository.existsById(eventId)) {
      throw new RuntimeException("Event not found: " + eventId);
    }

    return recommendationRepository.findByEventId(eventId);
  }

  @Transactional
  public List<Recommendation> generateRecommendations(Long eventId) {

    Event event = eventRepository.findById(eventId)
      .orElseThrow(() ->
        new RuntimeException("Event not found: " + eventId));

    List<EventRequirement> requirements =
      eventRequirementRepository.findByEventId(eventId);

    if (requirements.isEmpty()) {
      throw new RuntimeException(
        "No requirements found for event: " + eventId
      );
    }

    /*
     * XGBoost integration point.
     *
     * Build the feature vector from:
     * - event
     * - event requirements
     * - crew members
     * - crew skills
     * - availability
     * - performance history
     *
     * Then pass those features to your XGBoost model.
     *
     * The model should return predictions such as:
     * - individual score
     * - predicted reliability
     * - estimated suitability
     *
     * DO NOT put the ML scoring formula here.
     */

    Recommendation recommendation = Recommendation.builder()
      .event(event)
      .generatedAt(LocalDateTime.now())
      .build();

    recommendation = recommendationRepository.save(recommendation);

    return List.of(recommendation);
  }
}
