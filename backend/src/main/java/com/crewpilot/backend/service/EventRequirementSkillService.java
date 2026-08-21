package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.EventRequirement;
import com.crewpilot.backend.entity.EventRequirementSkill;
import com.crewpilot.backend.entity.Skill;
import com.crewpilot.backend.repository.EventRequirementRepository;
import com.crewpilot.backend.repository.EventRequirementSkillRepository;
import com.crewpilot.backend.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventRequirementSkillService {

  private final EventRequirementSkillRepository requirementSkillRepository;
  private final EventRequirementRepository requirementRepository;
  private final SkillRepository skillRepository;

  public List<EventRequirementSkill> getSkillsForRequirement(
    Long requirementId
  ) {
    return requirementSkillRepository
      .findByEventRequirementId(requirementId);
  }

  public EventRequirementSkill addSkillToRequirement(
    Long requirementId,
    Long skillId
  ) {
    EventRequirement requirement = requirementRepository
      .findById(requirementId)
      .orElseThrow(() ->
        new RuntimeException(
          "Requirement not found: " + requirementId
        ));

    Skill skill = skillRepository
      .findById(skillId)
      .orElseThrow(() ->
        new RuntimeException(
          "Skill not found: " + skillId
        ));

    return requirementSkillRepository.save(
      EventRequirementSkill.builder()
        .eventRequirement(requirement)
        .skill(skill)
        .build()
    );
  }

  public void removeSkillFromRequirement(Long id) {
    EventRequirementSkill existing =
      requirementSkillRepository.findById(id)
        .orElseThrow(() ->
          new RuntimeException(
            "Requirement skill not found: " + id
          ));

    requirementSkillRepository.delete(existing);
  }
}
