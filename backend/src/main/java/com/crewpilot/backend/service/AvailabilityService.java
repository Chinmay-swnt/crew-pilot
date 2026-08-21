package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.Availability;
import com.crewpilot.backend.repository.AvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

  private final AvailabilityRepository availabilityRepository;

  public List<Availability> getAllAvailability() {
    return availabilityRepository.findAll();
  }

  public Availability getAvailabilityById(Long id) {
    return availabilityRepository.findById(id)
      .orElseThrow(() ->
        new RuntimeException("Availability not found: " + id));
  }

  public List<Availability> getCrewAvailability(Long crewMemberId) {
    return availabilityRepository.findByCrewMemberId(crewMemberId);
  }

  public List<Availability> getCrewAvailabilityByDate(
    Long crewMemberId,
    LocalDate date
  ) {
    return availabilityRepository.findByCrewMemberIdAndDate(
      crewMemberId,
      date
    );
  }

  public Availability createAvailability(Availability availability) {
    return availabilityRepository.save(availability);
  }

  public Availability updateAvailability(
    Long id,
    Availability updatedAvailability
  ) {
    Availability existing = getAvailabilityById(id);

    existing.setCrewMember(updatedAvailability.getCrewMember());
    existing.setDate(updatedAvailability.getDate());
    existing.setStartTime(updatedAvailability.getStartTime());
    existing.setEndTime(updatedAvailability.getEndTime());
    existing.setAvailable(updatedAvailability.getAvailable());

    return availabilityRepository.save(existing);
  }

  public void deleteAvailability(Long id) {
    Availability existing = getAvailabilityById(id);
    availabilityRepository.delete(existing);
  }
}
