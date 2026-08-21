package com.crewpilot.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record RecommendationResponse(
  Long id,
  Long eventId,
  BigDecimal overallScore,
  BigDecimal totalCost,
  BigDecimal predictedReliability,
  LocalDateTime generatedAt,
  List<RecommendedCrewResponse> recommendedCrew
) {}
