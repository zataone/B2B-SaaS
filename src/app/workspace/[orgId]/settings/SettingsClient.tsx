"use client";

import React from "react";
import { Settings, ShieldAlert, Building, Calendar, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import SettingsForm from "./SettingsForm";

interface SettingsClientProps {
  orgId: string;
  isAdmin: boolean;
  orgName: string;
  slug: string;
  createdAt: Date | string;
  role: string;
}

export default function SettingsClient({
  orgId,
  isAdmin,
  orgName,
  slug,
  createdAt,
  role,
}: SettingsClientProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 font-sans"
    >
      {/* Title */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight text-white">Pengaturan Workspace</h1>
        <p className="text-sm text-slate-450 mt-1">
          Kelola informasi organisasi dan konfigurasi workspace global Anda.
        </p>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Organization Details */}
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-2xl p-6 shadow-xl shadow-black/10 space-y-6"
        >
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building className="h-4.5 w-4.5 text-blue-400" />
            Informasi Workspace
          </h3>

          <div className="space-y-4 text-sm">
            {/* Slug */}
            <div className="flex items-center gap-3">
              <div className="h-8.5 w-8.5 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                <LinkIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Workspace Slug</p>
                <p className="text-xs text-slate-300 font-mono truncate">{slug}</p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-center gap-3">
              <div className="h-8.5 w-8.5 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Tanggal Dibuat</p>
                <p className="text-xs text-slate-300 font-medium">
                  {new Date(createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Role / Access Level */}
            <div className="flex items-center gap-3">
              <div className="h-8.5 w-8.5 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                <Settings className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-455 uppercase tracking-widest">Hak Akses Anda</p>
                <p className="text-xs text-blue-400 font-extrabold uppercase tracking-wider">{role}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Edit settings form (takes 2 columns) */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 glass-card rounded-2xl p-6 shadow-xl shadow-black/10"
        >
          <h3 className="text-base font-bold text-white mb-6">Ubah Profil Organisasi</h3>

          {isAdmin ? (
            /* Jika ADMIN, tampilkan form interaktif */
            <SettingsForm
              orgId={orgId}
              currentName={orgName}
            />
          ) : (
            /* Jika BUKAN ADMIN (Manager/Staff), sembunyikan form dan tampilkan mode read-only */
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">
                  Nama Organisasi / Perusahaan
                </label>
                <input
                  type="text"
                  disabled
                  value={orgName}
                  className="w-full h-10 glass-input rounded-xl px-3.5 text-slate-500 text-xs outline-none cursor-not-allowed opacity-60"
                />
              </div>

              {/* Warning banner */}
              <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 flex items-start gap-3">
                <ShieldAlert className="h-4.5 w-4.5 text-slate-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-normal font-semibold">
                  Anda masuk sebagai <strong className="text-slate-400">{role}</strong>. Hanya anggota dengan peran **Admin** yang memiliki wewenang untuk mengubah pengaturan nama organisasi.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
