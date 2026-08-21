package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.Event;
import com.crewpilot.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

  private final EventRepository eventRepository;

  public List<Event> getAllEvents() {
    return eventRepository.findAll();
  }

  public Event getEventById(Long id) {
    return eventRepository.findById(id)
      .orElseThrow(() ->
        new RuntimeException("Event not found: " + id));
  }

  public Event createEvent(Event event) {
    return eventRepository.save(event);
  }

  public Event updateEvent(Long id, Event updatedEvent) {

    Event existing = getEventById(id);

    existing.setOrganizer(updatedEvent.getOrganizer());
    existing.setName(updatedEvent.getName());
    existing.setEventType(updatedEvent.getEventType());
    existing.setDescription(updatedEvent.getDescription());
    existing.setDate(updatedEvent.getDate());
    existing.setStartTime(updatedEvent.getStartTime());
    existing.setEndTime(updatedEvent.getEndTime());
    existing.setLocation(updatedEvent.getLocation());
    existing.setLatitude(updatedEvent.getLatitude());
    existing.setLongitude(updatedEvent.getLongitude());
    existing.setGuestCount(updatedEvent.getGuestCount());
    existing.setBudget(updatedEvent.getBudget());
    existing.setStatus(updatedEvent.getStatus());

    return eventRepository.save(existing);
  }

  public void deleteEvent(Long id) {
    Event existing = getEventById(id);
    eventRepository.delete(existing);
  }
}
