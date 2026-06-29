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
import { motion } from "framer-motion";

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
    <aside className="w-64 bg-slate-950/40 border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0 font-sans backdrop-blur-xl z-20">
      {/* Brand logo */}
      <div className="h-16 px-6 border-b border-white/5 flex items-center gap-2.5">
        <motion.div
          whileHover={{ rotate: 15 }}
          className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow shadow-blue-500/10"
        >
          <Activity className="h-4.5 w-4.5 text-white" />
        </motion.div>
        <span className="font-bold text-base text-white tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          SaaS Workspace
        </span>
      </div>

      {/* Org Switcher */}
      <div className="p-4 border-b border-white/5">
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
              className="relative flex items-center gap-3 h-10 px-3 rounded-lg text-sm transition-all cursor-pointer group"
            >
              {/* Active Indicator Background */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-blue-600/10 border-l-2 border-blue-500 rounded-lg"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                className={`h-4.5 w-4.5 z-10 transition-colors ${
                  isActive ? "text-blue-450" : "text-slate-400 group-hover:text-white"
                }`}
              />
              <span
                className={`z-10 transition-colors ${
                  isActive ? "text-blue-450 font-semibold" : "text-slate-400 group-hover:text-white"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer / Logout */}
      <div className="p-4 border-t border-white/5 bg-slate-950/20">
        <form action={logoutAction}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full h-10 rounded-lg border border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10 text-slate-350 hover:text-white flex items-center justify-center gap-2.5 text-sm transition-all cursor-pointer font-medium"
          >
            <LogOut className="h-4 w-4 text-slate-400" />
            Keluar Sistem
          </motion.button>
        </form>
      </div>
    </aside>
  );
}
