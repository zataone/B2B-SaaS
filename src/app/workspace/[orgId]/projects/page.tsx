import React from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProjectsClient from "./ProjectsClient";

interface ProjectsPageProps {
  params: Promise<{ orgId: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function ProjectsPage({ params, searchParams }: ProjectsPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const orgId = resolvedParams.orgId;
  const statusFilter = resolvedSearchParams.status || "ALL";

  // 1. Verifikasi user dan roles untuk client-side RBAC
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

  const isStaff = membership.role === "STAFF";

  // 2. Fetch proyek dari database dengan filter status
  const projects = await prisma.project.findMany({
    where: {
      organizationId: orgId,
      ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  // Ambil total data untuk menghitung badge jumlah filter
  const allProjects = await prisma.project.findMany({
    where: { organizationId: orgId },
  });

  const counts = {
    ALL: allProjects.length,
    PLANNING: allProjects.filter((p) => p.status === "PLANNING").length,
    IN_PROGRESS: allProjects.filter((p) => p.status === "IN_PROGRESS").length,
    COMPLETED: allProjects.filter((p) => p.status === "COMPLETED").length,
    ON_HOLD: allProjects.filter((p) => p.status === "ON_HOLD").length,
  };

  return (
    <ProjectsClient
      orgId={orgId}
      isStaff={isStaff}
      projects={projects.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        createdAt: p.createdAt
      }))}
      statusFilter={statusFilter}
      counts={counts}
    />
  );
}
