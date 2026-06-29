import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Building, Plus, ArrowRight, User } from "lucide-react";
import OrgCreationForm from "./OrgCreationForm";
import WorkspaceList from "./WorkspaceList";

export default async function SelectWorkspacePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Dapatkan daftar organisasi yang diikuti user dari database langsung
  const memberships = await prisma.organizationMember.findMany({
    where: { userId: user.userId },
    include: { organization: true },
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans text-white">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/15 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md px-6 py-12 z-10">
        {/* User Profile Info */}
        <div className="flex items-center gap-3 glass-card rounded-xl p-4 mb-8 backdrop-blur">
          <div className="h-10 w-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-355 shadow">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Masuk Sebagai</p>
            <p className="text-sm font-bold truncate text-white">{user.name}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-2 text-center text-white">Pilih Workspace Anda</h2>
        <p className="text-slate-400 text-sm text-center mb-8">
          Pilih organisasi yang ingin Anda akses atau buat organisasi baru di bawah ini.
        </p>

        {/* List of Workspaces */}
        <div className="mb-8">
          <WorkspaceList memberships={memberships} />
        </div>

        {/* Divider */}
        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-slate-900"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-slate-600 uppercase tracking-widest">Atau</span>
          <div className="flex-grow border-t border-slate-900"></div>
        </div>

        {/* Create new Workspace form */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4 text-blue-400" />
            Buat Organisasi Baru
          </h3>
          <OrgCreationForm />
        </div>
      </div>
    </div>
  );
}
