package com.crewpilot.backend.repository;

import com.crewpilot.backend.entity.CrewMember;
import com.crewpilot.backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CrewMemberRepository extends JpaRepository<CrewMember, Long> {

  List<CrewMember> findByRole(Role role);

  List<CrewMember> findByRoleId(Long roleId);

  List<CrewMember> findByLocationIgnoreCase(String location);
}
