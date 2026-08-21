package com.crewpilot.backend.controller;

import com.crewpilot.backend.entity.Booking;
import com.crewpilot.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin
public class BookingController {

  private final BookingService bookingService;

  @GetMapping
  public List<Booking> getAllBookings() {
    return bookingService.getAllBookings();
  }

  @GetMapping("/{id}")
  public Booking getBooking(@PathVariable Long id) {
    return bookingService.getBookingById(id);
  }

  @GetMapping("/event/{eventId}")
  public List<Booking> getBookingsByEvent(
    @PathVariable Long eventId
  ) {
    return bookingService.getBookingsByEvent(eventId);
  }

  @GetMapping("/crew/{crewMemberId}")
  public List<Booking> getBookingsByCrewMember(
    @PathVariable Long crewMemberId
  ) {
    return bookingService.getBookingsByCrewMember(crewMemberId);
  }

  @GetMapping("/status/{status}")
  public List<Booking> getBookingsByStatus(
    @PathVariable String status
  ) {
    return bookingService.getBookingsByStatus(status);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Booking createBooking(
    @RequestBody Booking booking
  ) {
    return bookingService.createBooking(booking);
  }

  @PutMapping("/{id}")
  public Booking updateBooking(
    @PathVariable Long id,
    @RequestBody Booking booking
  ) {
    return bookingService.updateBooking(id, booking);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteBooking(@PathVariable Long id) {
    bookingService.deleteBooking(id);
  }
}
