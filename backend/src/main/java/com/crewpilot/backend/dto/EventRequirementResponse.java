package com.crewpilot.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record EventRequirementResponse(
  Long id,
  Long eventId,
  Long roleId,
  String roleName,
  Integer quantity,
  BigDecimal requiredExperience,
  List<Long> skillIds
) {}
