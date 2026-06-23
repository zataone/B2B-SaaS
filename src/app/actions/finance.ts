"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ActionState } from "./auth";

export async function createTransactionAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const type = formData.get("type") as string;
  const amountStr = formData.get("amount") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("date") as string;
  const orgId = formData.get("orgId") as string;

  if (!type || !amountStr || !description || !orgId) {
    return { success: false, message: "Semua kolom wajib diisi." };
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { success: false, message: "Jumlah uang harus bernilai positif." };
  }

  // 1. Verifikasi User Session
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Sesi Anda telah berakhir. Silakan login kembali." };
  }

  try {
    // 2. Verifikasi Peran User di Organisasi ini (RBAC Server-Side)
    const membership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: user.userId,
          organizationId: orgId,
        },
      },
    });

    if (!membership) {
      return { success: false, message: "Akses ditolak. Anda bukan anggota organisasi ini." };
    }

    if (membership.role === "STAFF") {
      return { success: false, message: "Akses ditolak. Staf tidak memiliki izin untuk menginput data keuangan." };
    }

    // 3. Simpan Transaksi Keuangan ke Database
    await prisma.transaction.create({
      data: {
        type,
        amount,
        description,
        date: dateStr ? new Date(dateStr) : new Date(),
        organizationId: orgId,
      },
    });

    // Revalidate halaman keuangan & dashboard agar data ter-update
    revalidatePath(`/workspace/${orgId}/finance`);
    revalidatePath(`/workspace/${orgId}/dashboard`);

    return { success: true, message: "Transaksi berhasil dicatat." };
  } catch (error) {
    console.error("Create Transaction Error:", error);
    return { success: false, message: "Gagal mencatat transaksi. Silakan coba lagi." };
  }
}
