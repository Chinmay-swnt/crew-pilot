"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Pencil,
  MapPin,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Calendar,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  UserRound,
  Trash2,
} from "lucide-react";

import {
  assembleCrewWithAI,
  AIAssemblyResponse,
} from "../lib/ai-api";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFindOptimalCrew?: (
    data: AIAssemblyResponse
  ) => void;
  initialDescription?: string;
}

interface CrewRequirement {
  id: string;
  role: string;
  count: number;
}

type InputMode = "ai" | "manual";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(value?: string | null): string {
  if (!value) return "Not specified";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildDescriptionFromFields(data: {
  eventType: string;
  location: string;
  date: string;
  guests: number;
  budget: number;
  priority: string;
  requiredCrew: CrewRequirement[];
}): string {
  const roles = data.requiredCrew
    .filter((role) => role.role.trim())
    .map(
      (role) =>
        `${role.count} ${role.role}`
    )
    .join(", ");

  return [
    `I am organizing a ${data.eventType || "event"}`,
    data.location ? `in ${data.location}` : "",
    data.date ? `on ${data.date}` : "",
    data.guests > 0 ? `for ${data.guests} guests` : "",
    data.budget > 0
      ? `with a budget of ₹${data.budget}`
      : "",
    roles ? `I need ${roles}` : "",
    data.priority
      ? `Priority is ${data.priority}`
      : "",
    ".",
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+\./, ".");
}

export default function CreateEventModal({
  isOpen,
  onClose,
  onFindOptimalCrew,
  initialDescription,
}: CreateEventModalProps) {
  const [inputMode, setInputMode] =
    useState<InputMode>("ai");

  const [rawDescription, setRawDescription] =
    useState(
      initialDescription ||
        "I am organizing a premium wedding in Pune on 20 September 2026 for 300 guests. My budget is ₹1,00,000. I need 2 photographers, 1 cinematic videographer, 1 DJ, and 1 decorator. Reliability and premium quality are important."
    );

  const [analysis, setAnalysis] =
    useState<AIAssemblyResponse | null>(null);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [eventType, setEventType] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [date, setDate] =
    useState("");

  const [guests, setGuests] =
    useState<number | "">("");

  const [budget, setBudget] =
    useState<number | "">("");

  const [priority, setPriority] =
    useState("balanced");

  const [requiredCrew, setRequiredCrew] =
    useState<CrewRequirement[]>([
      {
        id: "1",
        role: "Photographer",
        count: 2,
      },
      {
        id: "2",
        role: "Cinematic Videographer",
        count: 1,
      },
      {
        id: "3",
        role: "DJ",
        count: 1,
      },
      {
        id: "4",
        role: "Decorator",
        count: 1,
      },
    ]);

  const [isEditingDetails, setIsEditingDetails] =
    useState(false);

  const [isAddingRole, setIsAddingRole] =
    useState(false);

  const [newRole, setNewRole] =
    useState("");

  const [activityMessages, setActivityMessages] =
    useState<string[]>([]);

  const aiMessages = [
    "Understanding event requirements...",
    "Extracting event type, location and constraints...",
    "Identifying required crew roles...",
    "Searching available crew...",
    "Finding the best matches...",
    "Checking crew availability...",
    "Reviewing crew ratings and performance...",
    "Comparing reliability and previous feedback...",
    "Optimising the team for your budget...",
    "Selecting the strongest primary crew...",
    "Finding suitable backup crew...",
    "Finalising recommendation...",
  ];

  useEffect(() => {
    if (!isAnalyzing) {
      return;
    }

    setActivityMessages([]);

    let index = 0;

    const interval = setInterval(() => {
      if (index >= aiMessages.length) {
        clearInterval(interval);
        return;
      }

      setActivityMessages((current) => [
        ...current,
        aiMessages[index],
      ]);

      index += 1;
    }, 850);

    return () => {
      clearInterval(interval);
    };
  }, [isAnalyzing]);

  if (!isOpen) {
    return null;
  }

  const handleAnalyzeWithAI = async (
    description: string
  ) => {
    if (description.trim().length < 10) {
      setError(
        "Please provide more information about your event."
      );
      return;
    }

    setError(null);
    setAnalysis(null);
    setActivityMessages([]);
    setIsAnalyzing(true);

    try {
      const result =
        await assembleCrewWithAI(
          description.trim()
        );

      const requirements =
        result.event_requirements;

      setAnalysis(result);

      setEventType(
        requirements.event_type || ""
      );

      setLocation(
        requirements.location || ""
      );

      setDate(
        requirements.date || ""
      );

      setGuests(
        requirements.guest_count || 0
      );

      setBudget(
        requirements.budget || 0
      );

      setPriority(
        requirements.priority || "balanced"
      );

      setRequiredCrew(
        (requirements.roles || []).map(
          (role, index) => ({
            id: `${Date.now()}-${index}`,
            role: role.role,
            count: role.count,
          })
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "AI analysis failed."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAIAnalysis = async () => {
    await handleAnalyzeWithAI(
      rawDescription
    );
  };

  const handleManualAnalysis = async () => {
    const numericGuests =
      Number(guests) || 0;

    const numericBudget =
      Number(budget) || 0;

    if (!eventType.trim()) {
      setError("Enter an event type.");
      return;
    }

    if (!location.trim()) {
      setError("Enter an event location.");
      return;
    }

    if (!date) {
      setError("Select an event date.");
      return;
    }

    if (numericGuests <= 0) {
      setError(
        "Guest count must be greater than 0."
      );
      return;
    }

    if (numericBudget <= 0) {
      setError(
        "Budget must be greater than 0."
      );
      return;
    }

    if (requiredCrew.length === 0) {
      setError(
        "Add at least one required crew role."
      );
      return;
    }

    const generatedDescription =
      buildDescriptionFromFields({
        eventType,
        location,
        date,
        guests: numericGuests,
        budget: numericBudget,
        priority,
        requiredCrew,
      });

    setRawDescription(
      generatedDescription
    );

    await handleAnalyzeWithAI(
      generatedDescription
    );
  };

  const handleAddRole = () => {
    const roleName = newRole.trim();

    if (!roleName) {
      return;
    }

    setRequiredCrew((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        role: roleName,
        count: 1,
      },
    ]);

    setNewRole("");
    setIsAddingRole(false);
  };

  const handleRemoveRole = (
    id: string
  ) => {
    setRequiredCrew((current) =>
      current.filter(
        (role) => role.id !== id
      )
    );
  };

  const handleChangeQuantity = (
    id: string,
    quantity: number
  ) => {
    setRequiredCrew((current) =>
      current.map((role) =>
        role.id === id
          ? {
              ...role,
              count: Math.max(
                1,
                quantity || 1
              ),
            }
          : role
      )
    );
  };

  const handleUseRecommendation =
    () => {
      if (!analysis) {
        return;
      }

      const updatedResult: AIAssemblyResponse =
        {
          ...analysis,

          event_requirements: {
            ...analysis.event_requirements,
            event_type: eventType,
            location,
            date: date || null,
            guest_count:
              Number(guests) || 0,
            budget:
              Number(budget) || 0,
            priority,
            roles: requiredCrew.map(
              (role) => ({
                role: role.role,
                count: role.count,
              })
            ),
          },
        };

      onFindOptimalCrew?.(
        updatedResult
      );
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">

      <div className="relative w-full max-w-6xl bg-[#F8FAFC] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">

        {/* HEADER */}
        <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">

          <div className="flex items-center gap-2 text-sm font-semibold">

            <div className="flex items-center gap-1.5 text-slate-900">

              <Sparkles
                size={16}
                className="text-blue-600"
              />

              <span className="font-bold">
                CrewPilot
              </span>
            </div>

            <span className="text-slate-300">
              /
            </span>

            <span className="text-slate-500">
              Create Event
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-8 space-y-6">

          {/* TITLE */}
          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase">
              <Sparkles size={13} />
              AI Crew Assembly
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
              Create your event
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Describe your event naturally or
              enter the details directly. CrewPilot
              will use the same AI assembly pipeline
              either way.
            </p>
          </div>

          {/* MODE SWITCH */}
          <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex gap-1">

            <button
              onClick={() =>
                setInputMode("ai")
              }
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition ${
                inputMode === "ai"
                  ? "bg-blue-700 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Sparkles size={16} />
              Describe with AI
            </button>

            <button
              onClick={() =>
                setInputMode("manual")
              }
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition ${
                inputMode === "manual"
                  ? "bg-blue-700 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Pencil size={16} />
              Enter manually
            </button>
          </div>

          {/* AI MODE */}
          {inputMode === "ai" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <label className="block text-sm font-bold text-slate-800 mb-2">
                Describe your event
              </label>

              <textarea
                value={rawDescription}
                onChange={(e) =>
                  setRawDescription(
                    e.target.value
                  )
                }
                rows={6}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                placeholder="Example: I am organizing a premium wedding in Pune..."
              />

              <div className="flex items-center justify-between mt-3">

                <span className="text-xs text-slate-400">
                  {rawDescription.length} characters
                </span>

                <button
                  onClick={
                    handleAIAnalysis
                  }
                  disabled={
                    isAnalyzing
                  }
                  className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={17} />
                      Analyze with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* MANUAL MODE */}
          {inputMode === "manual" && (
            <div className="space-y-5">

              <div className="bg-white border border-slate-200 rounded-2xl p-6">

                <div className="flex items-center gap-2 mb-5">

                  <Calendar
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Event Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">
                      Event Type
                    </label>

                    <input
                      value={eventType}
                      onChange={(e) =>
                        setEventType(
                          e.target.value
                        )
                      }
                      placeholder="Wedding, Concert, Corporate Event..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">
                      Location
                    </label>

                    <div className="relative">

                      <MapPin
                        size={16}
                        className="absolute left-3 top-3 text-slate-400"
                      />

                      <input
                        value={location}
                        onChange={(e) =>
                          setLocation(
                            e.target.value
                          )
                        }
                        placeholder="Pune, Mumbai..."
                        className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">
                      Event Date
                    </label>

                    <input
                      type="date"
                      value={date}
                      onChange={(e) =>
                        setDate(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">
                      Guest Count
                    </label>

                    <div className="relative">

                      <Users
                        size={16}
                        className="absolute left-3 top-3 text-slate-400"
                      />

                      <input
                        type="number"
                        min={1}
                        value={guests}
                        onChange={(e) =>
                          setGuests(
                            e.target.value ===
                              ""
                              ? ""
                              : Number(
                                  e.target
                                    .value
                                )
                          )
                        }
                        placeholder="300"
                        className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">
                      Budget (₹)
                    </label>

                    <input
                      type="number"
                      min={0}
                      value={budget}
                      onChange={(e) =>
                        setBudget(
                          e.target.value ===
                            ""
                            ? ""
                            : Number(
                                e.target.value
                              )
                        )
                      }
                      placeholder="100000"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">
                      Priority
                    </label>

                    <select
                      value={priority}
                      onChange={(e) =>
                        setPriority(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                    >
                      <option value="balanced">
                        Balanced
                      </option>

                      <option value="quality > cost">
                        Quality over cost
                      </option>

                      <option value="cost > quality">
                        Cost over quality
                      </option>

                      <option value="luxury">
                        Luxury
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ROLES */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 border-l-4 border-l-blue-600">

                <div className="flex items-center justify-between mb-5">

                  <div>

                    <div className="flex items-center gap-2">

                      <Users
                        size={18}
                        className="text-blue-600"
                      />

                      <h3 className="font-bold text-slate-900">
                        Required Crew
                      </h3>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      Add the roles you need for this event.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setIsAddingRole(true)
                    }
                    className="border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add Role
                  </button>
                </div>

                {isAddingRole && (
                  <div className="flex gap-2 mb-4">

                    <input
                      value={newRole}
                      onChange={(e) =>
                        setNewRole(
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter"
                        ) {
                          handleAddRole();
                        }
                      }}
                      autoFocus
                      placeholder="Photographer, DJ, Decorator..."
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />

                    <button
                      onClick={
                        handleAddRole
                      }
                      className="bg-blue-700 text-white rounded-lg px-4 text-xs font-bold"
                    >
                      Add
                    </button>

                    <button
                      onClick={() =>
                        setIsAddingRole(
                          false
                        )
                      }
                      className="border border-slate-200 rounded-lg px-4 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <div className="space-y-3">

                  {requiredCrew.map(
                    (role) => (
                      <div
                        key={role.id}
                        className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3"
                      >

                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 font-black flex items-center justify-center text-sm">
                          {role.count}
                        </div>

                        <input
                          value={role.role}
                          onChange={(e) =>
                            setRequiredCrew(
                              (current) =>
                                current.map(
                                  (
                                    currentRole
                                  ) =>
                                    currentRole.id ===
                                    role.id
                                      ? {
                                          ...currentRole,
                                          role: e
                                            .target
                                            .value,
                                        }
                                      : currentRole
                                )
                            )
                          }
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-500"
                        />

                        <input
                          type="number"
                          min={1}
                          value={role.count}
                          onChange={(e) =>
                            handleChangeQuantity(
                              role.id,
                              Number(
                                e.target
                                  .value
                              )
                            )
                          }
                          className="w-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold"
                        />

                        <button
                          onClick={() =>
                            handleRemoveRole(
                              role.id
                            )
                          }
                          className="text-slate-300 hover:text-red-500 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )
                  )}
                </div>

                {requiredCrew.length ===
                  0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
                    No crew roles added yet.
                  </div>
                )}
              </div>

              <div className="flex justify-end">

                <button
                  onClick={
                    handleManualAnalysis
                  }
                  disabled={
                    isAnalyzing
                  }
                  className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold px-7 py-3.5 rounded-xl flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Building crew...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Build Crew with AI
                      <ArrowRight
                        size={18}
                      />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* AI ACTIVITY */}
          {isAnalyzing && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Loader2
                    size={17}
                    className="animate-spin text-slate-600"
                  />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Working on your event...
                  </p>

                  <p className="text-xs text-slate-400">
                    CrewPilot is processing the request
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 font-mono text-sm">

                {activityMessages.map(
                  (message, index) => (
                    <div
                      key={`${message}-${index}`}
                      className="text-slate-600"
                    >
                      <span className="text-slate-300 mr-2">
                        ›
                      </span>

                      {message}
                    </div>
                  )
                )}

                <div className="text-slate-900">
                  <span className="text-slate-300 mr-2">
                    ›
                  </span>

                  <span className="inline-flex items-center">
                    <span>
                      {activityMessages.length ===
                      0
                        ? "Starting analysis"
                        : "Processing"}
                    </span>

                    <span className="animate-pulse ml-1">
                      ...
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-red-800">

              <AlertTriangle
                size={18}
                className="mt-0.5"
              />

              <div>

                <p className="font-bold">
                  AI analysis failed
                </p>

                <p className="text-sm mt-1">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* AI RESULT */}
          {analysis && !isAnalyzing && (
            <>

              <div className="pt-2 border-t border-slate-200" />

              <div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase">
                  <CheckCircle2 size={14} />
                  AI Analysis Complete
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                  Here’s what we understood
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Review the extracted requirements
                  and AI-generated crew recommendation.
                </p>
              </div>

              {/* DETAILS + SUMMARY */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                  <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">

                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <Calendar size={18} />
                      Event Details
                    </div>

                    <button
                      onClick={() =>
                        setIsEditingDetails(
                          (current) =>
                            !current
                        )
                      }
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>

                  {isEditingDetails ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <input
                        value={eventType}
                        onChange={(e) =>
                          setEventType(
                            e.target.value
                          )
                        }
                        placeholder="Event type"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      />

                      <input
                        value={location}
                        onChange={(e) =>
                          setLocation(
                            e.target.value
                          )
                        }
                        placeholder="Location"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      />

                      <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                          setDate(
                            e.target.value
                          )
                        }
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      />

                      <input
                        type="number"
                        value={guests}
                        onChange={(e) =>
                          setGuests(
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      />

                      <input
                        type="number"
                        value={budget}
                        onChange={(e) =>
                          setBudget(
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      />

                      <button
                        onClick={() =>
                          setIsEditingDetails(
                            false
                          )
                        }
                        className="rounded-lg bg-blue-700 text-white font-bold px-4 py-2 text-sm"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-y-5 gap-x-6">

                      <div>
                        <p className="text-xs text-slate-400 font-semibold">
                          Event Type
                        </p>

                        <p className="text-base font-bold text-slate-800 mt-1">
                          {eventType}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 font-semibold">
                          Location
                        </p>

                        <p className="text-base font-bold text-slate-800 mt-1 flex items-center gap-1">
                          <MapPin size={14} />
                          {location}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 font-semibold">
                          Date
                        </p>

                        <p className="text-base font-bold text-slate-800 mt-1">
                          {formatDate(date)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 font-semibold">
                          Guests
                        </p>

                        <p className="text-base font-bold text-slate-800 mt-1 flex items-center gap-1">
                          <Users size={14} />
                          {guests}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 font-semibold">
                          Budget
                        </p>

                        <p className="text-base font-bold text-slate-800 mt-1">
                          {formatCurrency(
                            Number(
                              budget
                            )
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 font-semibold">
                          Priority
                        </p>

                        <p className="text-sm font-bold text-blue-700 mt-1">
                          {priority}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                  <div className="flex items-center gap-2 font-bold text-slate-800 mb-5 border-b border-slate-100 pb-3">
                    <SlidersHorizontal size={18} />
                    AI Decision Summary
                  </div>

                  <div className="grid grid-cols-2 gap-5">

                    <div>
                      <p className="text-xs text-slate-400 font-semibold">
                        Match Score
                      </p>

                      <p className="text-3xl font-black text-blue-700 mt-1">
                        {Number(
                          analysis.overall_match_score ||
                            0
                        ).toFixed(1)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 font-semibold">
                        Primary Cost
                      </p>

                      <p className="text-xl font-black text-slate-900 mt-1">
                        {formatCurrency(
                          analysis.total_cost
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 font-semibold">
                        Primary Crew
                      </p>

                      <p className="text-xl font-black text-slate-900 mt-1">
                        {
                          analysis.primary_crew
                            .length
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 font-semibold">
                        Backups
                      </p>

                      <p className="text-xl font-black text-slate-900 mt-1">
                        {
                          analysis.backup_crew
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* BUDGET WARNING */}
              {analysis.budget_warning && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-900">

                  <AlertTriangle size={18} />

                  <div>
                    <p className="font-bold">
                      Budget warning
                    </p>

                    <p className="text-sm mt-1">
                      {analysis.budget_warning}
                    </p>
                  </div>
                </div>
              )}

              {/* PRIMARY CREW */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                <div className="flex items-center gap-2 mb-5">

                  <ShieldCheck
                    size={20}
                    className="text-emerald-600"
                  />

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Recommended Primary Crew
                    </h3>

                    <p className="text-xs text-slate-400">
                      AI-selected crew for the event
                    </p>
                  </div>
                </div>

                <div className="space-y-3">

                  {analysis.primary_crew.map(
                    (member, index) => (
                      <div
                        key={`${member.crew_member_id}-${index}`}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-4"
                      >

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                            <UserRound size={18} />
                          </div>

                          <div>

                            <p className="font-bold text-slate-900">
                              Crew #{member.crew_member_id}
                            </p>

                            <p className="text-xs text-slate-500">
                              {member.role}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">

                          <p className="text-sm font-black text-slate-900">
                            {formatCurrency(
                              member.agreed_rate
                            )}
                          </p>

                          <p className="text-[11px] text-slate-400">
                            agreed rate
                          </p>
                        </div>
                      </div>
                    )
                  )}

                  {analysis.primary_crew.length ===
                    0 && (
                    <p className="text-sm text-slate-500">
                      No primary crew returned.
                    </p>
                  )}
                </div>
              </div>

              {/* BACKUP CREW */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                <div className="flex items-center gap-2 mb-5">

                  <ShieldCheck
                    size={20}
                    className="text-amber-600"
                  />

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Ranked Backup Crew
                    </h3>

                    <p className="text-xs text-slate-400">
                      Fallback crew to reduce no-show risk
                    </p>
                  </div>
                </div>

                <div className="space-y-3">

                  {analysis.backup_crew.map(
                    (member, index) => (
                      <div
                        key={`${member.crew_member_id}-${index}`}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-4"
                      >

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xs">
                            #{index + 1}
                          </div>

                          <div>

                            <p className="font-bold text-slate-900">
                              Crew #{member.crew_member_id}
                            </p>

                            <p className="text-xs text-slate-500">
                              {member.role}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-black text-slate-900">
                          {formatCurrency(
                            member.agreed_rate
                          )}
                        </p>
                      </div>
                    )
                  )}

                  {analysis.backup_crew.length ===
                    0 && (
                    <p className="text-sm text-slate-500">
                      No backup crew returned.
                    </p>
                  )}
                </div>
              </div>

              {/* EXPLANATION */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white">

                <div className="flex items-center gap-2 mb-3">

                  <Sparkles
                    size={18}
                    className="text-blue-300"
                  />

                  <h3 className="font-bold">
                    Why this team?
                  </h3>
                </div>

                <p className="text-sm text-slate-300 leading-6">
                  {analysis.team_explanation ||
                    "The AI did not return an explanation."}
                </p>
              </div>

              {/* FINAL ACTION */}
              <div className="flex justify-center pt-2">

                <button
                  onClick={
                    handleUseRecommendation
                  }
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-8 py-4 rounded-xl flex items-center gap-2 shadow-lg"
                >
                  <span>
                    Use This Crew Recommendation
                  </span>

                  <ArrowRight size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}