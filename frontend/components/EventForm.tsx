"use client";

import React, { useState } from "react";
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
} from "lucide-react";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFindOptimalCrew?: (data: any) => void;
}

export default function CreateEventModal({
  isOpen,
  onClose,
  onFindOptimalCrew,
}: CreateEventModalProps) {
  if (!isOpen) return null;

  // Extracted AI Data State
  const [eventDetails, setEventDetails] = useState({
    eventType: "Wedding",
    location: "Pune",
    date: "20 September",
    guests: 300,
  });

  const [parameters, setParameters] = useState({
    budget: "₹1,00,000",
    priorities: ["High reliability", "Premium quality", "Budget-conscious"],
  });

  const [requiredCrew, setRequiredCrew] = useState([
    { id: "1", role: "Photographer", count: 2 },
    { id: "2", role: "Cinematic Videographer", count: 1 },
    { id: "3", role: "DJ", count: 1 },
    { id: "4", role: "Decorator", count: 1 },
  ]);

  const handleAddRole = () => {
    const roleName = prompt("Enter new role name:");
    if (roleName) {
      setRequiredCrew([
        ...requiredCrew,
        { id: Date.now().toString(), role: roleName, count: 1 },
      ]);
    }
  };

  const handleSubmit = () => {
    if (onFindOptimalCrew) {
      onFindOptimalCrew({ eventDetails, parameters, requiredCrew });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#F8FAFC] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* HEADER BAR */}
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
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="p-8 space-y-6">
          {/* TITLE & AI STATUS */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[11px] font-bold tracking-wide uppercase mb-3">
              <CheckCircle2 size={13} className="fill-purple-600 text-white" />
              <span>AI Analysis Complete</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Here’s what we understood
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Review the extracted details from your prompt. Edit any fields
              before we begin matching crews.
            </p>
          </div>

          {/* TWO-COLUMN CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* EVENT DETAILS */}
            <div className="md:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs relative">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                  <Calendar size={18} className="text-slate-500" />
                  <span>Event Details</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
                  <Pencil size={16} />
                </button>
              </div>

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
                    {eventDetails.date}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-1">
                    Guests
                  </span>
                  <span className="text-base font-bold text-slate-800">
                    {eventDetails.guests}
                  </span>
                </div>
              </div>
            </div>

            {/* PARAMETERS */}
            <div className="md:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                    <SlidersHorizontal size={18} className="text-slate-500" />
                    <span>Parameters</span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-1 transition-colors">
                    <Pencil size={16} />
                  </button>
                </div>

                <div className="mb-4">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">
                    Budget Allocation
                  </span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {parameters.budget}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-2">
                    AI Priorities Detected
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {parameters.priorities.map((priority, index) => (
                      <span
                        key={index}
                        className="bg-blue-50/80 text-blue-800 border border-blue-100 text-xs font-semibold px-3 py-1 rounded-full"
                      >
                        {priority}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REQUIRED CREW CARD */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Users size={18} className="text-blue-600" />
                <span>Required Crew</span>
              </div>
              <button
                onClick={handleAddRole}
                className="border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus size={14} />
                Add Role
              </button>
            </div>
            <p className="text-xs text-slate-400 font-medium mb-5">
              AI determined these roles are optimal for your event scope.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {requiredCrew.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50/80 border border-slate-100 rounded-xl p-3.5 flex items-center gap-3"
                >
                  <span className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 font-black text-sm flex items-center justify-center shrink-0">
                    {item.count}
                  </span>
                  <span className="text-xs font-bold text-slate-800 leading-snug">
                    {item.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PRIMARY ACTION */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Find Optimal Crew</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
