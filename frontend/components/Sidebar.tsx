"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Rocket,
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  UserCheck,
  BriefcaseBusiness,
  Wrench,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Events",
    href: "/events",
    icon: CalendarDays,
  },
  {
    label: "Crew",
    href: "/crew",
    icon: Users,
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: ClipboardList,
  },
  {
    label: "Recommendations",
    href: "/recommendations",
    icon: UserCheck,
  },
  {
    label: "Roles",
    href: "/roles",
    icon: BriefcaseBusiness,
  },
  {
    label: "Skills",
    href: "/skills",
    icon: Wrench,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-[#17212b] text-slate-300">
      {/* Brand */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-700/70 px-6">
        <div className="flex h-9 w-9 items-center justify-center bg-[#d9a441] text-[#17212b]">
          <Rocket size={19} strokeWidth={2} />
        </div>

        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            CrewPilot
          </h1>

          <p className="text-xs text-slate-400">
            Crew operations
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Workspace
        </p>

        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200",
                ].join(" ")}
              >
                <Icon size={17} strokeWidth={1.8} />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-700/70 px-3 py-4">
        <button
          type="button"
          onClick={() => console.log("Logout triggered")}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
        >
          <LogOut size={17} strokeWidth={1.8} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}