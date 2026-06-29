import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

interface SettingsPageProps {
  params: Promise<{ orgId: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
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

  const isAdmin = membership.role === "ADMIN";

  return (
    <SettingsClient
      orgId={orgId}
      isAdmin={isAdmin}
      orgName={membership.organization.name}
      slug={membership.organization.slug}
      createdAt={membership.organization.createdAt}
      role={membership.role}
    />
  );
}
