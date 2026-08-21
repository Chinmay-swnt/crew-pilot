package com.crewpilot.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceHistory {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "crew_member_id", nullable = false)
  private CrewMember crewMember;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "event_id")
  private Event event;

  @Column(name = "event_type")
  private String eventType;

  private BigDecimal rating;

  @Column(name = "arrived_on_time")
  private Boolean arrivedOnTime;

  @Column(name = "no_show")
  private Boolean noShow;

  @Column(name = "completed_successfully")
  private Boolean completedSuccessfully;

  @Column(name = "client_feedback", columnDefinition = "TEXT")
  private String clientFeedback;

  @Column(name = "performance_score")
  private BigDecimal performanceScore;

  @Column(name = "created_at")
  private LocalDateTime createdAt;
}
