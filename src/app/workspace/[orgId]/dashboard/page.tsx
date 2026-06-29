import React from "react";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

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

  return (
    <DashboardClient
      orgId={orgId}
      balance={balance}
      totalIncome={totalIncome}
      totalExpense={totalExpense}
      chartData={chartData}
      recentTransactions={recentTransactions.map(t => ({
        id: t.id,
        date: t.date,
        description: t.description,
        type: t.type,
        amount: t.amount
      }))}
      totalProjects={totalProjects}
      inProgressProjects={inProgressProjects}
      completedProjects={completedProjects}
      planningProjects={planningProjects}
    />
  );
}
