"use client";

import React from "react";
import { Wallet, TrendingUp, TrendingDown, FileText } from "lucide-react";
import { motion } from "framer-motion";
import AddTransactionDialog from "./AddTransactionDialog";
import FinanceActions from "./FinanceActions";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: Date | string;
}

interface FinanceClientProps {
  orgId: string;
  isStaff: boolean;
  transactions: any[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  orgName: string;
}

export default function FinanceClient({
  orgId,
  isStaff,
  transactions,
  totalIncome,
  totalExpense,
  balance,
  orgName,
}: FinanceClientProps) {
  // Helper formatting Rupiah
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
      {/* Title Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Laporan Keuangan</h1>
          <p className="text-sm text-slate-450 mt-1">
            Catat arus transaksi operasional kas masuk dan keluar di organisasi Anda.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Client-side PDF/Excel Export Component */}
          <FinanceActions
            transactions={transactions.map(t => ({
              ...t,
              date: new Date(t.date)
            }))}
            orgName={orgName}
          />
          {/* RBAC check for add transaction */}
          {!isStaff ? (
            <AddTransactionDialog orgId={orgId} />
          ) : (
            <div className="glass-card rounded-xl px-4 py-2 text-xs text-slate-500 font-bold backdrop-blur">
              🔒 View-Only Mode
            </div>
          )}
        </div>
      </motion.div>

      {/* Summary Stats Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <motion.div
          variants={itemVariants}
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
          <p className="text-slate-400 text-xs mt-4">Pemasukan dikurangi pengeluaran operasional.</p>
        </motion.div>

        {/* Income Card */}
        <motion.div
          variants={itemVariants}
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
          <p className="text-slate-400 text-xs mt-4">Total dana masuk dari invoice & client.</p>
        </motion.div>

        {/* Expense Card */}
        <motion.div
          variants={itemVariants}
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
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 border border-violet-500/15 flex items-center justify-center text-violet-455">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-4">Total biaya operasional, gaji, & lisensi.</p>
        </motion.div>
      </motion.div>

      {/* Transaction List Card */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-6 shadow-xl shadow-black/10"
      >
        <h3 className="text-base font-bold text-white mb-6">Daftar Semua Transaksi</h3>

        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <div className="h-10 w-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 mx-auto mb-3">
                <FileText className="h-5 w-5" />
              </div>
              Belum ada transaksi keuangan tercatat.
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-450 text-xs font-bold uppercase tracking-widest">
                  <th className="pb-3.5">Tanggal</th>
                  <th className="pb-3.5">Deskripsi / Keterangan</th>
                  <th className="pb-3.5">ID Transaksi</th>
                  <th className="pb-3.5">Tipe</th>
                  <th className="pb-3.5 text-right">Jumlah Uang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((t) => (
                  <tr key={t.id} className="text-slate-350 hover:bg-white/5 transition-all duration-150">
                    {/* Tanggal */}
                    <td className="py-4 text-xs text-slate-450 font-medium">
                      {new Date(t.date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    {/* Keterangan */}
                    <td className="py-4 font-bold text-white">{t.description}</td>
                    {/* Transaction ID hash */}
                    <td className="py-4 text-xs text-slate-550 font-mono">
                      {t.id}
                    </td>
                    {/* Tipe */}
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
                    {/* Jumlah */}
                    <td
                      className={`py-4 text-right font-extrabold ${
                        t.type === "INCOME" ? "text-emerald-450" : "text-violet-455"
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
