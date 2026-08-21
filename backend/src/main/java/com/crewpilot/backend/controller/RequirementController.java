package com.crewpilot.backend.controller;

import com.crewpilot.backend.dto.EventRequirementResponse;
import com.crewpilot.backend.dto.RequirementSkillResponse;
import com.crewpilot.backend.entity.EventRequirement;
import com.crewpilot.backend.entity.EventRequirementSkill;
import com.crewpilot.backend.service.EventRequirementSkillService;
import com.crewpilot.backend.service.RequirementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requirements")
@RequiredArgsConstructor
@CrossOrigin
public class RequirementController {

  private final RequirementService requirementService;
  private final EventRequirementSkillService skillService;

  @GetMapping("/{requirementId}")
  public EventRequirementResponse getRequirement(
    @PathVariable Long requirementId
  ) {
    return toRequirementResponse(
      requirementService.getRequirementById(requirementId)
    );
  }

  @PutMapping("/{requirementId}")
  public EventRequirementResponse updateRequirement(
    @PathVariable Long requirementId,
    @RequestBody EventRequirement requirement
  ) {
    return toRequirementResponse(
      requirementService.updateRequirement(
        requirementId,
        requirement
      )
    );
  }

  @DeleteMapping("/{requirementId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteRequirement(
    @PathVariable Long requirementId
  ) {
    requirementService.deleteRequirement(requirementId);
  }

  @GetMapping("/{requirementId}/skills")
  public List<RequirementSkillResponse> getSkills(
    @PathVariable Long requirementId
  ) {
    return skillService.getSkillsForRequirement(requirementId)
      .stream()
      .map(this::toSkillResponse)
      .toList();
  }

  @PostMapping("/{requirementId}/skills/{skillId}")
  @ResponseStatus(HttpStatus.CREATED)
  public RequirementSkillResponse addSkill(
    @PathVariable Long requirementId,
    @PathVariable Long skillId
  ) {
    return toSkillResponse(
      skillService.addSkillToRequirement(
        requirementId,
        skillId
      )
    );
  }

  @DeleteMapping("/{requirementId}/skills/{skillId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void removeSkill(
    @PathVariable Long requirementId,
    @PathVariable Long skillId
  ) {
    skillService.removeSkillFromRequirement(
      requirementId,
      skillId
    );
  }

  private EventRequirementResponse toRequirementResponse(
    EventRequirement requirement
  ) {
    return new EventRequirementResponse(
      requirement.getId(),
      requirement.getEvent() != null
        ? requirement.getEvent().getId()
        : null,
      requirement.getRole() != null
        ? requirement.getRole().getId()
        : null,
      requirement.getRole() != null
        ? requirement.getRole().getName()
        : null,
      requirement.getQuantity(),
      requirement.getRequiredExperience(),
      requirement.getRequiredSkills()
        .stream()
        .map(skill -> skill.getSkill().getId())
        .toList()
    );
  }

  private RequirementSkillResponse toSkillResponse(
    EventRequirementSkill skill
  ) {
    return new RequirementSkillResponse(
      skill.getId(),
      skill.getEventRequirement() != null
        ? skill.getEventRequirement().getId()
        : null,
      skill.getSkill() != null
        ? skill.getSkill().getId()
        : null,
      skill.getSkill() != null
        ? skill.getSkill().getName()
        : null
    );
  }
}
