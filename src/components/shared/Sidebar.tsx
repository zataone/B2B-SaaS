"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Wallet,
  Users,
  Settings,
  LogOut,
  Activity,
} from "lucide-react";
import OrgSwitcher from "./OrgSwitcher";
import { logoutAction } from "@/app/actions/auth";

interface SidebarProps {
  orgId: string;
  orgName: string;
  organizations: {
    orgId: string;
    orgName: string;
    slug: string;
  }[];
}

export default function Sidebar({ orgId, orgName, organizations }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: `/workspace/${orgId}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: "Proyek",
      href: `/workspace/${orgId}/projects`,
      icon: Briefcase,
    },
    {
      name: "Keuangan",
      href: `/workspace/${orgId}/finance`,
      icon: Wallet,
    },
    {
      name: "Anggota Tim",
      href: `/workspace/${orgId}/members`,
      icon: Users,
    },
    {
      name: "Pengaturan",
      href: `/workspace/${orgId}/settings`,
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col h-screen sticky top-0 shrink-0 font-sans">
      {/* Brand logo */}
      <div className="h-16 px-6 border-b border-slate-900/80 flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center shadow shadow-blue-500/10">
          <Activity className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="font-bold text-lg text-white tracking-tight">SaaS Workspace</span>
      </div>

      {/* Org Switcher */}
      <div className="p-4 border-b border-slate-900/60">
        <OrgSwitcher
          currentOrgId={orgId}
          currentOrgName={orgName}
          organizations={organizations}
        />
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 h-10 px-3 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-blue-600/10 text-blue-400 font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer / Logout */}
      <div className="p-4 border-t border-slate-900">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full h-10 rounded-lg border border-slate-900 hover:border-slate-800 bg-slate-900/20 hover:bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center gap-2.5 text-sm transition-all cursor-pointer font-medium"
          >
            <LogOut className="h-4 w-4" />
            Keluar Sistem
          </button>
        </form>
      </div>
    </aside>
  );
}
