"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, signToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ActionState } from "./auth";

// Action untuk membuat organisasi baru
export async function createOrgAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;

  if (!name) {
    return { success: false, message: "Nama organisasi wajib diisi." };
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  let newOrgId = "";

  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Cek duplikasi slug organisasi
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });
    const finalSlug = existingOrg ? `${slug}-${Math.floor(Math.random() * 1000)}` : slug;

    // Lakukan pembuatan Org & Member sebagai ADMIN dalam transaksi
    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name,
          slug: finalSlug,
        },
      });

      await tx.organizationMember.create({
        data: {
          userId: user.userId,
          organizationId: org.id,
          role: "ADMIN",
        },
      });

      return org;
    });

    newOrgId = result.id;

    // KARENA KITA MEMBUAT ORGANISASI BARU, KITA HARUS MEMPERBARUI TOKEN JWT
    // Ambil semua keanggotaan organisasi terbaru milik user
    const userMemberships = await prisma.organizationMember.findMany({
      where: { userId: user.userId },
      include: { organization: true },
    });

    const updatedOrgs = userMemberships.map((m) => ({
      orgId: m.organization.id,
      orgName: m.organization.name,
      role: m.role,
      slug: m.organization.slug,
    }));

    // Buat token JWT baru dengan list organisasi terbaru
    const token = await signToken({
      userId: user.userId,
      email: user.email,
      name: user.name,
      organizations: updatedOrgs,
    });

    // Set cookie terbaru
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
      sameSite: "lax",
    });

  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Create Org Error:", error);
    return { success: false, message: "Gagal membuat organisasi. Coba lagi." };
  }

  // Redirect ke workspace organisasi baru
  redirect(`/workspace/${newOrgId}/dashboard`);
}

// Action untuk memperbarui nama organisasi (ADMIN ONLY)
export async function updateOrgNameAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const orgId = formData.get("orgId") as string;

  if (!name || !orgId) {
    return { success: false, message: "Nama organisasi wajib diisi." };
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    // Cek apakah user adalah ADMIN di org ini
    const membership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: {
          userId: user.userId,
          organizationId: orgId,
        },
      },
    });

    if (!membership || membership.role !== "ADMIN") {
      return { success: false, message: "Akses ditolak. Hanya Admin yang dapat mengubah pengaturan organisasi." };
    }

    // Update nama organisasi
    await prisma.organization.update({
      where: { id: orgId },
      data: { name },
    });

    // Perbarui token JWT agar nama organisasi terupdate di session cookie
    const userMemberships = await prisma.organizationMember.findMany({
      where: { userId: user.userId },
      include: { organization: true },
    });

    const updatedOrgs = userMemberships.map((m) => ({
      orgId: m.organization.id,
      orgName: m.organization.name,
      role: m.role,
      slug: m.organization.slug,
    }));

    const token = await signToken({
      userId: user.userId,
      email: user.email,
      name: user.name,
      organizations: updatedOrgs,
    });

    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
      sameSite: "lax",
    });

    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/workspace/${orgId}/settings`);
    revalidatePath(`/workspace/${orgId}/dashboard`);
    
    return { success: true, message: "Nama organisasi berhasil diperbarui." };
  } catch (error: any) {
    console.error("Update Org Name Error:", error);
    return { success: false, message: "Gagal memperbarui nama organisasi." };
  }
}
