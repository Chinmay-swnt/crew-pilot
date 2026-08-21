package com.crewpilot.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record AvailabilityResponse(
  Long id,
  Long crewMemberId,
  String crewMemberName,
  LocalDate date,
  LocalTime startTime,
  LocalTime endTime,
  Boolean available
) {}
