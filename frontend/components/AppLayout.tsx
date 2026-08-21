"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide sidebar completely on the Hero / Landing page
  if (pathname === "/") {
    return <>{children}</>;
  }

  // Show sidebar on all other pages
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
