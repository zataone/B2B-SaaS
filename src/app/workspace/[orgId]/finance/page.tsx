import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Wallet, TrendingUp, TrendingDown, FileText } from "lucide-react";
import AddTransactionDialog from "./AddTransactionDialog";
import FinanceActions from "./FinanceActions";

interface FinancePageProps {
  params: Promise<{ orgId: string }>;
}

export default async function FinancePage({ params }: FinancePageProps) {
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
    include: {
      organization: true,
    },
  });

  if (!membership) {
    redirect("/workspace/select");
  }

  const isStaff = membership.role === "STAFF";

  // 2. Fetch semua transaksi
  const transactions = await prisma.transaction.findMany({
    where: { organizationId: orgId },
    orderBy: { date: "desc" },
  });

  // Hitung ringkasan statistik keuangan
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Helper formatting Rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Laporan Keuangan</h1>
          <p className="text-sm text-slate-400 mt-1">
            Catat arus transaksi operasional kas masuk dan keluar di organisasi Anda.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Client-side PDF/Excel Export Component */}
          <FinanceActions
            transactions={transactions}
            orgName={membership.organization.name}
          />
          {/* RBAC check for add transaction */}
          {!isStaff ? (
            <AddTransactionDialog orgId={orgId} />
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-500 font-medium">
              🔒 View-Only Mode
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-505/10 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Saldo Bersih</p>
              <h3 className="text-2xl font-extrabold text-white mt-2.5 truncate">
                {formatRupiah(balance)}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-4">Pemasukan dikurangi pengeluaran operasional.</p>
        </div>

        {/* Income Card */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-505/10 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Pemasukan</p>
              <h3 className="text-2xl font-extrabold text-emerald-400 mt-2.5 truncate">
                {formatRupiah(totalIncome)}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-4">Total dana masuk dari invoice & client.</p>
        </div>

        {/* Expense Card */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-24 w-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-505/10 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Pengeluaran</p>
              <h3 className="text-2xl font-extrabold text-violet-400 mt-2.5 truncate">
                {formatRupiah(totalExpense)}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-4">Total biaya operasional, gaji, & lisensi.</p>
        </div>
      </div>

      {/* Transaction List Card */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-base font-semibold text-white mb-6">Daftar Semua Transaksi</h3>

        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 mx-auto mb-3">
                <FileText className="h-5 w-5" />
              </div>
              Belum ada transaksi keuangan tercatat.
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3">Tanggal</th>
                  <th className="pb-3">Deskripsi / Keterangan</th>
                  <th className="pb-3">ID Transaksi</th>
                  <th className="pb-3">Tipe</th>
                  <th className="pb-3 text-right">Jumlah Uang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {transactions.map((t) => (
                  <tr key={t.id} className="text-slate-300 hover:bg-slate-900/10">
                    {/* Tanggal */}
                    <td className="py-4 text-xs text-slate-400">
                      {new Date(t.date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    {/* Keterangan */}
                    <td className="py-4 font-medium text-white">{t.description}</td>
                    {/* Transaction ID hash */}
                    <td className="py-4 text-xs text-slate-550 font-mono">
                      {t.id}
                    </td>
                    {/* Tipe */}
                    <td className="py-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          t.type === "INCOME"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-violet-500/10 text-violet-400"
                        }`}
                      >
                        {t.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </td>
                    {/* Jumlah */}
                    <td
                      className={`py-4 text-right font-semibold ${
                        t.type === "INCOME" ? "text-emerald-400" : "text-violet-400"
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
      </div>
    </div>
  );
}
