package com.crewpilot.backend.dto;

import java.math.BigDecimal;

public record RecommendedCrewResponse(
  Long id,
  Long crewMemberId,
  String crewMemberName,
  Long roleId,
  String roleName,
  String priority,
  BigDecimal individualScore,
  BigDecimal predictedReliability,
  BigDecimal estimatedCost
) {}
