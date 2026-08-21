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
  Radio,
  Shield,
  CheckCircle2,
  Hourglass,
  Star,
  UserPlus,
  Repeat,
} from "lucide-react";

interface CrewMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  backupFor?: string;
}

export default function CrewPage() {
  const [isBackupActive, setIsBackupActive] = useState(false);

  // Mock initial state structured for backend integration
  const primaryCrew: CrewMember[] = [
    {
      id: "p1",
      name: "Rahul Sharma",
      role: "Lead Coordinator",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "p2",
      name: "Sameer Patel",
      role: "A/V Technician",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "p3",
      name: "Vikram Singh",
      role: "Stage Manager",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    },
  ];

  const backupCrew: CrewMember[] = [
    {
      id: "b1",
      name: "Arjun Verma",
      role: "Backup for Rahul",
      backupFor: "Rahul",
      avatarUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "b2",
      name: "Rohan Gupta",
      role: "Backup for Sameer",
      backupFor: "Sameer",
      avatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "b3",
      name: "DJ Aryan",
      role: "Backup for Vikram",
      backupFor: "Vikram",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0B132B] text-slate-400 flex flex-col justify-between shrink-0">
        <div>
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

          <div className="px-3 mb-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors shadow-md">
              <Plus size={18} />
              Create Event
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-3 mt-4">
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavItem icon={<Calendar size={18} />} label="Events" />
            <NavItem icon={<Users size={18} />} label="Crew" isActive />
            <NavItem icon={<Sparkles size={18} />} label="Recommendations" />
            <NavItem icon={<FileText size={18} />} label="Bookings" />
            <NavItem icon={<BarChart2 size={18} />} label="Analytics" />
            <NavItem icon={<Settings size={18} />} label="Settings" />
          </nav>
        </div>

        <div className="px-3 pb-6 flex flex-col gap-1 border-t border-slate-800/80 pt-4">
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
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors">
                <Bell size={20} />
              </button>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <button className="text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors">
              <Radio size={20} />
            </button>
            <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 cursor-pointer ml-2">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                alt="User Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* PAGE BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Crew</span>
            <span>&gt;</span>
            <span className="text-slate-700">Risk Mitigation</span>
          </div>

          {/* PAGE TITLE & HEADER ACTIONS */}
          <div className="flex items-start justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Protection Against Last-Minute Cancellations
                </h2>
                <Shield
                  className="text-purple-600 fill-purple-600/20 shrink-0"
                  size={24}
                />
              </div>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Ensure event continuity with pre-vetted, high-match backup
                personnel ready for immediate deployment.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm">
                View Backup Details
              </button>
              <button
                onClick={() => setIsBackupActive(!isBackupActive)}
                className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors"
              >
                <Shield size={16} />
                {isBackupActive
                  ? "Protection Active"
                  : "Activate Backup Protection"}
              </button>
            </div>
          </div>

          {/* CREW COMPARISON GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PRIMARY CREW CARD */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                      <CheckCircle2 size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Primary Crew
                    </h3>
                  </div>
                  <span className="bg-blue-50 text-blue-600 border border-blue-100 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={12} className="fill-blue-600" />
                    Selected
                  </span>
                </div>

                {/* METRICS ROW */}
                <div className="grid grid-cols-3 gap-2 py-4 mb-6 border-y border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block mb-1">
                      Match Score
                    </span>
                    <span className="text-2xl font-extrabold text-blue-600">
                      94%
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block mb-1">
                      Estimated Cost
                    </span>
                    <span className="text-2xl font-extrabold text-slate-800">
                      ₹86.5k
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block mb-1">
                      Reliability Index
                    </span>
                    <span className="text-2xl font-extrabold text-blue-700">
                      97%
                    </span>
                  </div>
                </div>

                {/* CREW LIST */}
                <div className="space-y-3">
                  {primaryCrew.map((member) => (
                    <div
                      key={member.id}
                      className="p-3.5 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {member.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <div className="text-blue-600">
                        <CheckCircle2
                          size={20}
                          className="fill-blue-50 text-blue-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BACKUP CREW CARD */}
            <div className="bg-slate-50/40 border-2 border-dashed border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-slate-200 text-slate-600 p-1.5 rounded-lg">
                      <UserPlus size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">
                      Backup Crew
                    </h3>
                  </div>
                  <span className="bg-slate-100 text-slate-500 border border-slate-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Hourglass size={12} />
                    Standby
                  </span>
                </div>

                {/* METRICS ROW */}
                <div className="grid grid-cols-3 gap-2 py-4 mb-6 border-y border-slate-200/60">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block mb-1">
                      Match Score
                    </span>
                    <span className="text-2xl font-extrabold text-slate-600">
                      89%
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block mb-1">
                      Estimated Cost
                    </span>
                    <span className="text-2xl font-extrabold text-slate-700">
                      ₹91.0k
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block mb-1">
                      Reliability Index
                    </span>
                    <span className="text-2xl font-extrabold text-slate-600">
                      94%
                    </span>
                  </div>
                </div>

                {/* BACKUP CREW LIST */}
                <div className="space-y-3">
                  {backupCrew.map((member) => (
                    <div
                      key={member.id}
                      className="p-3.5 border border-slate-200/80 bg-white rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-11 h-11 rounded-full object-cover grayscale"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-800 text-sm">
                              {member.name}
                            </h4>
                            <Repeat size={12} className="text-slate-400" />
                          </div>
                          <p className="text-xs text-slate-400 font-medium">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <div className="text-slate-300">
                        <Hourglass size={18} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI RISK ASSESSMENT FOOTER BANNER */}
          <div className="bg-purple-50/50 border-l-4 border-purple-600 rounded-xl p-5 border border-purple-100/80 flex items-start gap-4">
            <div className="bg-purple-100 text-purple-700 p-2 rounded-lg shrink-0 mt-0.5">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                AI Risk Assessment
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Historical data indicates a 12% probability of a lead
                coordinator cancellation in this region during peak season.
                Activating backup protection reduces operational downtime risk
                to &lt;1%.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

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
