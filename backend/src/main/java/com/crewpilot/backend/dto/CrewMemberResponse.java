package com.crewpilot.backend.dto;

import java.math.BigDecimal;

public record CrewMemberResponse(
  Long id,
  String name,
  String phone,
  String email,
  String bio,
  BigDecimal experienceYears,
  BigDecimal basePrice,
  String location,
  Double latitude,
  Double longitude,
  Double rating,
  Double reliabilityScore,
  String status,
  Long roleId
) {}
