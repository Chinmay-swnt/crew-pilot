package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.Skill;
import com.crewpilot.backend.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

  private final SkillRepository skillRepository;

  public List<Skill> getAllSkills() {
    return skillRepository.findAll();
  }

  public Skill getSkillById(Long id) {
    return skillRepository.findById(id)
      .orElseThrow(() ->
        new RuntimeException("Skill not found: " + id));
  }

  public Skill createSkill(Skill skill) {
    return skillRepository.save(skill);
  }

  public Skill updateSkill(Long id, Skill updatedSkill) {
    Skill existing = getSkillById(id);

    existing.setName(updatedSkill.getName());

    return skillRepository.save(existing);
  }

  public void deleteSkill(Long id) {
    Skill existing = getSkillById(id);
    skillRepository.delete(existing);
  }
}
