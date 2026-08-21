package com.crewpilot.backend.controller;

import com.crewpilot.backend.entity.Event;
import com.crewpilot.backend.entity.EventRequirement;
import com.crewpilot.backend.service.EventService;
import com.crewpilot.backend.service.RequirementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin
public class EventController {

  private final EventService eventService;
  private final RequirementService requirementService;

  // =========================
  // EVENT CRUD
  // =========================

  @GetMapping
  public List<Event> getAllEvents() {
    return eventService.getAllEvents();
  }

  @GetMapping("/{id}")
  public Event getEvent(@PathVariable Long id) {
    return eventService.getEventById(id);
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

  // =========================
  // EVENT REQUIREMENTS
  // =========================

  @GetMapping("/{eventId}/requirements")
  public List<EventRequirement> getRequirements(
    @PathVariable Long eventId
  ) {
    return requirementService.getRequirementsForEvent(eventId);
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
}
