"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ActionState } from "./auth";

// 1. TAMBAH/UNDANG ANGGOTA BARU (ADMIN ONLY)
export async function addMemberAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  const orgId = formData.get("orgId") as string;

  if (!email || !role || !orgId) {
    return { success: false, message: "Semua kolom wajib diisi." };
  }

  // A. Verifikasi user yang mengundang
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, message: "Sesi Anda telah berakhir. Silakan login kembali." };
  }

  try {
    // B. Verifikasi apakah pengundang adalah ADMIN di org ini (RBAC Server-Side)
    const inviterMembership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: currentUser.userId,
          organizationId: orgId,
        },
      },
    });

    if (!inviterMembership || inviterMembership.role !== "ADMIN") {
      return { success: false, message: "Akses ditolak. Hanya Admin yang dapat mengundang anggota baru." };
    }

    // C. Cari user yang akan diundang berdasarkan email
    const targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      return {
        success: false,
        message: "Email tidak ditemukan di sistem. Pastikan pengguna tersebut sudah terdaftar.",
      };
    }

    // D. Cek apakah user sudah menjadi anggota organisasi ini
    const existingMember = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: targetUser.id,
          organizationId: orgId,
        },
      },
    });

    if (existingMember) {
      return { success: false, message: "Pengguna sudah terdaftar di organisasi ini." };
    }

    // E. Buat keanggotaan baru
    await prisma.organizationMember.create({
      data: {
        userId: targetUser.id,
        organizationId: orgId,
        role,
      },
    });

    revalidatePath(`/workspace/${orgId}/members`);
    return { success: true, message: "Anggota tim berhasil ditambahkan." };
  } catch (error) {
    console.error("Add Member Error:", error);
    return { success: false, message: "Gagal menambahkan anggota. Coba lagi." };
  }
}

// 2. UPDATE PERAN ANGGOTA (ADMIN ONLY)
export async function updateMemberRoleAction(
  orgId: string,
  memberId: string,
  newRole: string
): Promise<ActionState> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, message: "Sesi Anda berakhir." };
  }

  try {
    // Verifikasi apakah yang mengedit adalah ADMIN (RBAC)
    const adminMembership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: currentUser.userId,
          organizationId: orgId,
        },
      },
    });

    if (!adminMembership || adminMembership.role !== "ADMIN") {
      return { success: false, message: "Akses ditolak. Hanya Admin yang dapat mengubah peran." };
    }

    // Cek apakah data member yang akan diedit ada
    const targetMember = await prisma.organizationMember.findUnique({
      where: { id: memberId },
    });

    if (!targetMember) {
      return { success: false, message: "Anggota tidak ditemukan." };
    }

    // Jangan izinkan admin mencabut status admin dirinya sendiri jika dia adalah admin satu-satunya
    if (targetMember.userId === currentUser.userId && newRole !== "ADMIN") {
      const otherAdminsCount = await prisma.organizationMember.count({
        where: {
          organizationId: orgId,
          role: "ADMIN",
          id: { not: memberId },
        },
      });

      if (otherAdminsCount === 0) {
        return {
          success: false,
          message: "Anda tidak dapat mengubah peran Anda sendiri karena Anda adalah satu-satunya Admin tersisa.",
        };
      }
    }

    // Update role
    await prisma.organizationMember.update({
      where: { id: memberId },
      data: { role: newRole },
    });

    revalidatePath(`/workspace/${orgId}/members`);
    return { success: true, message: "Peran berhasil diperbarui." };
  } catch (error) {
    console.error("Update Role Error:", error);
    return { success: false, message: "Gagal memperbarui peran." };
  }
}
