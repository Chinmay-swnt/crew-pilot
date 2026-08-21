package com.crewpilot.backend.controller;

import com.crewpilot.backend.entity.EventRequirementSkill;
import com.crewpilot.backend.service.EventRequirementSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requirements")
@RequiredArgsConstructor
@CrossOrigin
public class RequirementController {

  private final EventRequirementSkillService skillService;

  @GetMapping("/{requirementId}/skills")
  public List<EventRequirementSkill> getSkills(
    @PathVariable Long requirementId
  ) {
    return skillService.getSkillsForRequirement(requirementId);
  }

  @PostMapping("/{requirementId}/skills/{skillId}")
  @ResponseStatus(HttpStatus.CREATED)
  public EventRequirementSkill addSkill(
    @PathVariable Long requirementId,
    @PathVariable Long skillId
  ) {
    return skillService.addSkillToRequirement(
      requirementId,
      skillId
    );
  }

  @DeleteMapping("/skills/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void removeSkill(
    @PathVariable Long id
  ) {
    skillService.removeSkillFromRequirement(id);
  }
}
