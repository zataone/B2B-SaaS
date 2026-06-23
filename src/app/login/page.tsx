"use client";

import React, { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Activity } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/20 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md px-6 py-12 z-10">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">SaaS Workspace</h2>
          <p className="text-slate-400 mt-2 text-sm text-center">
            Sistem Multi-Tenant Workspace & Keuangan Perusahaan
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Masuk ke Akun Anda</h3>

          <form action={formAction} className="space-y-5">
            {/* Error Message */}
            {state && !state.success && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3">
                {state.message}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Email Perusahaan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Lupa password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isPending ? (
                <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Masuk Workspace
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Seed accounts helper for user */}
          <div className="mt-6 border-t border-slate-800/80 pt-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Akun Uji Coba (Password: password123):
            </span>
            <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-500 font-mono">
              <div>👨‍💼 <span className="text-slate-400">admin@alfa.com</span> (Admin Alfa)</div>
              <div>🧑‍💻 <span className="text-slate-400">manager@alfa.com</span> (Manager Alfa)</div>
              <div>🧑‍🔧 <span className="text-slate-400">staff@alfa.com</span> (Staff Alfa)</div>
              <div>🏢 <span className="text-slate-400">admin@beta.com</span> (Beta Inc Workspace)</div>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Belum memiliki organisasi?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
            Daftar Baru
          </Link>
        </p>
      </div>
    </div>
  );
}
