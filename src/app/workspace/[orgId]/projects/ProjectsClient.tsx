"use client";

import React from "react";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderOpen,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import AddProjectDialog from "./AddProjectDialog";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string | Date;
}

interface ProjectsClientProps {
  orgId: string;
  isStaff: boolean;
  projects: Project[];
  statusFilter: string;
  counts: Record<string, number>;
}

export default function ProjectsClient({
  orgId,
  isStaff,
  projects,
  statusFilter,
  counts,
}: ProjectsClientProps) {
  // Helper formatting status badge
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Selesai",
          classes: "bg-emerald-500/10 text-emerald-450 border-emerald-500/20",
          icon: CheckCircle2,
        };
      case "IN_PROGRESS":
        return {
          label: "Berjalan",
          classes: "bg-yellow-500/10 text-yellow-450 border-yellow-500/20",
          icon: Clock,
        };
      case "ON_HOLD":
        return {
          label: "Ditunda",
          classes: "bg-red-500/10 text-red-400 border-red-500/20",
          icon: AlertTriangle,
        };
      default:
        return {
          label: "Perencanaan",
          classes: "bg-slate-500/10 text-slate-400 border-slate-500/20",
          icon: FileText,
        };
    }
  };

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
      {/* Header section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Manajemen Proyek</h1>
          <p className="text-sm text-slate-450 mt-1">Kelola dan pantau seluruh status proyek kolaboratif organisasi Anda.</p>
        </div>
        {/* HANYA TAMPILKAN TOMBOL JIKA BUKAN STAFF (RBAC) */}
        {!isStaff ? (
          <AddProjectDialog orgId={orgId} />
        ) : (
          <div className="glass-card rounded-xl px-4 py-2 text-xs text-slate-500 font-bold backdrop-blur">
            🔒 Mode View-Only (Staff)
          </div>
        )}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap items-center gap-1.5 border-b border-white/5 pb-3"
      >
        {(["ALL", "PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"] as const).map((filter) => {
          const isActive = statusFilter === filter;
          const labelMap = {
            ALL: "Semua Proyek",
            PLANNING: "Perencanaan",
            IN_PROGRESS: "Berjalan",
            COMPLETED: "Selesai",
            ON_HOLD: "Ditunda",
          };

          return (
            <Link
              key={filter}
              href={`/workspace/${orgId}/projects?status=${filter}`}
              className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all relative cursor-pointer ${
                isActive ? "text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterTab"
                  className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="z-10">{labelMap[filter]}</span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md z-10 transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-500"
                }`}
              >
                {counts[filter]}
              </span>
            </Link>
          );
        })}
      </motion.div>

      {/* Grid of Projects */}
      {projects.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-2xl py-16 px-4 text-center shadow-xl shadow-black/10"
        >
          <div className="h-12 w-12 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 mx-auto mb-4">
            <FolderOpen className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Tidak Ada Proyek</h3>
          <p className="text-xs text-slate-450 max-w-xs mx-auto mt-2 leading-relaxed">
            Tidak ada proyek yang sesuai dengan kriteria filter saat ini. Silakan tambahkan proyek baru.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => {
            const config = getStatusConfig(project.status);
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -4, borderColor: "rgba(3, 105, 161, 0.3)" }}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-xl shadow-black/10"
              >
                {/* Glowing border hover */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* Status Badge */}
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.classes}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold font-mono">
                      #{project.id.slice(-6)}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white leading-tight mb-2 group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {project.description || "Tidak ada deskripsi yang ditambahkan untuk proyek ini."}
                  </p>
                </div>

                {/* Footer details */}
                <div className="border-t border-white/5 pt-4 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1 font-semibold">
                    <Briefcase className="h-3 w-3" />
                    <span>Workspace Project</span>
                  </div>
                  <span className="font-medium">
                    Dibuat:{" "}
                    {new Date(project.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
