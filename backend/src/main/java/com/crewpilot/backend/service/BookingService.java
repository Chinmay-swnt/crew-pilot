package com.crewpilot.backend.service;

import com.crewpilot.backend.entity.Booking;
import com.crewpilot.backend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

  private final BookingRepository bookingRepository;

  public List<Booking> getAllBookings() {
    return bookingRepository.findAll();
  }

  public Booking getBookingById(Long id) {
    return bookingRepository.findById(id)
      .orElseThrow(() ->
        new RuntimeException("Booking not found: " + id));
  }

  public List<Booking> getBookingsByEvent(Long eventId) {
    return bookingRepository.findByEventId(eventId);
  }

  public List<Booking> getBookingsByCrewMember(Long crewMemberId) {
    return bookingRepository.findByCrewMemberId(crewMemberId);
  }

  public List<Booking> getBookingsByStatus(String status) {
    return bookingRepository.findByStatus(status);
  }

  public Booking createBooking(Booking booking) {
    return bookingRepository.save(booking);
  }

  public Booking updateBooking(
    Long id,
    Booking updatedBooking
  ) {
    Booking existing = getBookingById(id);

    existing.setEvent(updatedBooking.getEvent());
    existing.setCrewMember(updatedBooking.getCrewMember());
    existing.setRole(updatedBooking.getRole());
    existing.setStatus(updatedBooking.getStatus());
    existing.setAgreedPrice(updatedBooking.getAgreedPrice());
    existing.setBookedAt(updatedBooking.getBookedAt());

    return bookingRepository.save(existing);
  }

  public void deleteBooking(Long id) {
    Booking existing = getBookingById(id);
    bookingRepository.delete(existing);
  }
}
