"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Plus,
  RefreshCw,
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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadEvents() {
    try {
      setLoading(true);
      setError(null);

      const data = await api.getEvents();

      setEvents(data as Event[]);
    } catch (err) {
      console.error("Failed to load events:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load events."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="min-h-full bg-[#f5f3ee]">
      {/* Header */}
      <header className="flex min-h-20 items-center justify-between border-b border-[#d8d4ca] px-6 lg:px-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a6420]">
            Operations
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight">
            Events
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadEvents}
            disabled={loading}
            className="flex items-center gap-2 border border-[#bcb8ae] px-3 py-2 text-sm font-medium transition-colors hover:border-[#1c1c1c] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <Link
            href="/events/create"
            className="flex items-center gap-2 bg-[#17212b] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#263746]"
          >
            <Plus size={17} />
            Create event
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-8 lg:px-8">
        <div className="mb-7 max-w-2xl">
          <p className="text-sm leading-6 text-[#6b6962]">
            Manage events, requirements, and staffing needs from one
            workspace.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="border border-[#d8d4ca] bg-[#f8f6f0] p-8">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#77736a]">
              Loading events...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="border border-[#c9a6a0] bg-[#f5e9e6] p-6">
            <p className="font-medium text-[#6d332b]">
              Could not load events
            </p>

            <p className="mt-2 text-sm text-[#7d514a]">
              {error}
            </p>

            <button
              type="button"
              onClick={loadEvents}
              className="mt-4 border border-[#6d332b] px-4 py-2 text-sm font-medium text-[#6d332b] hover:bg-[#6d332b] hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && events.length === 0 && (
          <div className="border border-[#d8d4ca] bg-[#f8f6f0] p-10">
            <div className="flex h-10 w-10 items-center justify-center bg-[#17212b] text-[#d9a441]">
              <CalendarDays size={19} />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              No events yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#6b6962]">
              Create an event to define its staffing requirements and
              start building the crew plan.
            </p>

            <Link
              href="/events/create"
              className="mt-6 inline-flex items-center gap-2 bg-[#17212b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#263746]"
            >
              <Plus size={16} />
              Create event
            </Link>
          </div>
        )}

        {/* Event list */}
        {!loading && !error && events.length > 0 && (
          <section className="border border-[#d8d4ca] bg-[#f8f6f0]">
            <div className="grid grid-cols-[1fr_auto_auto] gap-6 border-b border-[#d8d4ca] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#77736a]">
              <span>Event</span>
              <span>Status</span>
              <span />
            </div>

            {events.map((event, index) => {
              const eventName =
                event.title ??
                event.name ??
                `Event ${event.id}`;

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className={[
                    "grid grid-cols-[1fr_auto_auto] items-center gap-6 px-5 py-5 transition-colors hover:bg-[#eeece5]",
                    index !== events.length - 1
                      ? "border-b border-[#d8d4ca]"
                      : "",
                  ].join(" ")}
                >
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold">
                      {eventName}
                    </h2>

                    {event.description && (
                      <p className="mt-1 max-w-2xl truncate text-xs text-[#6b6962]">
                        {event.description}
                      </p>
                    )}

                    {(event.startDate || event.location) && (
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-[#77736a]">
                        {event.startDate && (
                          <span>
                            {formatDate(event.startDate)}
                            {event.endDate
                              ? ` — ${formatDate(event.endDate)}`
                              : ""}
                          </span>
                        )}

                        {event.location && (
                          <span>{event.location}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <StatusLabel status={event.status} />

                  <ArrowUpRight
                    size={16}
                    className="text-[#77736a]"
                  />
                </Link>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

function StatusLabel({ status }: { status?: string }) {
  if (!status) {
    return (
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#77736a]">
        —
      </span>
    );
  }

  return (
    <span className="border border-[#c9c5bb] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#5f5c55]">
      {status}
    </span>
  );
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