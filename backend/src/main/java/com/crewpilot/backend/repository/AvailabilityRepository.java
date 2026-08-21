package com.crewpilot.backend.repository;

import com.crewpilot.backend.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

  List<Availability> findByCrewMemberId(Long crewMemberId);

  List<Availability> findByCrewMemberIdAndDate(
    Long crewMemberId,
    LocalDate date
  );

  List<Availability> findByDateAndAvailable(
    LocalDate date,
    Boolean available
  );
}
