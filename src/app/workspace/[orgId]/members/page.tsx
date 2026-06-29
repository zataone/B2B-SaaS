import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import MembersClient from "./MembersClient";

interface MembersPageProps {
  params: Promise<{ orgId: string }>;
}

export default async function MembersPage({ params }: MembersPageProps) {
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
  });

  if (!membership) {
    redirect("/workspace/select");
  }

  const isAdmin = membership.role === "ADMIN";

  // 2. Fetch seluruh anggota organisasi
  const members = await prisma.organizationMember.findMany({
    where: { organizationId: orgId },
    include: {
      user: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <MembersClient
      orgId={orgId}
      isAdmin={isAdmin}
      members={members.map(m => ({
        id: m.id,
        userId: m.userId,
        role: m.role,
        createdAt: m.createdAt,
        user: {
          id: m.user.id,
          name: m.user.name,
          email: m.user.email
        }
      }))}
      currentUserId={user.userId}
    />
  );
}
