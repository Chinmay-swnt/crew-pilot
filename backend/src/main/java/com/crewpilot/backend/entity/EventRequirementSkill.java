package com.crewpilot.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
  name = "event_requirement_skills",
  uniqueConstraints = {
    @UniqueConstraint(
      columnNames = {"event_requirement_id", "skill_id"}
    )
  }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRequirementSkill {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "event_requirement_id", nullable = false)
  private EventRequirement eventRequirement;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "skill_id", nullable = false)
  private Skill skill;
}
