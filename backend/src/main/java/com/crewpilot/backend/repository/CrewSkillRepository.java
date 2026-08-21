package com.crewpilot.backend.repository;

import com.crewpilot.backend.entity.CrewSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CrewSkillRepository extends JpaRepository<CrewSkill, Long> {

  List<CrewSkill> findByCrewMemberId(Long crewMemberId);

  List<CrewSkill> findBySkillId(Long skillId);

  List<CrewSkill> findByCrewMemberIdAndSkillId(
    Long crewMemberId,
    Long skillId
  );
}
