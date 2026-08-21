package com.crewpilot.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
  name = "crew_skills",
  uniqueConstraints = {
    @UniqueConstraint(
      columnNames = {"crew_member_id", "skill_id"}
    )
  }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrewSkill {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "crew_member_id", nullable = false)
  private CrewMember crewMember;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "skill_id", nullable = false)
  private Skill skill;

  @Column(name = "proficiency_level")
  private BigDecimal proficiencyLevel;
}
