package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.CrewMember;
import com.crewpilot.backend.repository.CrewMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CrewMemberService {

  private final CrewMemberRepository crewMemberRepository;

  public List<CrewMember> getAllCrewMembers() {
    return crewMemberRepository.findAll();
  }

  public CrewMember getCrewMemberById(Long id) {
    return crewMemberRepository.findById(id)
      .orElseThrow(() ->
        new RuntimeException("Crew member not found: " + id));
  }

  public CrewMember createCrewMember(CrewMember crewMember) {
    return crewMemberRepository.save(crewMember);
  }

  public CrewMember updateCrewMember(Long id, CrewMember updatedCrewMember) {

    CrewMember existing = getCrewMemberById(id);

    existing.setName(updatedCrewMember.getName());
    existing.setPhone(updatedCrewMember.getPhone());
    existing.setEmail(updatedCrewMember.getEmail());
    existing.setBio(updatedCrewMember.getBio());
    existing.setExperienceYears(updatedCrewMember.getExperienceYears());
    existing.setBasePrice(updatedCrewMember.getBasePrice());
    existing.setLocation(updatedCrewMember.getLocation());
    existing.setLatitude(updatedCrewMember.getLatitude());
    existing.setLongitude(updatedCrewMember.getLongitude());
    existing.setRating(updatedCrewMember.getRating());
    existing.setReliabilityScore(updatedCrewMember.getReliabilityScore());
    existing.setStatus(updatedCrewMember.getStatus());
    existing.setBaseRate(updatedCrewMember.getBaseRate());
    existing.setCancellations(updatedCrewMember.getCancellations());
    existing.setSuccessfulEvents(updatedCrewMember.getSuccessfulEvents());
    existing.setTotalEvents(updatedCrewMember.getTotalEvents());
    existing.setRole(updatedCrewMember.getRole());

    return crewMemberRepository.save(existing);
  }

  public void deleteCrewMember(Long id) {
    CrewMember existing = getCrewMemberById(id);
    crewMemberRepository.delete(existing);
  }
}
