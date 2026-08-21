package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.CrewMember;
import com.crewpilot.backend.entity.Event;
import com.crewpilot.backend.entity.EventRequirement;
import com.crewpilot.backend.entity.RecommendedCrew;
import com.crewpilot.backend.entity.Recommendation;
import com.crewpilot.backend.repository.CrewMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TeamOptimizationService {

  private final CrewMemberRepository crewMemberRepository;
  private final CandidateScoringService candidateScoringService;

  public Recommendation optimize(
    Event event,
    List<EventRequirement> requirements
  ) {

    List<CrewMember> crewMembers =
      crewMemberRepository.findAll();

    List<RecommendedCrew> selectedCrew =
      new ArrayList<>();

    Set<Long> alreadySelectedCrew =
      new HashSet<>();

    BigDecimal totalCost = BigDecimal.ZERO;
    BigDecimal totalScore = BigDecimal.ZERO;
    BigDecimal totalReliability = BigDecimal.ZERO;

    int scoreCount = 0;

    for (EventRequirement requirement : requirements) {

      List<CandidateScore> candidates =
        crewMembers.stream()
          .map(crew ->
            candidateScoringService.score(
              crew,
              event,
              requirement
            )
          )
          .filter(candidate ->
            candidate.getAvailability()
              .compareTo(BigDecimal.ZERO) > 0
          )
          .filter(candidate ->
            candidate.getRoleFit()
              .compareTo(BigDecimal.ZERO) > 0
          )
          .sorted(
            Comparator.comparing(
              CandidateScore::getOverallScore
            ).reversed()
          )
          .toList();

      int quantity = requirement.getQuantity() != null
        ? requirement.getQuantity()
        : 1;

      int primaryCount = 0;
      int backupCount = 0;

      for (CandidateScore candidate : candidates) {

        CrewMember crew =
          candidate.getCrewMember();

        /*
         * A crew member should not be assigned twice
         * to the same event.
         */
        if (alreadySelectedCrew.contains(crew.getId())) {
          continue;
        }

        String priority;

        if (primaryCount < quantity) {
          priority = "PRIMARY";
          primaryCount++;
        } else if (backupCount < quantity) {
          priority = "BACKUP";
          backupCount++;
        } else {
          break;
        }

        RecommendedCrew recommended =
          RecommendedCrew.builder()
            .recommendation(null)
            .crewMember(crew)
            .role(requirement.getRole())
            .priority(priority)
            .individualScore(
              candidate.getOverallScore()
            )
            .predictedReliability(
              candidate.getReliability()
            )
            .estimatedCost(
              candidate.getEstimatedCost()
            )
            .build();

        selectedCrew.add(recommended);

        alreadySelectedCrew.add(
          crew.getId()
        );

        /*
         * Only primary crew contributes to the
         * total team cost and aggregate score.
         */
        if ("PRIMARY".equals(priority)) {

          totalCost =
            totalCost.add(
              candidate.getEstimatedCost()
            );

          totalScore =
            totalScore.add(
              candidate.getOverallScore()
            );

          totalReliability =
            totalReliability.add(
              candidate.getReliability()
            );

          scoreCount++;
        }
      }
    }

    BigDecimal overallScore =
      scoreCount == 0
        ? BigDecimal.ZERO
        : totalScore.divide(
        BigDecimal.valueOf(scoreCount),
        2,
        java.math.RoundingMode.HALF_UP
      );

    BigDecimal predictedReliability =
      scoreCount == 0
        ? BigDecimal.ZERO
        : totalReliability.divide(
        BigDecimal.valueOf(scoreCount),
        2,
        java.math.RoundingMode.HALF_UP
      );

    Recommendation recommendation =
      Recommendation.builder()
        .event(event)
        .overallScore(overallScore)
        .totalCost(totalCost)
        .predictedReliability(predictedReliability)
        .generatedAt(java.time.LocalDateTime.now())
        .build();

    /*
     * Connect children to the parent recommendation.
     */
    for (RecommendedCrew crew : selectedCrew) {
      crew.setRecommendation(recommendation);
    }

    recommendation.setRecommendedCrew(
      selectedCrew
    );

    return recommendation;
  }
}
