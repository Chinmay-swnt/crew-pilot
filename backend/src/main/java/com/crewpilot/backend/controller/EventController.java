package com.crewpilot.backend.controller;

import com.crewpilot.backend.dto.EventResponse;
import com.crewpilot.backend.entity.Event;
import com.crewpilot.backend.entity.EventRequirement;
import com.crewpilot.backend.service.EventService;
import com.crewpilot.backend.service.RequirementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.crewpilot.backend.dto.EventRequirementResponse;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin
public class EventController {

  private final EventService eventService;
  private final RequirementService requirementService;

  @GetMapping
  public List<EventResponse> getAllEvents() {
    return eventService.getAllEvents()
      .stream()
      .map(this::toResponse)
      .toList();
  }

  @GetMapping("/{id}")
  public EventResponse getEvent(@PathVariable Long id) {
    return toResponse(
      eventService.getEventById(id)
    );
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Event createEvent(@RequestBody Event event) {
    return eventService.createEvent(event);
  }

  @PutMapping("/{id}")
  public Event updateEvent(
    @PathVariable Long id,
    @RequestBody Event event
  ) {
    return eventService.updateEvent(id, event);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteEvent(@PathVariable Long id) {
    eventService.deleteEvent(id);
  }

  @GetMapping("/{eventId}/requirements")
  public List<EventRequirementResponse> getRequirements(
    @PathVariable Long eventId
  ) {
    return requirementService.getRequirementsForEvent(eventId)
      .stream()
      .map(this::toRequirementResponse)
      .toList();
  }

  @PostMapping("/{eventId}/requirements")
  @ResponseStatus(HttpStatus.CREATED)
  public EventRequirement createRequirement(
    @PathVariable Long eventId,
    @RequestBody EventRequirement requirement
  ) {
    return requirementService.createRequirement(
      eventId,
      requirement
    );
  }

  @PutMapping("/{eventId}/requirements/{requirementId}")
  public EventRequirement updateRequirement(
    @PathVariable Long eventId,
    @PathVariable Long requirementId,
    @RequestBody EventRequirement requirement
  ) {
    return requirementService.updateRequirement(
      requirementId,
      requirement
    );
  }

  @DeleteMapping("/{eventId}/requirements/{requirementId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteRequirement(
    @PathVariable Long eventId,
    @PathVariable Long requirementId
  ) {
    requirementService.deleteRequirement(requirementId);
  }

  private EventResponse toResponse(Event event) {
    return new EventResponse(
      event.getId(),
      event.getOrganizer() != null
        ? event.getOrganizer().getId()
        : null,
      event.getName(),
      event.getEventType(),
      event.getDescription(),
      event.getDate(),
      event.getStartTime(),
      event.getEndTime(),
      event.getLocation(),
      event.getLatitude(),
      event.getLongitude(),
      event.getGuestCount(),
      event.getBudget(),
      event.getStatus(),
      event.getVersion(),
      event.getCreatedAt(),
      event.getUpdatedAt()
    );
  }

  private EventRequirementResponse toRequirementResponse(
    EventRequirement requirement
  ) {
    return new EventRequirementResponse(
      requirement.getId(),
      requirement.getEvent() != null
        ? requirement.getEvent().getId()
        : null,
      requirement.getRole() != null
        ? requirement.getRole().getId()
        : null,
      requirement.getRole() != null
        ? requirement.getRole().getName()
        : null,
      requirement.getQuantity(),
      requirement.getRequiredExperience(),
      requirement.getRequiredSkills()
        .stream()
        .map(skill -> skill.getSkill().getId())
        .toList()
    );
  }
}


