import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, Mail, Clock, ShieldAlert } from "lucide-react";
import AddMemberDialog from "./AddMemberDialog";
import RoleSelector from "./RoleSelector";

interface MembersPageProps {
  params: Promise<{ orgId: string }>;
}

export default async function MembersPage({ params }: MembersPageProps) {
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
  });

  if (!membership) {
    redirect("/workspace/select");
  }

  const isAdmin = membership.role === "ADMIN";

  // 2. Fetch seluruh anggota organisasi
  const members = await prisma.organizationMember.findMany({
    where: { organizationId: orgId },
    include: {
      user: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Anggota Tim</h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola hak akses dan peran kolaborator dalam workspace organisasi Anda.
          </p>
        </div>
        {/* TAMPILKAN TOMBOL JIKA ADMIN (RBAC) */}
        {isAdmin ? (
          <AddMemberDialog orgId={orgId} />
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-500 font-medium">
            🔒 Edit Terbatas (Hanya Admin)
          </div>
        )}
      </div>

      {/* Members List Card */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
          <Users className="h-4.5 w-4.5 text-blue-400" />
          Daftar Kolaborator ({members.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="pb-3">Nama</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Tanggal Bergabung</th>
                <th className="pb-3 text-right">Peran / Otorisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/50">
              {members.map((m) => {
                const isSelf = m.userId === user.userId;

                return (
                  <tr key={m.id} className="text-slate-300 hover:bg-slate-900/10">
                    {/* Nama */}
                    <td className="py-4 font-medium text-white flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300 uppercase shrink-0">
                        {m.user.name.slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">
                          {m.user.name} {isSelf && <span className="text-[10px] text-blue-400 ml-1">(Anda)</span>}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        <span>{m.user.email}</span>
                      </div>
                    </td>

                    {/* Tanggal Gabung */}
                    <td className="py-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span>
                          {new Date(m.createdAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Peran / Dropdown */}
                    <td className="py-4 text-right flex justify-end items-center">
                      <RoleSelector
                        orgId={orgId}
                        memberId={m.id}
                        currentRole={m.role}
                        isAdmin={isAdmin}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info RBAC Banner */}
      <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex items-start gap-4">
        <div className="h-9 w-9 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 shrink-0">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="text-left">
          <h4 className="text-sm font-semibold text-white">Ketentuan Kontrol Akses (RBAC)</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            * **Admin** memiliki akses penuh untuk menambah anggota, mengubah peran anggota lain,
            dan mengatur informasi organisasi. <br />
            * **Manajer** memiliki wewenang penuh untuk membuat proyek dan mencatat data keuangan
            tetapi tidak dapat mengelola tim. <br />
            * **Staf** hanya memiliki hak akses baca (read-only) untuk memantau performa tanpa izin mengubah data.
          </p>
        </div>
      </div>
    </div>
  );
}
