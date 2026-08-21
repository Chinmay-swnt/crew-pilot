package com.crewpilot.backend.repository;

import com.crewpilot.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

  List<Booking> findByEventId(Long eventId);

  List<Booking> findByCrewMemberId(Long crewMemberId);

  List<Booking> findByStatus(String status);

  boolean existsByEventIdAndCrewMemberIdAndRoleId(
    Long eventId,
    Long crewMemberId,
    Long roleId
  );
}
