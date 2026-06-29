import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import FinanceClient from "./FinanceClient";

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

  return (
    <FinanceClient
      orgId={orgId}
      isStaff={isStaff}
      transactions={transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: t.date
      }))}
      totalIncome={totalIncome}
      totalExpense={totalExpense}
      balance={balance}
      orgName={membership.organization.name}
    />
  );
}
