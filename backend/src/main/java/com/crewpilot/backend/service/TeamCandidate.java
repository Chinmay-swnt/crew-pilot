package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.EventRequirement;
import com.crewpilot.backend.entity.CrewMember;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TeamCandidate {

  private final CrewMember crewMember;
  private final EventRequirement requirement;
  private final CandidateScore score;
}
