"use client";

import React, { useTransition, useState } from "react";
import { updateMemberRoleAction } from "@/app/actions/members";

interface RoleSelectorProps {
  orgId: string;
  memberId: string;
  currentRole: string;
  isAdmin: boolean; // Apakah pengguna yang sedang login adalah ADMIN?
}

export default function RoleSelector({
  orgId,
  memberId,
  currentRole,
  isAdmin,
}: RoleSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState(currentRole);

  const getRoleBadgeClasses = (roleName: string) => {
    switch (roleName.toUpperCase()) {
      case "ADMIN":
        return "bg-rose-500/10 border-rose-500/20 text-rose-450";
      case "MANAGER":
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      default:
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-450";
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    const oldRole = role;
    setRole(newRole);

    startTransition(async () => {
      const res = await updateMemberRoleAction(orgId, memberId, newRole);
      if (!res.success) {
        // Rollback ke role lama jika gagal
        setRole(oldRole);
        alert(`Gagal merubah peran: ${res.message}`);
      }
    });
  };

  // Jika yang melihat bukan ADMIN, tampilkan teks badge statis (RBAC client-side)
  if (!isAdmin) {
    const label = role === "ADMIN" ? "Admin" : role === "MANAGER" ? "Manager" : "Staff";
    return (
      <span
        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getRoleBadgeClasses(
          role
        )}`}
      >
        {label}
      </span>
    );
  }

  return (
    <div className="flex flex-col font-sans">
      <div className="relative flex items-center">
        <select
          value={role}
          disabled={isPending}
          onChange={handleRoleChange}
          className={`h-8 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border outline-none cursor-pointer transition-colors focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50 ${getRoleBadgeClasses(
            role
          )}`}
        >
          <option value="ADMIN" className="bg-slate-950 text-rose-400">Admin</option>
          <option value="MANAGER" className="bg-slate-950 text-blue-400">Manager</option>
          <option value="STAFF" className="bg-slate-950 text-emerald-405">Staff</option>
        </select>
        {isPending && (
          <span className="absolute right-[-18px] inline-block h-3 w-3 border-2 border-slate-500/30 border-t-blue-500 rounded-full animate-spin" />
        )}
      </div>
    </div>
  );
}
