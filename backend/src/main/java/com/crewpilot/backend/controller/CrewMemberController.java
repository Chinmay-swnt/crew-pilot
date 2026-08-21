package com.crewpilot.backend.controller;

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
  public List<CrewMember> getAllCrewMembers() {
    return crewMemberService.getAllCrewMembers();
  }

  @GetMapping("/{id}")
  public CrewMember getCrewMember(@PathVariable Long id) {
    return crewMemberService.getCrewMemberById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CrewMember createCrewMember(
    @RequestBody CrewMember crewMember
  ) {
    return crewMemberService.createCrewMember(crewMember);
  }

  @PutMapping("/{id}")
  public CrewMember updateCrewMember(
    @PathVariable Long id,
    @RequestBody CrewMember crewMember
  ) {
    return crewMemberService.updateCrewMember(id, crewMember);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteCrewMember(@PathVariable Long id) {
    crewMemberService.deleteCrewMember(id);
  }
}
