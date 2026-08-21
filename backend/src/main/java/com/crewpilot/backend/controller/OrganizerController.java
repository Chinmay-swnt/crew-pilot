package com.crewpilot.backend.controller;

import com.crewpilot.backend.entity.Organizer;
import com.crewpilot.backend.service.OrganizerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizers")
@RequiredArgsConstructor
@CrossOrigin
public class OrganizerController {

  private final OrganizerService organizerService;

  @GetMapping
  public List<Organizer> getAllOrganizers() {
    return organizerService.getAllOrganizers();
  }

  @GetMapping("/{id}")
  public Organizer getOrganizer(@PathVariable Long id) {
    return organizerService.getOrganizerById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Organizer createOrganizer(
    @RequestBody Organizer organizer
  ) {
    return organizerService.createOrganizer(organizer);
  }

  @PutMapping("/{id}")
  public Organizer updateOrganizer(
    @PathVariable Long id,
    @RequestBody Organizer organizer
  ) {
    return organizerService.updateOrganizer(id, organizer);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteOrganizer(@PathVariable Long id) {
    organizerService.deleteOrganizer(id);
  }
}
