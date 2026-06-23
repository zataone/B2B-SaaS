import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderOpen,
  FileText,
} from "lucide-react";
import AddProjectDialog from "./AddProjectDialog";

interface ProjectsPageProps {
  params: Promise<{ orgId: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function ProjectsPage({ params, searchParams }: ProjectsPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const orgId = resolvedParams.orgId;
  const statusFilter = resolvedSearchParams.status || "ALL";

  // 1. Verifikasi user dan roles untuk client-side RBAC
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: user.userId,
        organizationId: orgId,
      },
    },
  });

  if (!membership) {
    redirect("/workspace/select");
  }

  const isStaff = membership.role === "STAFF";

  // 2. Fetch proyek dari database dengan filter status
  const projects = await prisma.project.findMany({
    where: {
      organizationId: orgId,
      ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  // Ambil total data untuk menghitung badge jumlah filter
  const allProjects = await prisma.project.findMany({
    where: { organizationId: orgId },
  });

  const counts = {
    ALL: allProjects.length,
    PLANNING: allProjects.filter((p) => p.status === "PLANNING").length,
    IN_PROGRESS: allProjects.filter((p) => p.status === "IN_PROGRESS").length,
    COMPLETED: allProjects.filter((p) => p.status === "COMPLETED").length,
    ON_HOLD: allProjects.filter((p) => p.status === "ON_HOLD").length,
  };

  // Helper formatting status badge
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Selesai",
          classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: CheckCircle2,
        };
      case "IN_PROGRESS":
        return {
          label: "Berjalan",
          classes: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
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

  return (
    <div className="space-y-8 font-sans">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Manajemen Proyek</h1>
          <p className="text-sm text-slate-400 mt-1">Kelola dan pantau seluruh status proyek kolaboratif organisasi Anda.</p>
        </div>
        {/* HANYA TAMPILKAN TOMBOL JIKA BUKAN STAFF (RBAC) */}
        {!isStaff ? (
          <AddProjectDialog orgId={orgId} />
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-500 font-medium">
            🔒 Mode View-Only (Staff)
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-900 pb-3">
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
              className={`h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                isActive
                  ? "bg-slate-900 border border-slate-800 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>{labelMap[filter]}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isActive ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-500"
                }`}
              >
                {counts[filter]}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Grid of Projects */}
      {projects.length === 0 ? (
        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl py-16 px-4 text-center">
          <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 mx-auto mb-4">
            <FolderOpen className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">Tidak Ada Proyek</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
            Tidak ada proyek yang sesuai dengan kriteria filter saat ini. Silakan tambahkan proyek baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const config = getStatusConfig(project.status);
            const StatusIcon = config.icon;

            return (
              <div
                key={project.id}
                className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between hover:border-slate-800 transition-all relative overflow-hidden group"
              >
                {/* Glowing border hover */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Status Badge */}
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.classes}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium font-mono">
                      #{project.id.slice(-6)}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white leading-tight mb-2">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {project.description || "Tidak ada deskripsi yang ditambahkan untuk proyek ini."}
                  </p>
                </div>

                {/* Footer details */}
                <div className="border-t border-slate-900/80 pt-4 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    <span>Workspace Project</span>
                  </div>
                  <span>
                    Dibuat:{" "}
                    {new Date(project.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
