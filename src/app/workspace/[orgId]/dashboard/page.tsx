import React from "react";
import { prisma } from "@/lib/prisma";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
} from "lucide-react";
import Link from "next/link";
import DashboardCharts from "@/components/shared/DashboardCharts";

interface DashboardPageProps {
  params: Promise<{ orgId: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const resolvedParams = await params;
  const orgId = resolvedParams.orgId;

  // 1. Fetch data proyek
  const projects = await prisma.project.findMany({
    where: { organizationId: orgId },
  });

  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === "COMPLETED").length;
  const inProgressProjects = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const planningProjects = projects.filter((p) => p.status === "PLANNING").length;

  // 2. Fetch data transaksi keuangan
  const transactions = await prisma.transaction.findMany({
    where: { organizationId: orgId },
    orderBy: { date: "desc" },
  });

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // 3. Proses data untuk Chart Keuangan Bulanan (6 bulan terakhir)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  const chartMap: Record<string, { month: string; pemasukan: number; pengeluaran: number; sortKey: number }> = {};

  // Inisialisasi 5 bulan terakhir termasuk bulan sekarang
  const now = new Date();
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    const sortKey = d.getFullYear() * 12 + d.getMonth();
    chartMap[monthLabel] = { month: monthLabel, pemasukan: 0, pengeluaran: 0, sortKey };
  }

  // Isi data pemasukan dan pengeluaran dari transaksi database ke chartMap
  transactions.forEach((t) => {
    const tDate = new Date(t.date);
    const monthLabel = `${monthNames[tDate.getMonth()]} ${tDate.getFullYear().toString().slice(-2)}`;
    if (chartMap[monthLabel]) {
      if (t.type === "INCOME") {
        chartMap[monthLabel].pemasukan += t.amount;
      } else {
        chartMap[monthLabel].pengeluaran += t.amount;
      }
    }
  });

  // Urutkan data chart secara kronologis
  const chartData = Object.values(chartMap).sort((a, b) => a.sortKey - b.sortKey);

  // Ambil 5 transaksi terakhir untuk ditampilkan di tabel ringkasan
  const recentTransactions = transactions.slice(0, 5);

  // Helper formatting mata uang Rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Ringkasan Eksekutif</h1>
          <p className="text-sm text-slate-400 mt-1">Overview kinerja operasional dan keuangan organisasi Anda.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/workspace/${orgId}/finance`}
            className="h-10 px-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center transition-all cursor-pointer"
          >
            Input Transaksi
          </Link>
          <Link
            href={`/workspace/${orgId}/projects`}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-505 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow shadow-blue-500/10"
          >
            <Plus className="h-4 w-4" />
            Tambah Proyek
          </Link>
        </div>
      </div>

      {/* Financial Metrics Cards */}
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
          <p className="text-slate-400 text-xs mt-4 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">Total aset kas</span> yang dimiliki saat ini.
          </p>
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
          <p className="text-slate-400 text-xs mt-4">
            Akumulasi pendapatan transaksi operasional.
          </p>
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
          <p className="text-slate-400 text-xs mt-4">
            Pengeluaran operasional dan lisensi server.
          </p>
        </div>
      </div>

      {/* Analytics Chart & Project Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart (Takes 2 columns on large screen) */}
        <div className="lg:col-span-2">
          <DashboardCharts data={chartData} />
        </div>

        {/* Project Metrics Sidebar (Takes 1 column) */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white mb-1">Status Proyek</h3>
            <p className="text-xs text-slate-400 mb-6">Ringkasan status proyek di organisasi ini</p>

            <div className="space-y-4">
              {/* Total Project */}
              <div className="flex items-center justify-between border-b border-slate-900/50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Briefcase className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Total Proyek</span>
                </div>
                <span className="text-base font-bold text-white">{totalProjects}</span>
              </div>

              {/* In Progress */}
              <div className="flex items-center justify-between border-b border-slate-900/50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Sedang Berjalan</span>
                </div>
                <span className="text-base font-bold text-yellow-400">{inProgressProjects}</span>
              </div>

              {/* Completed */}
              <div className="flex items-center justify-between border-b border-slate-900/50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Selesai</span>
                </div>
                <span className="text-base font-bold text-emerald-400">{completedProjects}</span>
              </div>

              {/* Planning */}
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-500/10 flex items-center justify-center text-slate-400">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Perencanaan</span>
                </div>
                <span className="text-base font-bold text-slate-400">{planningProjects}</span>
              </div>
            </div>
          </div>

          <Link
            href={`/workspace/${orgId}/projects`}
            className="w-full h-10 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/40 text-xs font-semibold text-slate-300 hover:text-white rounded-xl flex items-center justify-center transition-all cursor-pointer mt-6"
          >
            Kelola Proyek Selengkapnya
          </Link>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-semibold text-white">Aktivitas Transaksi Terakhir</h3>
            <p className="text-xs text-slate-400 mt-1">Daftar transaksi kas masuk dan keluar terbaru.</p>
          </div>
          <Link
            href={`/workspace/${orgId}/finance`}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Lihat Semua Transaksi
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
                <tr className="border-b border-slate-900 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-3">Tanggal</th>
                  <th className="pb-3">Deskripsi</th>
                  <th className="pb-3">Tipe</th>
                  <th className="pb-3 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="text-slate-300 hover:bg-slate-900/10">
                    <td className="py-3.5 text-xs text-slate-400">
                      {new Date(t.date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 font-medium text-white">{t.description}</td>
                    <td className="py-3.5">
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
                    <td
                      className={`py-3.5 text-right font-semibold ${
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
