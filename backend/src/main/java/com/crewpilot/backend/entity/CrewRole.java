package com.crewpilot.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
  name = "crew_roles",
  uniqueConstraints = {
    @UniqueConstraint(
      columnNames = {"crew_member_id", "role_id"}
    )
  }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrewRole {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "crew_member_id", nullable = false)
  private CrewMember crewMember;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "role_id", nullable = false)
  private Role role;

  @Column(name = "experience_years")
  private BigDecimal experienceYears;

  private BigDecimal proficiency;
}
