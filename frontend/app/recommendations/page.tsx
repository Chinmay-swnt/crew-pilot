"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Sparkles,
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

interface RecommendedCrew {
  id: number;
  priority?: string;
  individualScore?: number;
  predictedReliability?: number;
  estimatedCost?: number;
  crewMember?: {
    id: number;
    name?: string;
    firstName?: string;
    lastName?: string;
  };
  role?: {
    id: number;
    name?: string;
    title?: string;
  };
}

interface Recommendation {
  id: number;
  overallScore?: number;
  totalCost?: number;
  predictedReliability?: number;
  generatedAt?: string;
  recommendedCrew?: RecommendedCrew[];
}

export default function RecommendationsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<
    Recommendation[]
  >([]);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] =
    useState(false);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId !== null) {
      loadRecommendations(selectedEventId);
    }
  }, [selectedEventId]);

  async function loadEvents() {
    try {
      setLoadingEvents(true);
      setError(null);

      const data = (await api.getEvents()) as Event[];

      setEvents(data);

      if (data.length > 0) {
        setSelectedEventId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load events:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load events."
      );
    } finally {
      setLoadingEvents(false);
    }
  }

  async function loadRecommendations(eventId: number) {
    try {
      setLoadingRecommendations(true);
      setError(null);

      const data = (await api.getRecommendations(
        eventId
      )) as Recommendation[];

      setRecommendations(data);
    } catch (err) {
      console.error("Failed to load recommendations:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load recommendations."
      );
    } finally {
      setLoadingRecommendations(false);
    }
  }

  async function generateRecommendations() {
    if (selectedEventId === null) return;

    try {
      setGenerating(true);
      setError(null);

      const data = (await api.generateRecommendations(
        selectedEventId
      )) as Recommendation[];

      setRecommendations(data);
    } catch (err) {
      console.error("Failed to generate recommendations:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate recommendations."
      );
    } finally {
      setGenerating(false);
    }
  }

  const selectedEvent = events.find(
    (event) => event.id === selectedEventId
  );

  const latestRecommendation =
    recommendations.length > 0
      ? recommendations[recommendations.length - 1]
      : null;

  const recommendedCrew =
    latestRecommendation?.recommendedCrew ?? [];

  return (
    <div className="min-h-full bg-[#f5f3ee]">
      {/* Header */}
      <header className="flex min-h-20 items-center justify-between border-b border-[#d8d4ca] px-6 lg:px-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a6420]">
            Staffing intelligence
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight">
            Recommendations
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (selectedEventId !== null) {
                loadRecommendations(selectedEventId);
              }
            }}
            disabled={
              selectedEventId === null ||
              loadingRecommendations ||
              generating
            }
            className="flex items-center gap-2 border border-[#bcb8ae] px-3 py-2 text-sm font-medium transition-colors hover:border-[#17212b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={
                loadingRecommendations ? "animate-spin" : ""
              }
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={generateRecommendations}
            disabled={
              selectedEventId === null ||
              generating ||
              loadingRecommendations
            }
            className="flex items-center gap-2 bg-[#17212b] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#293b49] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles
              size={16}
              className={generating ? "animate-pulse" : ""}
            />

            {generating
              ? "Generating..."
              : "Generate recommendations"}
          </button>
        </div>
      </header>

      <main className="px-6 py-8 lg:px-8">
        {/* Event selector */}
        <section className="border border-[#d8d4ca] bg-[#eeece5]">
          <div className="flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#77736a]">
                Event
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Select an event
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-[#6b6962]">
                Recommendations are generated against the requirements
                attached to the selected event.
              </p>
            </div>

            <div className="w-full lg:w-80">
              {loadingEvents ? (
                <div className="border border-[#cfcac0] bg-[#f8f6f0] px-4 py-3 text-sm text-[#77736a]">
                  Loading events...
                </div>
              ) : events.length === 0 ? (
                <Link
                  href="/events/create"
                  className="flex items-center justify-between border border-[#cfcac0] bg-[#f8f6f0] px-4 py-3 text-sm font-medium hover:border-[#17212b]"
                >
                  Create your first event
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <select
                  value={selectedEventId ?? ""}
                  onChange={(event) =>
                    setSelectedEventId(
                      Number(event.target.value)
                    )
                  }
                  className="w-full border border-[#cfcac0] bg-[#f8f6f0] px-4 py-3 text-sm outline-none focus:border-[#17212b]"
                >
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title ??
                        event.name ??
                        `Event ${event.id}`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {selectedEvent && (
            <div className="border-t border-[#d8d4ca] px-6 py-4">
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[#77736a]">
                {selectedEvent.startDate && (
                  <span>
                    {formatDate(selectedEvent.startDate)}
                  </span>
                )}

                {selectedEvent.location && (
                  <span>{selectedEvent.location}</span>
                )}

                {selectedEvent.status && (
                  <span>{selectedEvent.status}</span>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Error */}
        {error && (
          <div className="mt-6 border border-[#c9a6a0] bg-[#f5e9e6] p-5">
            <p className="font-medium text-[#6d332b]">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-[#7d514a]">
              {error}
            </p>
          </div>
        )}

        {/* Loading */}
        {loadingRecommendations && (
          <div className="mt-6 border border-[#d8d4ca] bg-[#f8f6f0] p-8">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#77736a]">
              Loading recommendations...
            </p>
          </div>
        )}

        {/* No recommendations */}
        {!loadingRecommendations &&
          selectedEvent &&
          recommendations.length === 0 && (
            <section className="mt-6 border border-[#d8d4ca] bg-[#f8f6f0] p-10">
              <div className="flex h-10 w-10 items-center justify-center bg-[#17212b] text-[#d9a441]">
                <Sparkles size={18} />
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                No recommendations yet
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#6b6962]">
                Generate recommendations for this event after its
                staffing requirements have been created.
              </p>

              <button
                type="button"
                onClick={generateRecommendations}
                disabled={generating}
                className="mt-6 inline-flex items-center gap-2 bg-[#17212b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#293b49] disabled:opacity-50"
              >
                <Sparkles size={16} />
                {generating
                  ? "Generating..."
                  : "Generate recommendations"}
              </button>
            </section>
          )}

        {/* Recommendation */}
        {!loadingRecommendations &&
          latestRecommendation && (
            <section className="mt-6">
              {/* Summary */}
              <div className="grid grid-cols-1 gap-px border border-[#d8d4ca] bg-[#d8d4ca] sm:grid-cols-2 lg:grid-cols-4">
                <Metric
                  label="Overall score"
                  value={formatNumber(
                    latestRecommendation.overallScore
                  )}
                />

                <Metric
                  label="Predicted reliability"
                  value={formatNumber(
                    latestRecommendation.predictedReliability
                  )}
                />

                <Metric
                  label="Estimated total cost"
                  value={formatCurrency(
                    latestRecommendation.totalCost
                  )}
                />

                <Metric
                  label="Generated"
                  value={
                    latestRecommendation.generatedAt
                      ? formatDateTime(
                          latestRecommendation.generatedAt
                        )
                      : "—"
                  }
                />
              </div>

              {/* Crew */}
              <div className="mt-6 border border-[#d8d4ca] bg-[#f8f6f0]">
                <div className="flex items-center justify-between border-b border-[#d8d4ca] px-5 py-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#77736a]">
                      Recommended crew
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                      Candidate matches
                    </h2>
                  </div>

                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#77736a]">
                    <Users size={14} />
                    {recommendedCrew.length}
                  </span>
                </div>

                {recommendedCrew.length === 0 ? (
                  <div className="px-5 py-10">
                    <p className="text-sm font-medium">
                      No crew candidates have been attached yet.
                    </p>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#6b6962]">
                      The current Spring Boot recommendation engine
                      creates the recommendation record, but it does
                      not yet populate the recommended crew list.
                    </p>
                  </div>
                ) : (
                  <div>
                    {recommendedCrew.map(
                      (candidate, index) => (
                        <CrewRow
                          key={candidate.id}
                          candidate={candidate}
                          last={
                            index ===
                            recommendedCrew.length - 1
                          }
                        />
                      )
                    )}
                  </div>
                )}
              </div>
            </section>
          )}
      </main>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#f8f6f0] px-5 py-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#77736a]">
        {label}
      </p>

      <p className="mt-3 text-xl font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}

function CrewRow({
  candidate,
  last,
}: {
  candidate: RecommendedCrew;
  last: boolean;
}) {
  const crewName =
    candidate.crewMember?.name ??
    [
      candidate.crewMember?.firstName,
      candidate.crewMember?.lastName,
    ]
      .filter(Boolean)
      .join(" ") ??
    `Crew member ${candidate.crewMember?.id ?? ""}`;

  const roleName =
    candidate.role?.name ??
    candidate.role?.title ??
    "Role not specified";

  return (
    <div
      className={[
        "grid grid-cols-[1fr_auto_auto] items-center gap-5 px-5 py-5",
        !last ? "border-b border-[#d8d4ca]" : "",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <CheckCircle2
            size={15}
            className="shrink-0 text-[#667b61]"
          />

          <h3 className="truncate text-sm font-semibold">
            {crewName}
          </h3>
        </div>

        <p className="mt-1 text-xs text-[#6b6962]">
          {roleName}
        </p>
      </div>

      <div className="text-right">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#77736a]">
          Score
        </p>

        <p className="mt-1 text-sm font-semibold">
          {formatNumber(candidate.individualScore)}
        </p>
      </div>

      <div className="text-right">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#77736a]">
          Cost
        </p>

        <p className="mt-1 text-sm font-semibold">
          {formatCurrency(candidate.estimatedCost)}
        </p>
      </div>
    </div>
  );
}

function formatNumber(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCurrency(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
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

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}