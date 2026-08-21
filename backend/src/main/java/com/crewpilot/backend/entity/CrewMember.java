package com.crewpilot.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "crew_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrewMember {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  private String phone;

  private String email;

  @Column(columnDefinition = "TEXT")
  private String bio;

  @Column(name = "experience_years")
  private BigDecimal experienceYears;

  @Column(name = "base_price")
  private BigDecimal basePrice;

  private String location;

  private Double latitude;

  private Double longitude;

  private Double rating;

  @Column(name = "reliability_score")
  private Double reliabilityScore;

  @Column(nullable = false)
  private String status;

  @Version
  private Long version;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @Column(name = "base_rate", nullable = false)
  private BigDecimal baseRate;

  @Column(nullable = false)
  private Integer cancellations;

  @Column(name = "successful_events", nullable = false)
  private Integer successfulEvents;

  @Column(name = "total_events", nullable = false)
  private Integer totalEvents;

  /*
   * Primary/current role.
   */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "role_id", nullable = false)
  private Role role;

  /*
   * Additional roles and role-specific proficiency.
   */
  @OneToMany(mappedBy = "crewMember", cascade = CascadeType.ALL)
  @Builder.Default
  private List<CrewRole> crewRoles = new ArrayList<>();

  /*
   * Skills and skill-specific proficiency.
   */
  @OneToMany(mappedBy = "crewMember", cascade = CascadeType.ALL)
  @Builder.Default
  private List<CrewSkill> crewSkills = new ArrayList<>();
}
