"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  Trash2,
  AlertTriangle,
} from "lucide-react";

import { assembleCrewWithAI, AIAssemblyResponse } from "../lib/ai-api";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFindOptimalCrew?: (data: AIAssemblyResponse) => void;
  initialDescription?: string;
}

interface CrewRequirement {
  id: string;
  role: string;
  count: number;
}

interface EventDetails {
  eventType: string;
  location: string;
  date: string;
  guests: number;
}

interface Parameters {
  budget: string;
  priorities: string[];
}

const DEFAULT_DESCRIPTION =
  "I am organizing a premium wedding in Pune on 20 September 2026 for 300 guests. My budget is ₹1,00,000. I need 2 photographers, 1 cinematic videographer, 1 DJ, and 1 decorator. Reliability and premium quality are important.";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDisplayDate(value?: string | null): string {
  if (!value) {
    return "Not specified";
  }

  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CreateEventModal({
  isOpen,
  onClose,
  onFindOptimalCrew,
  initialDescription,
}: CreateEventModalProps) {
  const [rawDescription, setRawDescription] = useState(
    initialDescription || DEFAULT_DESCRIPTION,
  );

  const [eventDetails, setEventDetails] = useState<EventDetails>({
    eventType: "",
    location: "",
    date: "",
    guests: 0,
  });

  const [parameters, setParameters] = useState<Parameters>({
    budget: "",
    priorities: [],
  });

  const [requiredCrew, setRequiredCrew] = useState<CrewRequirement[]>([]);

  const [analysis, setAnalysis] = useState<AIAssemblyResponse | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [isEditingDetails, setIsEditingDetails] = useState(false);

  const [budgetInput, setBudgetInput] = useState("");

  const [isEditingPriorities, setIsEditingPriorities] = useState(false);

  const [newPriority, setNewPriority] = useState("");

  const [newRoleName, setNewRoleName] = useState("");

  const [isAddingRole, setIsAddingRole] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialDescription) {
      setRawDescription(initialDescription);
    }
  }, [isOpen, initialDescription]);

  const hasAnalysis = Boolean(analysis);

  const normalizedBudget = useMemo(() => {
    const numericValue = Number(budgetInput.replace(/[^0-9.]/g, ""));

    return Number.isFinite(numericValue) ? numericValue : 0;
  }, [budgetInput]);

  if (!isOpen) {
    return null;
  }

  const handleAnalyze = async () => {
    const description = rawDescription.trim();

    if (description.length < 10) {
      setError("Please provide a proper event description.");
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      const result = await assembleCrewWithAI(description);

      setAnalysis(result);

      const extracted = result.event_requirements;

      setEventDetails({
        eventType: extracted.event_type || "",
        location: extracted.location || "",
        date: extracted.date || "",
        guests: extracted.guest_count || 0,
      });

      setParameters({
        budget: formatCurrency(extracted.budget || 0),
        priorities: extracted.priority ? [extracted.priority] : [],
      });

      setBudgetInput(String(extracted.budget || 0));

      setRequiredCrew(
        (extracted.roles || []).map((item, index) => ({
          id: `${Date.now()}-${index}`,
          role: item.role,
          count: item.count,
        })),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to reach the AI engine.",
      );
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateDetails = () => {
    const numericGuests = Number(eventDetails.guests);

    setEventDetails({
      ...eventDetails,
      guests: Number.isFinite(numericGuests) ? numericGuests : 0,
    });
  };

  const handleSaveBudget = () => {
    const numericBudget = normalizedBudget;

    setParameters({
      ...parameters,
      budget: numericBudget > 0 ? formatCurrency(numericBudget) : "",
    });

    setIsEditingDetails(false);
  };

  const handleAddRole = () => {
    const role = newRoleName.trim();

    if (!role) {
      return;
    }

    setRequiredCrew((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        role,
        count: 1,
      },
    ]);

    setNewRoleName("");
    setIsAddingRole(false);
  };

  const handleRemoveRole = (id: string) => {
    setRequiredCrew((current) => current.filter((item) => item.id !== id));
  };

  const handleChangeRoleCount = (id: string, count: number) => {
    setRequiredCrew((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              count: Math.max(1, count),
            }
          : item,
      ),
    );
  };

  const handleAddPriority = () => {
    const priority = newPriority.trim();

    if (!priority || parameters.priorities.includes(priority)) {
      return;
    }

    setParameters((current) => ({
      ...current,
      priorities: [...current.priorities, priority],
    }));

    setNewPriority("");
  };

  const handleRemovePriority = (priority: string) => {
    setParameters((current) => ({
      ...current,
      priorities: current.priorities.filter((item) => item !== priority),
    }));
  };

  const handleSubmit = () => {
    if (!analysis) {
      return;
    }

    const updatedResult: AIAssemblyResponse = {
      ...analysis,
      event_requirements: {
        ...analysis.event_requirements,
        event_type: eventDetails.eventType,
        location: eventDetails.location,
        date: eventDetails.date || null,
        guest_count: eventDetails.guests,
        budget: normalizedBudget || analysis.event_requirements.budget,
        roles: requiredCrew.map((item) => ({
          role: item.role,
          count: item.count,
        })),
        priority: parameters.priorities.join(" > "),
      },
    };

    onFindOptimalCrew?.(updatedResult);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#F8FAFC] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* HEADER */}
        <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <div className="flex items-center gap-1.5 text-slate-900">
              <Sparkles size={16} className="text-blue-600" />
              <span className="font-bold">CrewPilot</span>
            </div>

            <span className="text-slate-300">/</span>

            <span className="text-slate-500 font-medium">Create Event</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-6">
          {/* EVENT DESCRIPTION */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold tracking-wide uppercase mb-3">
              <Sparkles size={13} />
              <span>AI Crew Assembly</span>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Describe your event
            </h2>

            <p className="text-slate-500 text-sm mt-1 mb-4">
              Gemini will extract the event requirements, discover crew, review
              performance data, and assemble primary and backup teams.
            </p>

            <textarea
              value={rawDescription}
              onChange={(event) => setRawDescription(event.target.value)}
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
              placeholder="Example: I need 2 photographers and 1 videographer for a wedding in Pune on 20 September for 300 guests with a budget of ₹1,00,000."
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-slate-400">
                {rawDescription.length} characters
              </span>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    <span>Analyzing event...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    <span>Analyze with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-bold text-sm">AI analysis failed</p>

                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* ANALYSIS */}
          {hasAnalysis && (
            <>
              {/* TITLE */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[11px] font-bold tracking-wide uppercase mb-3">
                  <CheckCircle2
                    size={13}
                    className="fill-purple-600 text-white"
                  />
                  <span>AI Analysis Complete</span>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Here’s what we understood
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Review the extracted requirements before using them for crew
                  assembly.
                </p>
              </div>

              {/* EVENT DETAILS + PARAMETERS */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* EVENT DETAILS */}
                <div className="md:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                      <Calendar size={18} className="text-slate-500" />
                      <span>Event Details</span>
                    </div>

                    <button
                      onClick={() => setIsEditingDetails((value) => !value)}
                      className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
                      aria-label="Edit event details"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>

                  {isEditingDetails ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">
                          Event Type
                        </label>

                        <input
                          value={eventDetails.eventType}
                          onChange={(event) =>
                            setEventDetails({
                              ...eventDetails,
                              eventType: event.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">
                          Location
                        </label>

                        <input
                          value={eventDetails.location}
                          onChange={(event) =>
                            setEventDetails({
                              ...eventDetails,
                              location: event.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-slate-400 block mb-1">
                            Date
                          </label>

                          <input
                            type="date"
                            value={eventDetails.date}
                            onChange={(event) =>
                              setEventDetails({
                                ...eventDetails,
                                date: event.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-400 block mb-1">
                            Guests
                          </label>

                          <input
                            type="number"
                            min={1}
                            value={eventDetails.guests}
                            onChange={(event) =>
                              setEventDetails({
                                ...eventDetails,
                                guests: Number(event.target.value),
                              })
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block mb-1">
                          Event Type
                        </span>

                        <span className="text-base font-bold text-slate-800">
                          {eventDetails.eventType}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-400 block mb-1">
                          Location
                        </span>

                        <span className="text-base font-bold text-slate-800 flex items-center gap-1">
                          <MapPin size={14} className="text-slate-400" />
                          {eventDetails.location}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-400 block mb-1">
                          Date
                        </span>

                        <span className="text-base font-bold text-slate-800">
                          {formatDisplayDate(eventDetails.date)}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-slate-400 block mb-1">
                          Guests
                        </span>

                        <span className="text-base font-bold text-slate-800 flex items-center gap-1">
                          <Users size={14} className="text-slate-400" />
                          {eventDetails.guests}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* PARAMETERS */}
                <div className="md:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                      <SlidersHorizontal size={18} className="text-slate-500" />

                      <span>Parameters</span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">
                      Budget Allocation
                    </span>

                    {isEditingDetails ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={budgetInput}
                          onChange={(event) =>
                            setBudgetInput(event.target.value)
                          }
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-lg font-bold"
                        />

                        <button
                          onClick={handleSaveBudget}
                          className="text-xs font-bold px-3 py-2 rounded-lg bg-blue-700 text-white"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {parameters.budget}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-2">
                      AI Priorities Detected
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {parameters.priorities.map((priority) => (
                        <span
                          key={priority}
                          className="bg-blue-50/80 text-blue-800 border border-blue-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          {priority}

                          {isEditingPriorities && (
                            <button
                              onClick={() => handleRemovePriority(priority)}
                              className="text-blue-500 hover:text-blue-900"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() =>
                          setIsEditingPriorities((value) => !value)
                        }
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                      >
                        {isEditingPriorities ? "Done" : "Edit priorities"}
                      </button>

                      {isEditingPriorities && (
                        <>
                          <input
                            value={newPriority}
                            onChange={(event) =>
                              setNewPriority(event.target.value)
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                handleAddPriority();
                              }
                            }}
                            placeholder="Add priority"
                            className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                          />

                          <button
                            onClick={handleAddPriority}
                            className="text-xs font-bold text-blue-700"
                          >
                            Add
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* BUDGET WARNING */}
              {analysis?.budget_warning && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />

                  <div>
                    <p className="font-bold text-sm">Budget warning</p>

                    <p className="text-sm mt-1">{analysis.budget_warning}</p>
                  </div>
                </div>
              )}

              {/* REQUIRED CREW */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm border-l-4 border-l-blue-600">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                    <Users size={18} className="text-blue-600" />
                    <span>Required Crew</span>
                  </div>

                  {!isAddingRole && (
                    <button
                      onClick={() => setIsAddingRole(true)}
                      className="border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Plus size={14} />
                      Add Role
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-400 font-medium mb-5">
                  These roles came from the AI requirement extraction. You can
                  adjust them before assembly.
                </p>

                {isAddingRole && (
                  <div className="mb-4 flex items-center gap-2">
                    <input
                      value={newRoleName}
                      onChange={(event) => setNewRoleName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleAddRole();
                        }
                      }}
                      autoFocus
                      placeholder="e.g. Lighting Technician"
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />

                    <button
                      onClick={handleAddRole}
                      className="px-3 py-2 rounded-lg bg-blue-700 text-white text-xs font-bold"
                    >
                      Add
                    </button>

                    <button
                      onClick={() => setIsAddingRole(false)}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {requiredCrew.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50/80 border border-slate-100 rounded-xl p-3.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 font-black text-sm flex items-center justify-center shrink-0">
                            {item.count}
                          </span>

                          <span className="text-xs font-bold text-slate-800 leading-snug">
                            {item.role}
                          </span>
                        </div>

                        <button
                          onClick={() => handleRemoveRole(item.id)}
                          className="text-slate-300 hover:text-red-500"
                          aria-label={`Remove ${item.role}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-[11px] text-slate-400 font-semibold">
                          Quantity
                        </span>

                        <input
                          type="number"
                          min={1}
                          value={item.count}
                          onChange={(event) =>
                            handleChangeRoleCount(
                              item.id,
                              Number(event.target.value),
                            )
                          }
                          className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI OUTPUT PREVIEW */}
              {analysis && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-400">
                      Primary Crew
                    </p>

                    <p className="text-2xl font-black text-slate-900 mt-1">
                      {analysis.primary_crew.length}
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-400">
                      Backups
                    </p>

                    <p className="text-2xl font-black text-slate-900 mt-1">
                      {analysis.backup_crew.length}
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-400">
                      Estimated Primary Cost
                    </p>

                    <p className="text-2xl font-black text-slate-900 mt-1">
                      {formatCurrency(analysis.total_cost)}
                    </p>
                  </div>
                </div>
              )}

              {/* PRIMARY ACTION */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={requiredCrew.length === 0}
                  className="bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold text-sm px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Use AI Crew Recommendation</span>

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
