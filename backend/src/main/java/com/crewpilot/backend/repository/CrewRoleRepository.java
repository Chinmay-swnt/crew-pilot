package com.crewpilot.backend.repository;

import com.crewpilot.backend.entity.CrewRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CrewRoleRepository extends JpaRepository<CrewRole, Long> {

  List<CrewRole> findByCrewMemberId(Long crewMemberId);

  List<CrewRole> findByRoleId(Long roleId);

  List<CrewRole> findByCrewMemberIdAndRoleId(
    Long crewMemberId,
    Long roleId
  );
}
