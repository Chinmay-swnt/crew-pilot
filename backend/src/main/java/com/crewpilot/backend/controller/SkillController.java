package com.crewpilot.backend.controller;

import com.crewpilot.backend.entity.Skill;
import com.crewpilot.backend.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@CrossOrigin
public class SkillController {

  private final SkillService skillService;

  @GetMapping
  public List<Skill> getAllSkills() {
    return skillService.getAllSkills();
  }

  @GetMapping("/{id}")
  public Skill getSkill(@PathVariable Long id) {
    return skillService.getSkillById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Skill createSkill(@RequestBody Skill skill) {
    return skillService.createSkill(skill);
  }

  @PutMapping("/{id}")
  public Skill updateSkill(
    @PathVariable Long id,
    @RequestBody Skill skill
  ) {
    return skillService.updateSkill(id, skill);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteSkill(@PathVariable Long id) {
    skillService.deleteSkill(id);
  }
}
