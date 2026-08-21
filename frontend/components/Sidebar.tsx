"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

interface SidebarProps {
  onCreateEvent?: () => void;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Crew", href: "/crew", icon: Users },
  { label: "Recommendations", href: "/recommendations", icon: Sparkles },
  { label: "Bookings", href: "/bookings", icon: FileText },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ onCreateEvent }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0B132B] text-slate-400 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* LOGO */}
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

        {/* DYNAMIC NAV LINKS */}
        <nav className="flex flex-col gap-1 px-3 mt-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            // Checks if current path matches item route
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white font-medium shadow-sm border-l-2 border-blue-500"
                    : "hover:bg-slate-800/50 hover:text-slate-300"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="px-3 pb-6 flex flex-col gap-4">
        {onCreateEvent && (
          <button
            onClick={onCreateEvent}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-600/30"
          >
            <Plus size={18} />
            Create Event
          </button>
        )}

        <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-1">
          <Link
            href="/support"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/support"
                ? "bg-slate-800 text-white font-medium"
                : "hover:bg-slate-800/50 hover:text-slate-300"
            }`}
          >
            <HelpCircle size={18} />
            <span className="text-sm">Support</span>
          </Link>

          <button
            onClick={() => console.log("Logout triggered")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/50 hover:text-slate-300 transition-colors w-full text-left"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
