package com.crewpilot.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "organizer_id", nullable = false)
  private Organizer organizer;

  @Column(nullable = false)
  private String name;

  @Column(name = "event_type")
  private String eventType;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(name = "date", nullable = false)
  private LocalDate date;

  @Column(name = "start_time")
  private LocalTime startTime;

  @Column(name = "end_time")
  private LocalTime endTime;

  private String location;

  private Double latitude;

  private Double longitude;

  @Column(name = "guest_count")
  private Integer guestCount;

  private BigDecimal budget;

  @Column(nullable = false)
  private String status;

  private Long version;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @OneToMany(mappedBy = "event")
  @Builder.Default
  private List<EventRequirement> requirements = new ArrayList<>();
}
