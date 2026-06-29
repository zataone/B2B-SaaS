"use client";

import React, { useActionState } from "react";
import { registerAction } from "@/app/actions/auth";
import Link from "next/link";
import { Mail, Lock, User, Briefcase, ArrowRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/15 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md px-6 py-12 z-10">
        {/* Brand Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">SaaS Workspace</h2>
          <p className="text-slate-400 mt-2 text-sm text-center">
            Mulai kelola tim, proyek, dan keuangan perusahaan Anda
          </p>
        </motion.div>

        {/* Card Form */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card rounded-2xl p-8 shadow-2xl"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Daftar Akun Baru</h3>

          <form action={formAction} className="space-y-4">
            {/* Error Message */}
            {state && !state.success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 font-medium"
              >
                {state.message}
              </motion.div>
            )}

            {/* Nama Lengkap Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  className="w-full glass-input rounded-xl py-2.5 pl-11 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Email Perusahaan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@company.com"
                  className="w-full glass-input rounded-xl py-2.5 pl-11 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Company Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Nama Organisasi (Perusahaan)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="companyName"
                  required
                  placeholder="Alfa Corp / Beta Inc"
                  className="w-full glass-input rounded-xl py-2.5 pl-11 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                  className="w-full glass-input rounded-xl py-2.5 pl-11 pr-4 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer mt-3"
            >
              {isPending ? (
                <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Daftar & Masuk Workspace
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footnote */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Sudah memiliki akun?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
