package com.crewpilot.backend.controller;

import com.crewpilot.backend.entity.Availability;
import com.crewpilot.backend.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
@CrossOrigin
public class AvailabilityController {

  private final AvailabilityService availabilityService;

  @GetMapping
  public List<Availability> getAllAvailability() {
    return availabilityService.getAllAvailability();
  }

  @GetMapping("/{id}")
  public Availability getAvailability(@PathVariable Long id) {
    return availabilityService.getAvailabilityById(id);
  }

  @GetMapping("/crew/{crewMemberId}")
  public List<Availability> getCrewAvailability(
    @PathVariable Long crewMemberId
  ) {
    return availabilityService.getCrewAvailability(crewMemberId);
  }

  @GetMapping("/crew/{crewMemberId}/date/{date}")
  public List<Availability> getCrewAvailabilityByDate(
    @PathVariable Long crewMemberId,
    @PathVariable LocalDate date
  ) {
    return availabilityService.getCrewAvailabilityByDate(
      crewMemberId,
      date
    );
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Availability createAvailability(
    @RequestBody Availability availability
  ) {
    return availabilityService.createAvailability(availability);
  }

  @PutMapping("/{id}")
  public Availability updateAvailability(
    @PathVariable Long id,
    @RequestBody Availability availability
  ) {
    return availabilityService.updateAvailability(
      id,
      availability
    );
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteAvailability(@PathVariable Long id) {
    availabilityService.deleteAvailability(id);
  }
}
