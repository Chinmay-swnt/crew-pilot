package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.Organizer;
import com.crewpilot.backend.repository.OrganizerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizerService {

  private final OrganizerRepository organizerRepository;

  public List<Organizer> getAllOrganizers() {
    return organizerRepository.findAll();
  }

  public Organizer getOrganizerById(Long id) {
    return organizerRepository.findById(id)
      .orElseThrow(() ->
        new RuntimeException("Organizer not found: " + id));
  }

  public Organizer createOrganizer(Organizer organizer) {
    return organizerRepository.save(organizer);
  }

  public Organizer updateOrganizer(
    Long id,
    Organizer updatedOrganizer
  ) {
    Organizer existing = getOrganizerById(id);

    existing.setName(updatedOrganizer.getName());
    existing.setEmail(updatedOrganizer.getEmail());

    return organizerRepository.save(existing);
  }

  public void deleteOrganizer(Long id) {
    Organizer existing = getOrganizerById(id);
    organizerRepository.delete(existing);
  }
}
