"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, UserRound } from "lucide-react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

interface CrewMember {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
  bio?: string;
  experienceYears?: number;
  basePrice?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reliabilityScore?: number;
  status?: string;
  roleId?: number;
}

export default function CrewMemberPage() {
  const params = useParams();
  const crewMemberId = Number(params.id);

  const [member, setMember] = useState<CrewMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCrewMember() {
    if (!Number.isInteger(crewMemberId)) {
      setError("Invalid crew member ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await api.getCrewMember(crewMemberId);

      setMember(data as CrewMember);
    } catch (err) {
      console.error("Failed to load crew member:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load crew member."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCrewMember();
  }, [crewMemberId]);

  if (loading) {
    return (
      <div className="min-h-full bg-[#f5f3ee]">
        <Header />

        <main className="px-6 py-8 lg:px-8">
          <div className="border border-[#d8d4ca] bg-[#f8f6f0] p-8">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#77736a]">
              Loading crew member...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-full bg-[#f5f3ee]">
        <Header />

        <main className="px-6 py-8 lg:px-8">
          <div className="border border-[#c9a6a0] bg-[#f5e9e6] p-6">
            <p className="font-medium text-[#6d332b]">
              Could not load crew member
            </p>

            <p className="mt-2 text-sm text-[#7d514a]">
              {error ?? "Crew member not found."}
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={loadCrewMember}
                className="flex items-center gap-2 border border-[#6d332b] px-4 py-2 text-sm font-medium text-[#6d332b] hover:bg-[#6d332b] hover:text-white"
              >
                <RefreshCw size={15} />
                Try again
              </button>

              <Link
                href="/crew"
                className="flex items-center gap-2 border border-[#bcb8ae] px-4 py-2 text-sm font-medium hover:border-[#17212b]"
              >
                <ArrowLeft size={15} />
                Back to crew
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f5f3ee]">
      <Header />

      <main className="px-6 py-8 lg:px-8">
        <Link
          href="/crew"
          className="inline-flex items-center gap-2 text-sm text-[#6b6962] transition-colors hover:text-[#17212b]"
        >
          <ArrowLeft size={15} />
          Back to crew
        </Link>

        {/* Profile */}
        <section className="mt-6 border border-[#d8d4ca] bg-[#f8f6f0]">
          <div className="flex flex-col gap-6 border-b border-[#d8d4ca] px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center bg-[#17212b] text-[#d9a441]">
                <UserRound size={23} />
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8a6420]">
                  Crew member
                </p>

                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                  {member.name ?? `Crew member ${member.id}`}
                </h1>

                <p className="mt-1 text-sm text-[#6b6962]">
                  ID #{member.id}
                </p>
              </div>
            </div>

            {member.status && (
              <span className="w-fit border border-[#c9c5bb] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#5f5c55]">
                {member.status}
              </span>
            )}
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              label="Email"
              value={member.email}
            />

            <InfoItem
              label="Phone"
              value={member.phone}
            />

            <InfoItem
              label="Location"
              value={member.location}
            />
          </div>
        </section>

        {/* Professional information */}
        <section className="mt-6">
          <div className="mb-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8a6420]">
              Professional profile
            </p>

            <h2 className="mt-1 text-lg font-semibold">
              Crew information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-px border border-[#d8d4ca] bg-[#d8d4ca] sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              label="Experience"
              value={
                member.experienceYears !== undefined
                  ? `${member.experienceYears} years`
                  : "—"
              }
            />

            <Metric
              label="Base price"
              value={formatCurrency(member.basePrice)}
            />

            <Metric
              label="Rating"
              value={formatNumber(member.rating)}
            />

            <Metric
              label="Reliability"
              value={formatNumber(member.reliabilityScore)}
            />
          </div>
        </section>

        {/* Bio */}
        {member.bio && (
          <section className="mt-6 border border-[#d8d4ca] bg-[#f8f6f0]">
            <div className="border-b border-[#d8d4ca] px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#77736a]">
                About
              </p>
            </div>

            <div className="px-5 py-5">
              <p className="max-w-3xl text-sm leading-7 text-[#5f5c55]">
                {member.bio}
              </p>
            </div>
          </section>
        )}

        {/* Location data */}
        {(member.latitude !== undefined ||
          member.longitude !== undefined ||
          member.location) && (
          <section className="mt-6 border border-[#d8d4ca] bg-[#f8f6f0]">
            <div className="border-b border-[#d8d4ca] px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#77736a]">
                Location data
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3">
              <InfoItem
                label="Location"
                value={member.location}
              />

              <InfoItem
                label="Latitude"
                value={
                  member.latitude !== undefined
                    ? String(member.latitude)
                    : undefined
                }
              />

              <InfoItem
                label="Longitude"
                value={
                  member.longitude !== undefined
                    ? String(member.longitude)
                    : undefined
                }
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-[#d8d4ca] px-6 lg:px-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a6420]">
          Operations
        </p>

        <h1 className="mt-1 text-xl font-semibold tracking-tight">
          Crew profile
        </h1>
      </div>
    </header>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="border-b border-[#d8d4ca] px-5 py-5 sm:border-r">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#77736a]">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium">
        {value || "—"}
      </p>
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
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#77736a]">
        {label}
      </p>

      <p className="mt-3 text-lg font-semibold tracking-tight">
        {value}
      </p>
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