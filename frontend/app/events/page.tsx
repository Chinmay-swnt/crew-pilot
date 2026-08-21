"use client";

import React, { useState } from "react";
import {
  Rocket,
  Plus,
  LayoutDashboard,
  Calendar,
  Users,
  Sparkles,
  FileText,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  SlidersHorizontal,
  Pencil,
} from "lucide-react";

export default function CreateEventPage() {
  // State for the main AI prompt input
  const [eventDescription, setEventDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Fetch this user data from Supabase Auth / Profiles table
  const userProfile = {
    avatarUrl: "https://i.pravatar.cc/150?img=47", // Placeholder
  };

  // Handler to send data to Supabase / your AI edge function
  const handleUnderstandRequirements = async () => {
    if (!eventDescription.trim()) return;

    setIsSubmitting(true);
    try {
      // SUPABASE INTEGRATION POINT:
      // const { data, error } = await supabase.functions.invoke('extract-requirements', {
      //   body: { description: eventDescription }
      // });
      console.log("Submitting to AI processing:", eventDescription);

      // Handle the response...
    } catch (error) {
      console.error("Error processing requirements:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0F172A] text-slate-400 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center px-6 gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Rocket size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl leading-tight">
                CrewPilot
              </h1>
              <p className="text-xs text-slate-400">AI Staffing Hub</p>
            </div>
          </div>

          {/* Sidebar Action */}
          <div className="px-4 mb-6">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors">
              <Plus size={16} />
              Create Event
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 px-3">
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavItem icon={<Calendar size={18} />} label="Events" isActive />
            <NavItem icon={<Users size={18} />} label="Crew" />
            <NavItem icon={<Sparkles size={18} />} label="Recommendations" />
            <NavItem icon={<FileText size={18} />} label="Bookings" />
            <NavItem icon={<BarChart2 size={18} />} label="Analytics" />
            <NavItem icon={<Settings size={18} />} label="Settings" />
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="px-3 pb-6 border-t border-slate-800 pt-4 flex flex-col gap-1">
          <NavItem icon={<HelpCircle size={18} />} label="Support" />
          <NavItem icon={<LogOut size={18} />} label="Logout" />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search events, crew, or roles..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors">
              <Bell size={20} />
            </button>
            <button className="text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors">
              <SlidersHorizontal size={20} />
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">
              Create Event
            </button>
            {/* User Avatar connected to DB */}
            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-slate-200 cursor-pointer ml-2">
              <img
                src={userProfile.avatarUrl}
                alt="User Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
          <div className="max-w-3xl w-full flex flex-col items-center text-center -mt-20">
            <div className="bg-blue-50 text-blue-900 p-3 rounded-2xl mb-6">
              <Sparkles size={28} />
            </div>

            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Describe your event
            </h2>

            <p className="text-slate-500 text-lg mb-10 max-w-xl leading-relaxed">
              In your own words, tell us what you need. Our AI will
              automatically extract roles, budgets, and operational
              requirements.
            </p>

            <div className="w-full relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 transition-shadow focus-within:shadow-md focus-within:border-blue-300">
              <div className="absolute top-5 left-5 text-slate-400">
                <Pencil size={20} />
              </div>
              <textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="I'm organizing a premium wedding in Pune for 300 guests. I need 2 photographers, a cinematic videographer, DJ and decorator. Budget ₹1 lakh. Reliability is very important."
                className="w-full min-h-[160px] pl-14 pr-6 py-5 text-slate-700 placeholder:text-slate-400 resize-none focus:outline-none text-lg leading-relaxed"
              />
            </div>

            <button
              onClick={handleUnderstandRequirements}
              disabled={isSubmitting || !eventDescription.trim()}
              className="bg-[#0000FF] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-3 transition-all shadow-lg shadow-blue-500/30"
            >
              <Sparkles size={20} />
              {isSubmitting ? "Analyzing..." : "Understand Requirements"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable Sidebar Item Component
function NavItem({
  icon,
  label,
  isActive = false,
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? "bg-slate-800 text-white font-medium shadow-sm border-l-2 border-blue-500"
          : "hover:bg-slate-800/50 hover:text-slate-300"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </a>
  );
}
