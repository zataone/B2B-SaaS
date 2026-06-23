import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, ShieldAlert, Building, Calendar, Link as LinkIcon } from "lucide-react";
import SettingsForm from "./SettingsForm";

interface SettingsPageProps {
  params: Promise<{ orgId: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const resolvedParams = await params;
  const orgId = resolvedParams.orgId;

  // 1. Verifikasi User & Peran
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
    include: {
      organization: true,
    },
  });

  if (!membership) {
    redirect("/workspace/select");
  }

  const isAdmin = membership.role === "ADMIN";

  return (
    <div className="space-y-8 font-sans">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Pengaturan Workspace</h1>
        <p className="text-sm text-slate-400 mt-1">
          Kelola informasi organisasi dan konfigurasi workspace global Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Organization Details */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm space-y-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Building className="h-4.5 w-4.5 text-blue-400" />
            Informasi Workspace
          </h3>

          <div className="space-y-4 text-sm">
            {/* Slug */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <LinkIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Workspace Slug</p>
                <p className="text-xs text-slate-300 font-mono truncate">{membership.organization.slug}</p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tanggal Dibuat</p>
                <p className="text-xs text-slate-300">
                  {new Date(membership.organization.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Total Members */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <Settings className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hak Akses Anda</p>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">{membership.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit settings form (takes 2 columns) */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-base font-semibold text-white mb-6">Ubah Profil Organisasi</h3>

          {isAdmin ? (
            /* Jika ADMIN, tampilkan form interaktif */
            <SettingsForm
              orgId={orgId}
              currentName={membership.organization.name}
            />
          ) : (
            /* Jika BUKAN ADMIN (Manager/Staff), sembunyikan form dan tampilkan mode read-only */
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Nama Organisasi / Perusahaan
                </label>
                <input
                  type="text"
                  disabled
                  value={membership.organization.name}
                  className="w-full h-10 bg-slate-950/60 border border-slate-900 rounded-xl px-3.5 text-slate-500 text-xs outline-none cursor-not-allowed"
                />
              </div>

              {/* Warning banner */}
              <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-4 flex items-start gap-3">
                <ShieldAlert className="h-4.5 w-4.5 text-slate-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-normal">
                  Anda masuk sebagai <strong className="text-slate-400">{membership.role}</strong>. Hanya anggota dengan peran **Admin** yang memiliki wewenang untuk mengubah pengaturan nama organisasi.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
