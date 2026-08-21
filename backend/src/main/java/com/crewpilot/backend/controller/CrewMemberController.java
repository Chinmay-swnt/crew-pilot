package com.crewpilot.backend.controller;

import com.crewpilot.backend.dto.CrewMemberResponse;
import com.crewpilot.backend.entity.CrewMember;
import com.crewpilot.backend.service.CrewMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crew")
@RequiredArgsConstructor
@CrossOrigin
public class CrewMemberController {

  private final CrewMemberService crewMemberService;

  @GetMapping
  public List<CrewMemberResponse> getAllCrewMembers() {
    return crewMemberService.getAllCrewMembers()
      .stream()
      .map(this::toResponse)
      .toList();
  }

  @GetMapping("/{id}")
  public CrewMemberResponse getCrewMember(
    @PathVariable Long id
  ) {
    return toResponse(
      crewMemberService.getCrewMemberById(id)
    );
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CrewMemberResponse createCrewMember(
    @RequestBody CrewMember crewMember
  ) {
    return toResponse(
      crewMemberService.createCrewMember(crewMember)
    );
  }

  @PutMapping("/{id}")
  public CrewMemberResponse updateCrewMember(
    @PathVariable Long id,
    @RequestBody CrewMember crewMember
  ) {
    return toResponse(
      crewMemberService.updateCrewMember(
        id,
        crewMember
      )
    );
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteCrewMember(
    @PathVariable Long id
  ) {
    crewMemberService.deleteCrewMember(id);
  }

  private CrewMemberResponse toResponse(
    CrewMember member
  ) {
    return new CrewMemberResponse(
      member.getId(),
      member.getName(),
      member.getPhone(),
      member.getEmail(),
      member.getBio(),
      member.getExperienceYears(),
      member.getBasePrice(),
      member.getLocation(),
      member.getLatitude(),
      member.getLongitude(),
      member.getRating(),
      member.getReliabilityScore(),
      member.getStatus(),
      member.getRole() != null
        ? member.getRole().getId()
        : null
    );
  }
}
