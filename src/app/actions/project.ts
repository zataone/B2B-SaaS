"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ActionState } from "./auth";

export async function createProjectAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const orgId = formData.get("orgId") as string;

  if (!name || !status || !orgId) {
    return { success: false, message: "Nama, Status, dan ID Organisasi wajib diisi." };
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
      return { success: false, message: "Akses ditolak. Staf tidak memiliki izin untuk membuat proyek baru." };
    }

    // 3. Simpan Proyek ke Database
    await prisma.project.create({
      data: {
        name,
        description: description || null,
        status,
        organizationId: orgId,
      },
    });

    // Revalidate halaman proyek agar data ter-update
    revalidatePath(`/workspace/${orgId}/projects`);

    return { success: true, message: "Proyek berhasil ditambahkan." };
  } catch (error) {
    console.error("Create Project Error:", error);
    return { success: false, message: "Gagal menyimpan proyek. Silakan coba lagi." };
  }
}
