package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.Event;
import com.crewpilot.backend.entity.EventRequirement;
import com.crewpilot.backend.repository.EventRepository;
import com.crewpilot.backend.repository.EventRequirementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RequirementService {

  private final EventRequirementRepository requirementRepository;
  private final EventRepository eventRepository;

  public List<EventRequirement> getRequirementsForEvent(Long eventId) {
    return requirementRepository.findByEventId(eventId);
  }

  public EventRequirement getRequirementById(Long id) {
    return requirementRepository.findById(id)
      .orElseThrow(() ->
        new RuntimeException("Requirement not found: " + id));
  }

  public EventRequirement createRequirement(
    Long eventId,
    EventRequirement requirement
  ) {
    Event event = eventRepository.findById(eventId)
      .orElseThrow(() ->
        new RuntimeException("Event not found: " + eventId));

    requirement.setEvent(event);

    return requirementRepository.save(requirement);
  }

  public EventRequirement updateRequirement(
    Long id,
    EventRequirement updatedRequirement
  ) {
    EventRequirement existing = getRequirementById(id);

    existing.setRole(updatedRequirement.getRole());
    existing.setQuantity(updatedRequirement.getQuantity());
    existing.setRequiredExperience(
      updatedRequirement.getRequiredExperience()
    );

    return requirementRepository.save(existing);
  }

  public void deleteRequirement(Long id) {
    EventRequirement existing = getRequirementById(id);
    requirementRepository.delete(existing);
  }
}
