package com.crewpilot.backend.repository;

import com.crewpilot.backend.entity.Organizer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrganizerRepository extends JpaRepository<Organizer, Long> {

  Optional<Organizer> findByEmail(String email);
}
