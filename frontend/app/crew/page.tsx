"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";

interface CrewMember {
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: string;
}

export default function CrewPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCrew() {
    try {
      setLoading(true);
      setError(null);

      const data = await api.getCrew();

      setCrew(data as CrewMember[]);
    } catch (err) {
      console.error("Failed to load crew:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load crew members."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCrew();
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
            Crew
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadCrew}
            disabled={loading}
            className="flex items-center gap-2 border border-[#bcb8ae] px-3 py-2 text-sm font-medium transition-colors hover:border-[#17212b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <Link
            href="/crew/create"
            className="flex items-center gap-2 bg-[#17212b] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#293b49]"
          >
            <Plus size={16} />
            Add crew member
          </Link>
        </div>
      </header>

      <main className="px-6 py-8 lg:px-8">
        <div className="mb-7 max-w-2xl">
          <p className="text-sm leading-6 text-[#6b6962]">
            Manage the people available for event staffing and
            recommendations.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="border border-[#d8d4ca] bg-[#f8f6f0] p-8">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#77736a]">
              Loading crew...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="border border-[#c9a6a0] bg-[#f5e9e6] p-6">
            <p className="font-medium text-[#6d332b]">
              Could not load crew
            </p>

            <p className="mt-2 text-sm text-[#7d514a]">
              {error}
            </p>

            <button
              type="button"
              onClick={loadCrew}
              className="mt-4 border border-[#6d332b] px-4 py-2 text-sm font-medium text-[#6d332b] hover:bg-[#6d332b] hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && crew.length === 0 && (
          <div className="border border-[#d8d4ca] bg-[#f8f6f0] p-10">
            <div className="flex h-10 w-10 items-center justify-center bg-[#17212b] text-[#d9a441]">
              <Users size={18} />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              No crew members yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#6b6962]">
              Add crew members to make them available for event
              staffing and future recommendations.
            </p>

            <Link
              href="/crew/create"
              className="mt-6 inline-flex items-center gap-2 bg-[#17212b] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#293b49]"
            >
              <Plus size={16} />
              Add crew member
            </Link>
          </div>
        )}

        {/* Crew list */}
        {!loading && !error && crew.length > 0 && (
          <section className="border border-[#d8d4ca] bg-[#f8f6f0]">
            <div className="grid grid-cols-[1fr_auto] gap-6 border-b border-[#d8d4ca] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#77736a]">
              <span>Crew member</span>
              <span />
            </div>

            {crew.map((member, index) => {
              const name = getCrewName(member);

              return (
                <Link
                  key={member.id}
                  href={`/crew/${member.id}`}
                  className={[
                    "group grid grid-cols-[1fr_auto] items-center gap-6 px-5 py-5 transition-colors hover:bg-[#eeece5]",
                    index !== crew.length - 1
                      ? "border-b border-[#d8d4ca]"
                      : "",
                  ].join(" ")}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#cfcac0] bg-[#eeece5] font-mono text-xs font-medium">
                        {getInitials(name)}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold">
                          {name}
                        </h2>

                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6b6962]">
                          {member.email && (
                            <span>{member.email}</span>
                          )}

                          {member.phone && (
                            <span>{member.phone}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {member.status && (
                      <span className="border border-[#c9c5bb] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#5f5c55]">
                        {member.status}
                      </span>
                    )}

                    <ArrowRight
                      size={16}
                      className="text-[#77736a] transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

function getCrewName(member: CrewMember) {
  if (member.name) {
    return member.name;
  }

  const fullName = [
    member.firstName,
    member.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return fullName || `Crew member ${member.id}`;
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}