package com.crewpilot.backend.dto;

public record RequirementSkillResponse(
  Long id,
  Long requirementId,
  Long skillId,
  String skillName
) {}
