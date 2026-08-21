const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || `Request failed with status ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  // Events
  getEvents: () =>
    request("/api/events"),

  getEvent: (eventId: number) =>
    request(`/api/events/${eventId}`),

  createEvent: (event: unknown) =>
    request("/api/events", {
      method: "POST",
      body: JSON.stringify(event),
    }),

  updateEvent: (
    eventId: number,
    event: unknown
  ) =>
    request(`/api/events/${eventId}`, {
      method: "PUT",
      body: JSON.stringify(event),
    }),

  deleteEvent: (eventId: number) =>
    request(`/api/events/${eventId}`, {
      method: "DELETE",
    }),

  // Event Requirements
  getEventRequirements: (eventId: number) =>
    request(`/api/events/${eventId}/requirements`),

  createEventRequirement: (
    eventId: number,
    requirement: unknown
  ) =>
    request(`/api/events/${eventId}/requirements`, {
      method: "POST",
      body: JSON.stringify(requirement),
    }),

  updateEventRequirement: (
    eventId: number,
    requirementId: number,
    requirement: unknown
  ) =>
    request(
      `/api/events/${eventId}/requirements/${requirementId}`,
      {
        method: "PUT",
        body: JSON.stringify(requirement),
      }
    ),

  deleteEventRequirement: (
    eventId: number,
    requirementId: number
  ) =>
    request(
      `/api/events/${eventId}/requirements/${requirementId}`,
      {
        method: "DELETE",
      }
    ),

  // Crew
  getCrew: () =>
    request("/api/crew"),

  getCrewMember: (crewMemberId: number) =>
    request(`/api/crew/${crewMemberId}`),

  createCrewMember: (crewMember: unknown) =>
    request("/api/crew", {
      method: "POST",
      body: JSON.stringify(crewMember),
    }),

  updateCrewMember: (
    crewMemberId: number,
    crewMember: unknown
  ) =>
    request(`/api/crew/${crewMemberId}`, {
      method: "PUT",
      body: JSON.stringify(crewMember),
    }),

  deleteCrewMember: (crewMemberId: number) =>
    request(`/api/crew/${crewMemberId}`, {
      method: "DELETE",
    }),

  // Bookings
  getBookings: () =>
    request("/api/bookings"),

  getBooking: (bookingId: number) =>
    request(`/api/bookings/${bookingId}`),

  getBookingsByEvent: (eventId: number) =>
    request(`/api/bookings/event/${eventId}`),

  getBookingsByCrewMember: (crewMemberId: number) =>
    request(`/api/bookings/crew/${crewMemberId}`),

  getBookingsByStatus: (status: string) =>
    request(`/api/bookings/status/${status}`),

  createBooking: (booking: unknown) =>
    request("/api/bookings", {
      method: "POST",
      body: JSON.stringify(booking),
    }),

  updateBooking: (
    bookingId: number,
    booking: unknown
  ) =>
    request(`/api/bookings/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify(booking),
    }),

  deleteBooking: (bookingId: number) =>
    request(`/api/bookings/${bookingId}`, {
      method: "DELETE",
    }),

  // Recommendations
  getRecommendations: (eventId: number) =>
    request(`/api/recommendations/event/${eventId}`),

  generateRecommendations: (eventId: number) =>
    request(`/api/recommendations/event/${eventId}/generate`, {
      method: "POST",
    }),
};