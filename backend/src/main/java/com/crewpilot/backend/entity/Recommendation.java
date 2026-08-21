package com.crewpilot.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recommendations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recommendation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "event_id", nullable = false)
  private Event event;

  @Column(name = "overall_score")
  private BigDecimal overallScore;

  @Column(name = "total_cost")
  private BigDecimal totalCost;

  @Column(name = "predicted_reliability")
  private BigDecimal predictedReliability;

  @Column(name = "generated_at")
  private LocalDateTime generatedAt;

  @OneToMany(
    mappedBy = "recommendation",
    cascade = CascadeType.ALL,
    orphanRemoval = true
  )
  @Builder.Default
  private List<RecommendedCrew> recommendedCrew = new ArrayList<>();
}
