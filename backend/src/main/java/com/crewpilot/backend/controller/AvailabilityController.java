package com.crewpilot.backend.controller;

import com.crewpilot.backend.dto.AvailabilityResponse;
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
  public List<AvailabilityResponse> getAllAvailability() {
    return availabilityService.getAllAvailability()
      .stream()
      .map(this::toResponse)
      .toList();
  }

  @GetMapping("/{id}")
  public AvailabilityResponse getAvailability(
    @PathVariable Long id
  ) {
    return toResponse(
      availabilityService.getAvailabilityById(id)
    );
  }

  @GetMapping("/crew/{crewMemberId}")
  public List<AvailabilityResponse> getCrewAvailability(
    @PathVariable Long crewMemberId
  ) {
    return availabilityService.getCrewAvailability(crewMemberId)
      .stream()
      .map(this::toResponse)
      .toList();
  }

  @GetMapping("/crew/{crewMemberId}/date/{date}")
  public List<AvailabilityResponse> getCrewAvailabilityByDate(
    @PathVariable Long crewMemberId,
    @PathVariable LocalDate date
  ) {
    return availabilityService
      .getCrewAvailabilityByDate(crewMemberId, date)
      .stream()
      .map(this::toResponse)
      .toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public AvailabilityResponse createAvailability(
    @RequestBody Availability availability
  ) {
    return toResponse(
      availabilityService.createAvailability(availability)
    );
  }

  @PutMapping("/{id}")
  public AvailabilityResponse updateAvailability(
    @PathVariable Long id,
    @RequestBody Availability availability
  ) {
    return toResponse(
      availabilityService.updateAvailability(
        id,
        availability
      )
    );
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteAvailability(
    @PathVariable Long id
  ) {
    availabilityService.deleteAvailability(id);
  }

  private AvailabilityResponse toResponse(
    Availability availability
  ) {
    return new AvailabilityResponse(
      availability.getId(),
      availability.getCrewMember() != null
        ? availability.getCrewMember().getId()
        : null,
      availability.getCrewMember() != null
        ? availability.getCrewMember().getName()
        : null,
      availability.getDate(),
      availability.getStartTime(),
      availability.getEndTime(),
      availability.getAvailable()
    );
  }
}
