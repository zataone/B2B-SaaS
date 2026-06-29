import React from "react";
import { User, Bell, ChevronRight } from "lucide-react";

interface HeaderProps {
  userName: string;
  userEmail: string;
  role: string; // "ADMIN", "MANAGER", "STAFF"
  orgName: string;
}

export default function Header({ userName, userEmail, role, orgName }: HeaderProps) {
  // Map role to badge styles
  const getRoleBadge = (roleName: string) => {
    switch (roleName.toUpperCase()) {
      case "ADMIN":
        return {
          text: "Admin",
          classes: "bg-rose-500/10 border-rose-500/20 text-rose-450",
        };
      case "MANAGER":
        return {
          text: "Manager",
          classes: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        };
      default:
        return {
          text: "Staff",
          classes: "bg-emerald-500/10 border-emerald-500/20 text-emerald-450",
        };
    }
  };

  const badge = getRoleBadge(role);

  return (
    <header className="h-16 px-8 bg-slate-950/20 border-b border-white/5 flex items-center justify-between font-sans backdrop-blur-md z-10">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-slate-350">{orgName}</span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
        <span className="text-slate-200 font-bold">Workspace</span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="h-9 w-9 rounded-lg border border-white/5 bg-slate-900/30 hover:bg-slate-900/60 hover:border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer">
          <Bell className="h-4 w-4" />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-white/10" />

        {/* User profile details */}
        <div className="flex items-center gap-3">
          {/* Role badge */}
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.classes}`}
          >
            {badge.text}
          </span>

          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-white leading-none mb-1">{userName}</span>
            <span className="text-[11px] text-slate-450 leading-none">{userEmail}</span>
          </div>

          <div className="h-9 w-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 shadow">
            <User className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>
    </header>
  );
}
