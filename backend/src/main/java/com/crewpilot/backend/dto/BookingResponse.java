package com.crewpilot.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingResponse(
  Long id,
  Long eventId,
  Long crewMemberId,
  String crewMemberName,
  Long roleId,
  String roleName,
  String status,
  BigDecimal agreedPrice,
  Long version,
  LocalDateTime bookedAt
) {}
