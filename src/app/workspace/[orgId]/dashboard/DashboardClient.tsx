"use client";

import React from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import DashboardCharts from "@/components/shared/DashboardCharts";

interface Transaction {
  id: string;
  date: string | Date;
  description: string;
  type: string;
  amount: number;
}

interface DashboardClientProps {
  orgId: string;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  chartData: any[];
  recentTransactions: Transaction[];
  totalProjects: number;
  inProgressProjects: number;
  completedProjects: number;
  planningProjects: number;
}

export default function DashboardClient({
  orgId,
  balance,
  totalIncome,
  totalExpense,
  chartData,
  recentTransactions,
  totalProjects,
  inProgressProjects,
  completedProjects,
  planningProjects,
}: DashboardClientProps) {
  // Helper formatting mata uang Rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
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
      {/* Title section */}
      <motion.div
        variants={cardVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Ringkasan Eksekutif</h1>
          <p className="text-sm text-slate-450 mt-1">Overview kinerja operasional dan keuangan organisasi Anda.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/workspace/${orgId}/finance`}
            className="h-10 px-4 bg-slate-900/60 border border-white/5 hover:border-white/10 hover:bg-slate-900 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center transition-all cursor-pointer backdrop-blur"
          >
            Input Transaksi
          </Link>
          <Link
            href={`/workspace/${orgId}/projects`}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" />
            Tambah Proyek
          </Link>
        </div>
      </motion.div>

      {/* Financial Metrics Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, borderColor: "rgba(3, 105, 161, 0.3)" }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden group shadow-xl shadow-black/10"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Saldo Bersih</p>
              <h3 className="text-2xl font-extrabold text-white mt-3 truncate">
                {formatRupiah(balance)}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-450 shadow-inner shadow-blue-500/5">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-4 flex items-center gap-1">
            <span className="text-emerald-450 font-semibold">Total aset kas</span> yang dimiliki saat ini.
          </p>
        </motion.div>

        {/* Income Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, borderColor: "rgba(16, 185, 129, 0.3)" }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden group shadow-xl shadow-black/10"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Total Pemasukan</p>
              <h3 className="text-2xl font-extrabold text-emerald-400 mt-3 truncate">
                {formatRupiah(totalIncome)}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-450">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-4">
            Akumulasi pendapatan transaksi operasional.
          </p>
        </motion.div>

        {/* Expense Card */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, borderColor: "rgba(139, 92, 246, 0.3)" }}
          className="glass-card rounded-2xl p-6 relative overflow-hidden group shadow-xl shadow-black/10"
        >
          <div className="absolute top-0 right-0 h-24 w-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-colors pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Total Pengeluaran</p>
              <h3 className="text-2xl font-extrabold text-violet-400 mt-3 truncate">
                {formatRupiah(totalExpense)}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center text-violet-450">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-4">
            Pengeluaran operasional dan lisensi server.
          </p>
        </motion.div>
      </motion.div>

      {/* Analytics Chart & Project Status */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <DashboardCharts data={chartData} />
        </motion.div>

        {/* Project Metrics Sidebar */}
        <motion.div
          variants={cardVariants}
          className="glass-card rounded-2xl p-6 flex flex-col justify-between shadow-xl shadow-black/10"
        >
          <div>
            <h3 className="text-base font-bold text-white mb-1">Status Proyek</h3>
            <p className="text-xs text-slate-450 mb-6">Ringkasan status proyek di organisasi ini</p>

            <div className="space-y-4">
              {/* Total Project */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-450">
                    <Briefcase className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">Total Proyek</span>
                </div>
                <span className="text-base font-bold text-white">{totalProjects}</span>
              </div>

              {/* In Progress */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-yellow-500/10 border border-yellow-500/15 flex items-center justify-center text-yellow-450">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">Sedang Berjalan</span>
                </div>
                <span className="text-base font-bold text-yellow-400">{inProgressProjects}</span>
              </div>

              {/* Completed */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-450">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">Selesai</span>
                </div>
                <span className="text-base font-bold text-emerald-400">{completedProjects}</span>
              </div>

              {/* Planning */}
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-500/10 border border-slate-500/15 flex items-center justify-center text-slate-400">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">Perencanaan</span>
                </div>
                <span className="text-base font-bold text-slate-400">{planningProjects}</span>
              </div>
            </div>
          </div>

          <Link
            href={`/workspace/${orgId}/projects`}
            className="w-full h-10 border border-white/5 hover:border-white/10 hover:bg-white/5 text-xs font-semibold text-slate-350 hover:text-white rounded-xl flex items-center justify-center transition-all cursor-pointer mt-6"
          >
            Kelola Proyek Selengkapnya
          </Link>
        </motion.div>
      </motion.div>

      {/* Recent Transactions List */}
      <motion.div
        variants={cardVariants}
        className="glass-card rounded-2xl p-6 shadow-xl shadow-black/10"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Aktivitas Transaksi Terakhir</h3>
            <p className="text-xs text-slate-450 mt-1">Daftar transaksi kas masuk dan keluar terbaru.</p>
          </div>
          <Link
            href={`/workspace/${orgId}/finance`}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-semibold flex items-center gap-1"
          >
            Lihat Semua Transaksi
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">
              Belum ada transaksi tercatat di organisasi ini.
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-450 text-xs font-bold uppercase tracking-widest">
                  <th className="pb-3.5">Tanggal</th>
                  <th className="pb-3.5">Deskripsi</th>
                  <th className="pb-3.5">Tipe</th>
                  <th className="pb-3.5 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="text-slate-300 hover:bg-white/5 transition-all duration-150">
                    <td className="py-4 text-xs text-slate-450">
                      {new Date(t.date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 font-semibold text-white">{t.description}</td>
                    <td className="py-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                          t.type === "INCOME"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450"
                            : "bg-violet-500/10 border-violet-500/20 text-violet-400"
                        }`}
                      >
                        {t.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </td>
                    <td
                      className={`py-4 text-right font-bold ${
                        t.type === "INCOME" ? "text-emerald-450" : "text-violet-405"
                      }`}
                    >
                      {t.type === "INCOME" ? "+" : "-"} {formatRupiah(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
