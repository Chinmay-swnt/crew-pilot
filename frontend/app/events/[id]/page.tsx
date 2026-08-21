"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";

interface Event {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  status?: string;
}

interface EventRequirement {
  id: number;
  role?: string;
  roleName?: string;
  quantity?: number;
  description?: string;
  requiredCount?: number;
}

interface Booking {
  id: number;
  status?: string;
  crewMember?: {
    id?: number;
    name?: string;
  };
}

interface Recommendation {
  id: number;
  score?: number;
  status?: string;
  crewMember?: {
    id?: number;
    name?: string;
  };
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Number(params.id);

  const [event, setEvent] = useState<Event | null>(null);
  const [requirements, setRequirements] = useState<EventRequirement[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [recommendations, setRecommendations] = useState<
    Recommendation[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadEvent() {
    if (!Number.isFinite(eventId)) {
      setError("Invalid event ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [
        eventData,
        requirementData,
        bookingData,
        recommendationData,
      ] = await Promise.all([
        api.getEvent(eventId),
        api.getEventRequirements(eventId),
        api.getBookingsByEvent(eventId),
        api.getRecommendations(eventId),
      ]);

      setEvent(eventData as Event);
      setRequirements(requirementData as EventRequirement[]);
      setBookings(bookingData as Booking[]);
      setRecommendations(
        recommendationData as Recommendation[]
      );
    } catch (err) {
      console.error("Failed to load event:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load event."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  async function handleGenerateRecommendations() {
    try {
      setGenerating(true);
      setError(null);

      const data =
        await api.generateRecommendations(eventId);

      setRecommendations(data as Recommendation[]);
    } catch (err) {
      console.error(
        "Failed to generate recommendations:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate recommendations."
      );
    } finally {
      setGenerating(false);
    }
  }

  async function handleDeleteEvent() {
    const confirmed = window.confirm(
      "Delete this event? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);

      await api.deleteEvent(eventId);

      router.push("/events");
    } catch (err) {
      console.error("Failed to delete event:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete event."
      );

      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#f5f3ee]">
        <div className="flex items-center gap-3 text-sm text-[#6b6962]">
          <Loader2 size={17} className="animate-spin" />
          Loading event...
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-full bg-[#f5f3ee] px-6 py-8 lg:px-8">
        <Link
          href="/events"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#5d5b55] hover:text-[#1c1c1c]"
        >
          <ArrowLeft size={16} />
          Back to events
        </Link>

        <div className="border border-[#c9a6a0] bg-[#f5e9e6] p-6">
          <p className="font-medium text-[#6d332b]">
            Could not load event
          </p>

          <p className="mt-2 text-sm text-[#7d514a]">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const eventName =
    event.title ??
    event.name ??
    `Event ${event.id}`;

  return (
    <div className="min-h-full bg-[#f5f3ee]">
      {/* Header */}
      <header className="border-b border-[#d8d4ca] px-6 py-5 lg:px-8">
        <Link
          href="/events"
          className="mb-5 inline-flex items-center gap-2 text-sm text-[#6b6962] hover:text-[#1c1c1c]"
        >
          <ArrowLeft size={16} />
          Back to events
        </Link>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a6420]">
              Event
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {eventName}
            </h1>

            {event.description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b6962]">
                {event.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/events/${eventId}/edit`}
              className="border border-[#bcb8ae] px-4 py-2 text-sm font-medium hover:border-[#1c1c1c]"
            >
              Edit event
            </Link>

            <button
              type="button"
              onClick={handleDeleteEvent}
              disabled={deleting}
              className="flex items-center gap-2 border border-[#c9a6a0] px-4 py-2 text-sm font-medium text-[#6d332b] hover:bg-[#6d332b] hover:text-white disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Trash2 size={15} />
              )}
              Delete
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 py-8 lg:px-8">
        {error && (
          <div className="mb-6 border border-[#c9a6a0] bg-[#f5e9e6] p-4 text-sm text-[#6d332b]">
            {error}
          </div>
        )}

        {/* Event information */}
        <section className="grid grid-cols-1 border border-[#d8d4ca] bg-[#f8f6f0] md:grid-cols-3">
          <InfoBlock
            icon={CalendarDays}
            label="Schedule"
            value={formatSchedule(
              event.startDate,
              event.endDate
            )}
          />

          <InfoBlock
            icon={Users}
            label="Bookings"
            value={String(bookings.length)}
          />

          <InfoBlock
            icon={Check}
            label="Status"
            value={event.status ?? "Not specified"}
          />
        </section>

        {event.location && (
          <div className="mt-4 border border-[#d8d4ca] bg-[#f8f6f0] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#77736a]">
              Location
            </p>

            <p className="mt-1 text-sm font-medium">
              {event.location}
            </p>
          </div>
        )}

        {/* Requirements */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8a6420]">
                Staffing
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Requirements
              </h2>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 border border-[#bcb8ae] px-3 py-2 text-sm font-medium hover:border-[#1c1c1c]"
            >
              <Plus size={15} />
              Add requirement
            </button>
          </div>

          {requirements.length === 0 ? (
            <div className="border border-[#d8d4ca] bg-[#f8f6f0] p-6">
              <p className="font-medium">
                No requirements defined.
              </p>

              <p className="mt-1 text-sm text-[#6b6962]">
                Add staffing requirements before generating crew
                recommendations.
              </p>
            </div>
          ) : (
            <div className="border border-[#d8d4ca] bg-[#f8f6f0]">
              {requirements.map((requirement, index) => (
                <div
                  key={requirement.id}
                  className={[
                    "flex items-center justify-between gap-6 px-5 py-4",
                    index !== requirements.length - 1
                      ? "border-b border-[#d8d4ca]"
                      : "",
                  ].join(" ")}
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {requirement.roleName ??
                        requirement.role ??
                        `Requirement ${requirement.id}`}
                    </p>

                    {requirement.description && (
                      <p className="mt-1 text-xs text-[#6b6962]">
                        {requirement.description}
                      </p>
                    )}
                  </div>

                  <span className="font-mono text-sm">
                    {requirement.quantity ??
                      requirement.requiredCount ??
                      "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommendations */}
        <section className="mt-10 border border-[#bcb8ae] bg-[#17212b] p-6 text-white lg:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d9a441]">
                Crew intelligence
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Recommended crew
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Generate crew recommendations using the event's
                staffing requirements and available crew data.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateRecommendations}
              disabled={generating}
              className="flex shrink-0 items-center justify-center gap-2 border border-slate-500 px-5 py-2.5 text-sm font-medium hover:bg-white hover:text-[#17212b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}

              {generating
                ? "Generating..."
                : "Generate recommendations"}
            </button>
          </div>

          {recommendations.length > 0 && (
            <div className="mt-7 border-t border-slate-700 pt-5">
              <div className="space-y-2">
                {recommendations.map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className="flex items-center justify-between border border-slate-700 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {recommendation.crewMember?.name ??
                          `Crew member ${
                            recommendation.crewMember?.id ??
                            recommendation.id
                          }`}
                      </p>

                      {recommendation.status && (
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400">
                          {recommendation.status}
                        </p>
                      )}
                    </div>

                    {recommendation.score !== undefined && (
                      <span className="font-mono text-sm text-[#d9a441]">
                        {recommendation.score}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendations.length === 0 && (
            <p className="mt-6 border-t border-slate-700 pt-5 text-sm text-slate-400">
              No recommendations have been generated for this event.
            </p>
          )}
        </section>

        {/* Bookings */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8a6420]">
                Assignments
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Bookings
              </h2>
            </div>

            <Link
              href={`/bookings?eventId=${eventId}`}
              className="flex items-center gap-1 text-sm font-medium text-[#495d6b] hover:text-[#1c1c1c]"
            >
              View bookings
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="border border-[#d8d4ca] bg-[#f8f6f0] p-6">
              <p className="text-sm text-[#6b6962]">
                No bookings for this event.
              </p>
            </div>
          ) : (
            <div className="border border-[#d8d4ca] bg-[#f8f6f0]">
              {bookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className={[
                    "flex items-center justify-between px-5 py-4",
                    index !== bookings.length - 1
                      ? "border-b border-[#d8d4ca]"
                      : "",
                  ].join(" ")}
                >
                  <p className="text-sm font-medium">
                    {booking.crewMember?.name ??
                      `Crew member ${
                        booking.crewMember?.id ??
                        booking.id
                      }`}
                  </p>

                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#77736a]">
                    {booking.status ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-[#d8d4ca] p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#6b6962]">
          {label}
        </span>

        <Icon
          size={17}
          strokeWidth={1.7}
          className="text-[#77736a]"
        />
      </div>

      <p className="mt-5 text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

function formatSchedule(
  startDate?: string,
  endDate?: string
) {
  if (!startDate) {
    return "Not specified";
  }

  const start = formatDate(startDate);

  if (!endDate) {
    return start;
  }

  return `${start} — ${formatDate(endDate)}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}