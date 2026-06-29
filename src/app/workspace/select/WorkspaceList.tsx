"use client";

import React from "react";
import Link from "next/link";
import { Building, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface WorkspaceListProps {
  memberships: {
    organization: {
      id: string;
      name: string;
      slug: string;
    };
    role: string;
  }[];
}

export default function WorkspaceList({ memberships }: WorkspaceListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  if (memberships.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 text-center text-slate-450 text-sm">
        Anda belum bergabung dengan organisasi mana pun.
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {memberships.map((m) => (
        <motion.div key={m.organization.id} variants={itemVariants}>
          <Link
            href={`/workspace/${m.organization.id}/dashboard`}
            className="w-full h-14 bg-slate-900/40 border border-white/5 hover:border-blue-500/40 hover:bg-slate-900/60 rounded-xl px-4 flex items-center justify-between transition-all group cursor-pointer backdrop-blur"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8.5 w-8.5 rounded-lg bg-blue-600/10 border border-blue-500/15 flex items-center justify-center text-blue-400 shrink-0">
                <Building className="h-4.5 w-4.5" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-semibold truncate text-white">{m.organization.name}</p>
                <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Peran: {m.role}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
