package com.crewpilot.backend.repository;

import com.crewpilot.backend.entity.EventRequirement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRequirementRepository
  extends JpaRepository<EventRequirement, Long> {

  List<EventRequirement> findByEventId(Long eventId);

  List<EventRequirement> findByRoleId(Long roleId);

  List<EventRequirement> findByEventIdAndRoleId(
    Long eventId,
    Long roleId
  );
}
