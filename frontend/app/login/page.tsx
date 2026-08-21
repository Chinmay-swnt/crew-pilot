"use client"

import { useState } from "react";
import { Sparkles, Mail, Lock, User, Users, Briefcase, Eye, EyeOff } from "lucide-react";

type Mode = "login" | "signup";
type Role = "crew" | "manager";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("manager");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ mode, role, name, email, password });
  };

  return (
    <div className="min-h-screen bg-[#f5f6fb] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" fill="currentColor" />
          <span className="font-semibold text-lg text-slate-900">CrewPilot</span>
        </div>
        <a href="#" className="text-sm text-slate-500 hover:text-slate-800 transition">
          Back to home
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3" fill="currentColor" />
              AI-POWERED STAFFING
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            {/* Title */}
            <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-slate-500 text-center mb-6">
              {mode === "login"
                ? "Log in to manage your crews and events."
                : "Join CrewPilot as a crew member or event manager."}
            </p>

            {/* Mode Tabs */}
            <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 text-sm font-medium py-2 rounded-md transition ${
                  mode === "login"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 text-sm font-medium py-2 rounded-md transition ${
                  mode === "signup"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setRole("manager")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
                  role === "manager"
                    ? "border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    role === "manager" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-800">Event Manager</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("crew")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
                  role === "crew"
                    ? "border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    role === "crew" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-800">Crew Member</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jordan Smith"
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-600">Password</label>
                  {mode === "login" && (
                    <a href="#" className="text-xs text-indigo-600 hover:underline">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 mt-2"
              >
                {mode === "login"
                  ? "Log In"
                  : `Create Account as ${role === "manager" ? "Manager" : "Crew Member"}`}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setMode("signup")}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            By continuing, you agree to CrewPilot's Terms & Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  );
}