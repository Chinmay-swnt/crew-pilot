package com.crewpilot.backend.repository;

import com.crewpilot.backend.entity.EventRequirementSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRequirementSkillRepository
  extends JpaRepository<EventRequirementSkill, Long> {

  List<EventRequirementSkill> findByEventRequirementId(
    Long eventRequirementId
  );

  List<EventRequirementSkill> findBySkillId(Long skillId);

  boolean existsByEventRequirementIdAndSkillId(
    Long eventRequirementId,
    Long skillId
  );

}
