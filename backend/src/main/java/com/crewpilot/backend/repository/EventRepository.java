package com.crewpilot.backend.repository;

import com.crewpilot.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

  List<Event> findByOrganizerId(Long organizerId);

  List<Event> findByEventTypeIgnoreCase(String eventType);

  List<Event> findByDate(LocalDate date);

  List<Event> findByStatus(String status);
}
