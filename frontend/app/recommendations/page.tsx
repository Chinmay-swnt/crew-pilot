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
  Bell,
  Radio,
  SlidersHorizontal,
  RotateCcw,
  MapPin,
  Lightbulb,
  ArrowDown,
} from "lucide-react";

export default function RecommendationsPage() {
  // Optimization Parameters State
  const [budget, setBudget] = useState(100000);
  const [reliabilityPriority, setReliabilityPriority] = useState(2); // 0: Low, 1: Med, 2: High
  const [qualityPriority, setQualityPriority] = useState(1);
  const [distancePriority, setDistancePriority] = useState(2);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const priorityLabels = ["Low", "Med", "High"];

  const handleReset = () => {
    setBudget(100000);
    setReliabilityPriority(2);
    setQualityPriority(1);
    setDistancePriority(2);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    // CONNECT TO BACKEND / AI ENGINE HERE
    setTimeout(() => setIsOptimizing(false), 800);
  };

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
            <NavItem icon={<Users size={18} />} label="Crew" />
            <NavItem
              icon={<Sparkles size={18} />}
              label="Recommendations"
              isActive
            />
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
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-8 gap-4 shrink-0">
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
        </header>

        {/* PAGE BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* TITLE & EVENT INFO */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                What–If Optimization
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Fine-tune the AI recommendation parameters to balance cost,
                quality, and logistics.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
              <MapPin size={14} className="text-slate-500" />
              <span>Event: Global Tech Summit 2024</span>
            </div>
          </div>

          {/* MAIN TWO-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: OPTIMIZATION PARAMETERS */}
            <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2.5">
                    <SlidersHorizontal size={20} className="text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Optimization Parameters
                    </h3>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                    title="Reset Parameters"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>

                <div className="space-y-7">
                  {/* SLIDER 1: MAXIMUM BUDGET */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Maximum Budget
                      </label>
                      <span className="text-xl font-extrabold text-blue-600">
                        ₹{budget.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50000}
                      max={150000}
                      step={5000}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mt-1">
                      <span>₹50K</span>
                      <span>₹150K</span>
                    </div>
                  </div>

                  {/* SLIDER 2: RELIABILITY PRIORITY */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <span>Reliability Priority</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">
                        {priorityLabels[reliabilityPriority]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2}
                      step={1}
                      value={reliabilityPriority}
                      onChange={(e) =>
                        setReliabilityPriority(Number(e.target.value))
                      }
                      className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mt-1">
                      <span>Low</span>
                      <span>Med</span>
                      <span>High</span>
                    </div>
                  </div>

                  {/* SLIDER 3: QUALITY PRIORITY */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <span>Quality Priority</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">
                        {priorityLabels[qualityPriority]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2}
                      step={1}
                      value={qualityPriority}
                      onChange={(e) =>
                        setQualityPriority(Number(e.target.value))
                      }
                      className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mt-1">
                      <span>Low</span>
                      <span>Med</span>
                      <span>High</span>
                    </div>
                  </div>

                  {/* SLIDER 4: DISTANCE PRIORITY */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <span>Distance Priority</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">
                        {priorityLabels[distancePriority]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2}
                      step={1}
                      value={distancePriority}
                      onChange={(e) =>
                        setDistancePriority(Number(e.target.value))
                      }
                      className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mt-1">
                      <span>Low</span>
                      <span>Med</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="w-full mt-8 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
              >
                <RotateCcw
                  size={18}
                  className={isOptimizing ? "animate-spin" : ""}
                />
                {isOptimizing ? "Optimizing..." : "Re-Optimize Team"}
              </button>
            </div>

            {/* RIGHT COLUMN: IMPACT ANALYSIS & VISUALIZATION */}
            <div className="lg:col-span-7 space-y-6">
              {/* IMPACT ANALYSIS CARD */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <BarChart2 size={20} className="text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Impact Analysis
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  {/* BEFORE CARD */}
                  <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      <span className="text-xs font-bold text-slate-600">
                        Current Plan (Before)
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Match Score
                        </span>
                        <span className="text-2xl font-extrabold text-slate-800">
                          94%
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Est. Cost
                        </span>
                        <span className="text-2xl font-extrabold text-slate-800">
                          ₹86,500
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AFTER CARD */}
                  <div className="bg-blue-50/40 border border-blue-200/80 rounded-xl p-4 relative">
                    <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                      PROJECTED
                    </span>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span className="text-xs font-bold text-blue-900">
                        New Scenario (After)
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Match Score
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-2xl font-extrabold text-slate-900">
                            89%
                          </span>
                          <ArrowDown size={14} className="text-slate-500" />
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Est. Cost
                        </span>
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-2xl font-extrabold text-blue-700">
                            ₹69,500
                          </span>
                          <ArrowDown size={14} className="text-emerald-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* INSIGHT BANNER */}
                <div className="bg-purple-50/50 border-l-4 border-purple-600 rounded-xl p-4 border border-purple-100/80 flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-700 p-1.5 rounded-lg shrink-0 mt-0.5">
                    <Lightbulb size={18} />
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <strong className="text-purple-900 font-bold">
                      ₹17,000 saved
                    </strong>{" "}
                    by replacing two higher-cost candidates with qualified
                    nearby alternatives. Distance priority settings
                    significantly reduced travel stipends.
                  </p>
                </div>
              </div>

              {/* RADAR / TRADE-OFF VISUALIZATION */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Trade-off Visualization
                </h3>

                <div className="relative w-full h-64 flex items-center justify-center border border-slate-100 bg-slate-50/30 rounded-xl p-4">
                  {/* SVG RADAR SPIDER CHART */}
                  <svg
                    className="w-full h-full max-w-sm max-h-56"
                    viewBox="0 0 300 240"
                  >
                    {/* Grid Background Rings */}
                    <polygon
                      points="150,20 250,120 150,220 50,120"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="1"
                    />
                    <polygon
                      points="150,50 215,120 150,190 85,120"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="1"
                    />
                    <polygon
                      points="150,80 180,120 150,160 120,120"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="1"
                    />

                    {/* Axis Lines */}
                    <line
                      x1="150"
                      y1="20"
                      x2="150"
                      y2="220"
                      stroke="#CBD5E1"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                    <line
                      x1="50"
                      y1="120"
                      x2="250"
                      y2="120"
                      stroke="#CBD5E1"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />

                    {/* Axis Labels */}
                    <text
                      x="150"
                      y="12"
                      fill="#64748B"
                      fontSize="10"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Quality
                    </text>
                    <text
                      x="258"
                      y="123"
                      fill="#64748B"
                      fontSize="10"
                      textAnchor="start"
                      fontWeight="bold"
                    >
                      Cost Savings
                    </text>
                    <text
                      x="150"
                      y="235"
                      fill="#64748B"
                      fontSize="10"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Distance
                    </text>
                    <text
                      x="42"
                      y="123"
                      fill="#64748B"
                      fontSize="10"
                      textAnchor="end"
                      fontWeight="bold"
                    >
                      Reliability
                    </text>

                    {/* Current Plan Polygon (Dashed Line) */}
                    <polygon
                      points="150,35 220,120 150,180 75,120"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                    />

                    {/* Projected Plan Polygon (Solid Fill & Border) */}
                    <polygon
                      points="150,60 240,120 150,200 90,120"
                      fill="rgba(37, 99, 235, 0.2)"
                      stroke="#2563EB"
                      strokeWidth="2.5"
                    />
                  </svg>

                  {/* LEGEND */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-6 text-xs font-semibold text-slate-600 bg-white px-4 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-0 border-t-2 border-dashed border-slate-400"></span>
                      <span>Current Plan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-0 border-t-2 border-blue-600"></span>
                      <span className="text-blue-900 font-bold">
                        Projected Plan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
