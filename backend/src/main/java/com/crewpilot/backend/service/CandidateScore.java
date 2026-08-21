package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.CrewMember;
import com.crewpilot.backend.entity.EventRequirement;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class CandidateScore {

  private CrewMember crewMember;
  private EventRequirement requirement;

  private BigDecimal roleFit;
  private BigDecimal skillFit;
  private BigDecimal reliability;
  private BigDecimal availability;
  private BigDecimal proximity;
  private BigDecimal costFit;

  private BigDecimal overallScore;
  private BigDecimal estimatedCost;
}
