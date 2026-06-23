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
          classes: "bg-red-500/10 border-red-500/30 text-red-400",
        };
      case "MANAGER":
        return {
          text: "Manager",
          classes: "bg-blue-500/10 border-blue-500/30 text-blue-400",
        };
      default:
        return {
          text: "Staff",
          classes: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        };
    }
  };

  const badge = getRoleBadge(role);

  return (
    <header className="h-16 px-8 bg-slate-950 border-b border-slate-900 flex items-center justify-between font-sans">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span className="font-medium text-slate-400">{orgName}</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-200 font-semibold">Workspace</span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="h-9 w-9 rounded-lg border border-slate-900 bg-slate-900/30 hover:bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
          <Bell className="h-4 w-4" />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-900" />

        {/* User profile dropdown trigger */}
        <div className="flex items-center gap-3">
          {/* Role badge */}
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.classes}`}
          >
            {badge.text}
          </span>

          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-white leading-none mb-1">{userName}</span>
            <span className="text-[11px] text-slate-500 leading-none">{userEmail}</span>
          </div>

          <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
