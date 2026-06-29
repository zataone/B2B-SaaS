"use client";

import React from "react";
import { Users, Mail, Clock, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import AddMemberDialog from "./AddMemberDialog";
import RoleSelector from "./RoleSelector";

interface Member {
  id: string;
  userId: string;
  role: string;
  createdAt: string | Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface MembersClientProps {
  orgId: string;
  isAdmin: boolean;
  members: Member[];
  currentUserId: string;
}

export default function MembersClient({
  orgId,
  isAdmin,
  members,
  currentUserId,
}: MembersClientProps) {
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Anggota Tim</h1>
          <p className="text-sm text-slate-450 mt-1">
            Kelola hak akses dan peran kolaborator dalam workspace organisasi Anda.
          </p>
        </div>
        {/* TAMPILKAN TOMBOL JIKA ADMIN (RBAC) */}
        {isAdmin ? (
          <AddMemberDialog orgId={orgId} />
        ) : (
          <div className="glass-card rounded-xl px-4 py-2 text-xs text-slate-500 font-bold backdrop-blur">
            🔒 Edit Terbatas (Hanya Admin)
          </div>
        )}
      </motion.div>

      {/* Members List Card */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-6 shadow-xl shadow-black/10"
      >
        <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
          <Users className="h-4.5 w-4.5 text-blue-400" />
          Daftar Kolaborator ({members.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-450 text-xs font-bold uppercase tracking-widest">
                <th className="pb-3.5">Nama</th>
                <th className="pb-3.5">Email</th>
                <th className="pb-3.5">Tanggal Bergabung</th>
                <th className="pb-3.5 text-right font-bold">Peran / Otorisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((m) => {
                const isSelf = m.userId === currentUserId;

                return (
                  <tr key={m.id} className="text-slate-300 hover:bg-white/5 transition-all duration-150">
                    {/* Nama */}
                    <td className="py-4 font-semibold text-white flex items-center gap-3">
                      <div className="h-8.5 w-8.5 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-xs text-slate-300 uppercase shrink-0">
                        {m.user.name.slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">
                          {m.user.name} {isSelf && <span className="text-[10px] text-blue-450 font-bold ml-1">(Anda)</span>}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        <span>{m.user.email}</span>
                      </div>
                    </td>

                    {/* Tanggal Gabung */}
                    <td className="py-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 font-medium">
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
      </motion.div>

      {/* Info RBAC Banner */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-5 flex items-start gap-4 shadow-xl shadow-black/10"
      >
        <div className="h-9 w-9 rounded-lg bg-yellow-500/10 border border-yellow-500/15 flex items-center justify-center text-yellow-450 shrink-0">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="text-left">
          <h4 className="text-sm font-bold text-white">Ketentuan Kontrol Akses (RBAC)</h4>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-semibold">
            * **Admin** memiliki akses penuh untuk menambah anggota, mengubah peran anggota lain,
            dan mengatur informasi organisasi. <br />
            * **Manajer** memiliki wewenang penuh untuk membuat proyek dan mencatat data keuangan
            tetapi tidak dapat mengelola tim. <br />
            * **Staf** hanya memiliki hak akses baca (read-only) untuk memantau performa tanpa izin mengubah data.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
