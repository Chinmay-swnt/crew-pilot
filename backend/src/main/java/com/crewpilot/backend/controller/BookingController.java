package com.crewpilot.backend.controller;

import com.crewpilot.backend.dto.BookingResponse;
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
  public List<BookingResponse> getAllBookings() {
    return bookingService.getAllBookings()
      .stream()
      .map(this::toResponse)
      .toList();
  }

  @GetMapping("/{id}")
  public BookingResponse getBooking(
    @PathVariable Long id
  ) {
    return toResponse(
      bookingService.getBookingById(id)
    );
  }

  @GetMapping("/event/{eventId}")
  public List<BookingResponse> getBookingsByEvent(
    @PathVariable Long eventId
  ) {
    return bookingService.getBookingsByEvent(eventId)
      .stream()
      .map(this::toResponse)
      .toList();
  }

  @GetMapping("/crew/{crewMemberId}")
  public List<BookingResponse> getBookingsByCrewMember(
    @PathVariable Long crewMemberId
  ) {
    return bookingService.getBookingsByCrewMember(crewMemberId)
      .stream()
      .map(this::toResponse)
      .toList();
  }

  @GetMapping("/status/{status}")
  public List<BookingResponse> getBookingsByStatus(
    @PathVariable String status
  ) {
    return bookingService.getBookingsByStatus(status)
      .stream()
      .map(this::toResponse)
      .toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public BookingResponse createBooking(
    @RequestBody Booking booking
  ) {
    return toResponse(
      bookingService.createBooking(booking)
    );
  }

  @PutMapping("/{id}")
  public BookingResponse updateBooking(
    @PathVariable Long id,
    @RequestBody Booking booking
  ) {
    return toResponse(
      bookingService.updateBooking(id, booking)
    );
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteBooking(
    @PathVariable Long id
  ) {
    bookingService.deleteBooking(id);
  }

  private BookingResponse toResponse(Booking booking) {
    return new BookingResponse(
      booking.getId(),
      booking.getEvent() != null
        ? booking.getEvent().getId()
        : null,
      booking.getCrewMember() != null
        ? booking.getCrewMember().getId()
        : null,
      booking.getCrewMember() != null
        ? booking.getCrewMember().getName()
        : null,
      booking.getRole() != null
        ? booking.getRole().getId()
        : null,
      booking.getRole() != null
        ? booking.getRole().getName()
        : null,
      booking.getStatus(),
      booking.getAgreedPrice(),
      booking.getVersion(),
      booking.getBookedAt()
    );
  }
}
