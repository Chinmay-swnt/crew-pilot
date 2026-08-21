"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  ClipboardList,
  UserCheck,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { api } from "@/lib/api";
import CreateEventModal from "@/components/EventForm";

interface Event {
  id: number;
  title?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
}

interface CrewMember {
  id: number;
}

interface Booking {
  id: number;
}

interface Recommendation {
  id: number;
}

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [recommendations, setRecommendations] = useState<
    Recommendation[]
  >([]);

  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const [
          eventsData,
          crewData,
          bookingsData,
        ] = await Promise.all([
          api.getEvents(),
          api.getCrew(),
          api.getBookings(),
        ]);

        setEvents(eventsData as Event[]);
        setCrew(crewData as CrewMember[]);
        setBookings(bookingsData as Booking[]);

        // Recommendations require an event ID.
        // They will be loaded from the recommendation
        // workflow when the user selects an event.
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const recentEvents = events.slice(0, 5);

  return (
    <div className="min-h-full bg-[#f5f3ee]">
      {/* Header */}
      <header className="flex min-h-20 items-center justify-between border-b border-[#d8d4ca] bg-[#f5f3ee] px-6 lg:px-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a6420]">
            Workspace
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#1c1c1c]">
            Dashboard
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateEventOpen(true)}
          className="flex items-center gap-2 bg-[#17212b] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#263746]"
        >
          <Plus size={17} />
          Create event
        </button>
      </header>

      {/* Content */}
      <main className="px-6 py-8 lg:px-8">
        {/* Overview */}
        <section>
          <div className="mb-5">
            <p className="text-sm text-[#6b6962]">
              A current view of your event and crew operations.
            </p>
          </div>

          <div className="grid grid-cols-1 border border-[#d8d4ca] bg-[#eeece5] sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              label="Events"
              value={loading ? "—" : events.length}
              icon={CalendarDays}
            />

            <Metric
              label="Crew members"
              value={loading ? "—" : crew.length}
              icon={Users}
            />

            <Metric
              label="Bookings"
              value={loading ? "—" : bookings.length}
              icon={ClipboardList}
            />

            <Metric
              label="Recommendations"
              value={recommendations.length || "—"}
              icon={UserCheck}
            />
          </div>
        </section>

        {/* Events */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8a6420]">
                Events
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Recent events
              </h2>
            </div>

            <Link
              href="/events"
              className="flex items-center gap-1 text-sm font-medium text-[#495d6b] hover:text-[#1c1c1c]"
            >
              View events
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="border border-[#d8d4ca] bg-[#f8f6f0] p-8 text-sm text-[#6b6962]">
              Loading events...
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="border border-[#d8d4ca] bg-[#f8f6f0] p-8">
              <p className="font-medium">
                No events yet.
              </p>

              <p className="mt-1 text-sm text-[#6b6962]">
                Create your first event to start planning crew.
              </p>

              <button
                type="button"
                onClick={() => setIsCreateEventOpen(true)}
                className="mt-5 border border-[#1c1c1c] px-4 py-2 text-sm font-medium hover:bg-[#1c1c1c] hover:text-white"
              >
                Create event
              </button>
            </div>
          ) : (
            <div className="border border-[#d8d4ca] bg-[#f8f6f0]">
              {recentEvents.map((event, index) => {
                const eventName =
                  event.title ?? event.name ?? `Event ${event.id}`;

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className={[
                      "flex items-center justify-between px-5 py-4 transition-colors hover:bg-[#eeece5]",
                      index !== recentEvents.length - 1
                        ? "border-b border-[#d8d4ca]"
                        : "",
                    ].join(" ")}
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {eventName}
                      </p>

                      {event.startDate && (
                        <p className="mt-1 font-mono text-xs text-[#77736a]">
                          {formatDate(event.startDate)}
                          {event.endDate
                            ? ` — ${formatDate(event.endDate)}`
                            : ""}
                        </p>
                      )}
                    </div>

                    <ArrowUpRight
                      size={16}
                      className="text-[#77736a]"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Recommendation entry point */}
        <section className="mt-10 border border-[#bcb8ae] bg-[#17212b] p-6 text-white lg:p-8">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d9a441]">
              Intelligent planning
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Find the right crew for an event.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              CrewPilot can evaluate event requirements, crew skills,
              availability, bookings, and performance history to produce
              a recommendation.
            </p>

            <Link
              href="/recommendations"
              className="mt-6 inline-flex items-center gap-2 border border-slate-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-white hover:text-[#17212b]"
            >
              Open recommendations
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>
      </main>

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onFindOptimalCrew={(data) => {
          console.log("Event created:", data);
          setIsCreateEventOpen(false);
        }}
      />
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: typeof CalendarDays;
}) {
  return (
    <div className="border-b border-[#d8d4ca] p-5 sm:border-r lg:border-b-0 last:border-r-0">
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

      <p className="mt-6 font-mono text-3xl font-medium tracking-tight">
        {value}
      </p>
    </div>
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