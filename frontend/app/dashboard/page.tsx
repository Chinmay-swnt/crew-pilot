"use client";

import React, { useEffect, useState } from "react";
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
  PlayCircle,
  UserPlus,
  ShieldCheck,
  PiggyBank,
  Radio,
  Zap,
} from "lucide-react";
import CreateEventModal from "@/components/EventForm";

// Types matching your expected Supabase schema
interface DashboardStats {
  upcomingEventsCount: number;
  activeEventsCount: number;
  totalCrewBooked: number;
  avgReliability: number;
  budgetSaved: string;
  budgetSavedPercent: string;
}

interface Recommendation {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  avatarUrl: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  dateRange: string;
  crewedCount: number;
  totalCrewNeeded: number;
}

export default function OrganizerDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // SUPABASE INTEGRATION POINT:
        // const { data: statsData } = await supabase.from('organizer_stats').select('*').single();
        // const { data: recoData } = await supabase.from('recommendations').select('*').limit(3);
        // const { data: eventsData } = await supabase.from('events').select('*').order('start_date', { ascending: true }).limit(3);

        setStats({
          upcomingEventsCount: 3,
          activeEventsCount: 12,
          totalCrewBooked: 48,
          avgReliability: 97,
          budgetSaved: "₹1.2 L",
          budgetSavedPercent: "+15%",
        });

        setRecommendations([
          {
            id: "1",
            name: "Sarah J.",
            role: "Lead Rigger",
            matchScore: 98,
            avatarUrl:
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
          },
          {
            id: "2",
            name: "David M.",
            role: "A/V Tech",
            matchScore: 95,
            avatarUrl:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          },
          {
            id: "3",
            name: "Priya K.",
            role: "Event Coord.",
            matchScore: 92,
            avatarUrl:
              "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
          },
        ]);

        setUpcomingEvents([
          {
            id: "e1",
            title: "Tech Summit 2024",
            dateRange: "Oct 12 - 14, 2024",
            crewedCount: 18,
            totalCrewNeeded: 20,
          },
          {
            id: "e2",
            title: "Global Music Fest",
            dateRange: "Nov 05, 2024",
            crewedCount: 5,
            totalCrewNeeded: 45,
          },
          {
            id: "e3",
            title: "Corporate Retreat",
            dateRange: "Dec 01, 2024",
            crewedCount: 0,
            totalCrewNeeded: 12,
          },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

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

          <nav className="flex flex-col gap-1 px-3 mt-4">
            <NavItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              isActive
            />
            <NavItem icon={<Calendar size={18} />} label="Events" />
            <NavItem icon={<Users size={18} />} label="Crew" />
            <NavItem icon={<Sparkles size={18} />} label="Recommendations" />
            <NavItem icon={<FileText size={18} />} label="Bookings" />
            <NavItem icon={<BarChart2 size={18} />} label="Analytics" />
            <NavItem icon={<Settings size={18} />} label="Settings" />
          </nav>
        </div>

        <div className="px-3 pb-6 flex flex-col gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-600/30"
          >
            <Plus size={18} />
            Create Event
          </button>

          <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-1">
            <NavItem icon={<HelpCircle size={18} />} label="Support" />
            <NavItem icon={<LogOut size={18} />} label="Logout" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
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
              placeholder="Search events, crew, or skills..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors">
              <Radio size={20} />
            </button>
            <div className="relative">
              <button className="text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors">
                <Bell size={20} />
              </button>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 cursor-pointer ml-2">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* TITLE & ACTION */}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                OVERVIEW
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mt-1">
                Organizer Dashboard
              </h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md shadow-blue-600/20 transition-colors"
            >
              <Plus size={18} /> Create New Event
            </button>
          </div>

          {/* STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            <MetricCard
              icon={<Calendar className="text-slate-600" size={20} />}
              value={stats?.upcomingEventsCount}
              label="Upcoming Events"
            />
            <MetricCard
              icon={<PlayCircle className="text-blue-600" size={20} />}
              value={stats?.activeEventsCount}
              label="Active Events"
            />
            <MetricCard
              icon={<UserPlus className="text-slate-600" size={20} />}
              value={stats?.totalCrewBooked}
              label="Total Crew Booked"
            />
            <MetricCard
              icon={<ShieldCheck className="text-slate-600" size={20} />}
              value={`${stats?.avgReliability ?? 0}%`}
              label="Avg. Crew Reliability"
            />
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 flex flex-col justify-between relative">
              <div className="flex items-center justify-between">
                <PiggyBank className="text-blue-600" size={22} />
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {stats?.budgetSavedPercent}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-blue-700 block leading-tight">
                  {stats?.budgetSaved}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Budget Saved
                </span>
              </div>
            </div>
          </div>

          {/* TWO-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* RECENT RECOMMENDATIONS (2 COLS) */}
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Recent Recommendations
                  </h3>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendations.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-100 bg-slate-50/50 rounded-xl p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-full object-cover mb-3"
                    />
                    <h4 className="font-bold text-slate-900 text-base">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">{item.role}</p>
                    <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Zap size={12} className="fill-blue-600" />
                      {item.matchScore}% Match
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* UPCOMING EVENTS (1 COL) */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Calendar size={20} className="text-slate-700" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Upcoming Events
                  </h3>
                </div>

                <div className="space-y-3">
                  {upcomingEvents.map((event) => {
                    const ratio = event.crewedCount / event.totalCrewNeeded;
                    let badgeBg = "bg-blue-50 text-blue-700";
                    if (ratio < 0.2 && event.totalCrewNeeded > 0)
                      badgeBg = "bg-red-50 text-red-600";
                    if (event.crewedCount === 0)
                      badgeBg = "bg-slate-100 text-slate-600";

                    return (
                      <div
                        key={event.id}
                        className="p-4 border border-slate-100 bg-slate-50/40 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {event.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <Calendar size={12} />
                            {event.dateRange}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeBg}`}
                        >
                          Crewed: {event.crewedCount}/{event.totalCrewNeeded}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button className="w-full text-center text-blue-600 hover:text-blue-700 text-xs font-bold tracking-wider uppercase mt-6 py-2">
                VIEW FULL SCHEDULE
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL COMPONENT */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFindOptimalCrew={(data) => console.log("Matching crews for:", data)}
      />
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

function MetricCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value?: React.ReactNode;
  label: string;
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div>{icon}</div>
      <div className="mt-4">
        <span className="text-3xl font-extrabold text-slate-900 block leading-tight">
          {value ?? 0}
        </span>
        <span className="text-xs text-slate-500 font-medium">{label}</span>
      </div>
    </div>
  );
}
