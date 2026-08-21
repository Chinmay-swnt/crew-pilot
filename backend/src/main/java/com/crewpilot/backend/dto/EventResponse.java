package com.crewpilot.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record EventResponse(
  Long id,
  Long organizerId,
  String name,
  String eventType,
  String description,
  LocalDate date,
  LocalTime startTime,
  LocalTime endTime,
  String location,
  Double latitude,
  Double longitude,
  Integer guestCount,
  BigDecimal budget,
  String status,
  Long version,
  LocalDateTime createdAt,
  LocalDateTime updatedAt
) {}
