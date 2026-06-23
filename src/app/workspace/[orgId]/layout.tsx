import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/shared/Header";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}

export default async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  // Await params karena di Next.js 15+ params berbentuk Promise
  const resolvedParams = await params;
  const orgId = resolvedParams.orgId;

  // Dapatkan user yang sedang login dari session cookie
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Ambil data keanggotaan user di organisasi target untuk verifikasi peran
  const memberShip = await prisma.organizationMember.findUnique({
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

  // Jika user bukan member dari organisasi ini (tenant isolation bypass check)
  if (!memberShip) {
    redirect("/workspace/select");
  }

  // Dapatkan daftar organisasi yang bisa diakses user ini untuk OrgSwitcher
  const userMemberships = await prisma.organizationMember.findMany({
    where: {
      userId: user.userId,
    },
    include: {
      organization: true,
    },
  });

  const organizationsList = userMemberships.map((m) => ({
    orgId: m.organization.id,
    orgName: m.organization.name,
    slug: m.organization.slug,
  }));

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans">
      {/* Sidebar - Navigasi utama & Org Switcher */}
      <Sidebar
        orgId={orgId}
        orgName={memberShip.organization.name}
        organizations={organizationsList}
      />

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Profil pengguna, notifikasi, & peran */}
        <Header
          userName={user.name}
          userEmail={user.email}
          role={memberShip.role}
          orgName={memberShip.organization.name}
        />

        {/* Konten Halaman Spesifik */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
