"use server";

import { prisma } from "@/lib/prisma";
import { comparePassword, hashPassword, signToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Form state response type
export interface ActionState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

// 1. LOGIN ACTION
export async function loginAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email dan Password wajib diisi." };
  }

  try {
    // Cari user di database
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user) {
      return { success: false, message: "Email atau Password salah." };
    }

    // Bandingkan password
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return { success: false, message: "Email atau Password salah." };
    }

    // Format list organisasi untuk payload JWT
    const userOrgs = user.memberships.map((m) => ({
      orgId: m.organization.id,
      orgName: m.organization.name,
      role: m.role,
      slug: m.organization.slug,
    }));

    // Buat token JWT
    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      organizations: userOrgs,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
      sameSite: "lax",
    });

    // Sukses, redirect ke workspace
    if (userOrgs.length > 0) {
      // Redirect dilakukan di page / handler atau di action. 
      // Untuk Server Actions, jika digunakan dalam form action, redirect() akan memicu navigasi.
      // Kita return sukses dahulu, lalu klien yang melakukan redirect atau langsung redirect dari server.
      // Di Next.js, memanggil redirect() dalam try-catch block akan melempar exception internal Next.js (NEXT_REDIRECT),
      // jadi pastikan memanggil redirect di luar try-catch block atau membiarkannya terlempar.
    }
  } catch (error: any) {
    // Cegah menangkap error redirect Next.js
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Login Error:", error);
    return { success: false, message: "Terjadi kesalahan pada server. Coba lagi." };
  }

  // Cari organisasi pertama
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (user && user.memberships.length > 0) {
    redirect(`/workspace/${user.memberships[0].organization.id}/dashboard`);
  } else {
    redirect("/workspace/select");
  }
}

// 2. REGISTER ACTION
export async function registerAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const companyName = formData.get("companyName") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !companyName || !password) {
    return { success: false, message: "Semua kolom wajib diisi." };
  }

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "Email sudah digunakan oleh akun lain." };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Cek duplikasi slug organisasi
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });
    const finalSlug = existingOrg ? `${slug}-${Math.floor(Math.random() * 1000)}` : slug;

    // Lakukan pembuatan User, Org, & Member dalam satu Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const newOrg = await tx.organization.create({
        data: {
          name: companyName,
          slug: finalSlug,
        },
      });

      const newMember = await tx.organizationMember.create({
        data: {
          userId: newUser.id,
          organizationId: newOrg.id,
          role: "ADMIN", // Pembuat organisasi otomatis jadi ADMIN
        },
        include: {
          organization: true,
        },
      });

      return { user: newUser, org: newOrg, member: newMember };
    });

    // Buat token JWT untuk user baru
    const token = await signToken({
      userId: result.user.id,
      email: result.user.email,
      name: result.user.name,
      organizations: [
        {
          orgId: result.org.id,
          orgName: result.org.name,
          role: "ADMIN",
          slug: result.org.slug,
        },
      ],
    });

    // Set cookie
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
    console.error("Register Error:", error);
    return { success: false, message: "Gagal membuat akun. Silakan coba lagi." };
  }

  // Cari user lagi untuk redirect
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (user && user.memberships.length > 0) {
    redirect(`/workspace/${user.memberships[0].organization.id}/dashboard`);
  } else {
    redirect("/workspace/select");
  }
}

// 3. LOGOUT ACTION
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/login");
}
