import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seeding...");

  // Clean old data to avoid unique constraint violations on re-run
  await prisma.transaction.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.organizationMember.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleared.");

  // Hash passwords
  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create Users
  const userAdmin = await prisma.user.create({
    data: {
      email: "admin@alfa.com",
      name: "Admin Alfa",
      password: passwordHash,
    },
  });

  const userManager = await prisma.user.create({
    data: {
      email: "manager@alfa.com",
      name: "Manager Alfa",
      password: passwordHash,
    },
  });

  const userStaff = await prisma.user.create({
    data: {
      email: "staff@alfa.com",
      name: "Staff Alfa",
      password: passwordHash,
    },
  });

  const userBetaAdmin = await prisma.user.create({
    data: {
      email: "admin@beta.com",
      name: "Admin Beta",
      password: passwordHash,
    },
  });

  console.log("Users created.");

  // 2. Create Organizations (Tenants)
  const orgAlfa = await prisma.organization.create({
    data: {
      name: "Alfa Corp",
      slug: "alfa-corp",
    },
  });

  const orgBeta = await prisma.organization.create({
    data: {
      name: "Beta Inc",
      slug: "beta-inc",
    },
  });

  console.log("Organizations created.");

  // 3. Assign Memberships & Roles (RBAC)
  await prisma.organizationMember.create({
    data: {
      userId: userAdmin.id,
      organizationId: orgAlfa.id,
      role: "ADMIN",
    },
  });

  await prisma.organizationMember.create({
    data: {
      userId: userManager.id,
      organizationId: orgAlfa.id,
      role: "MANAGER",
    },
  });

  await prisma.organizationMember.create({
    data: {
      userId: userStaff.id,
      organizationId: orgAlfa.id,
      role: "STAFF",
    },
  });

  await prisma.organizationMember.create({
    data: {
      userId: userBetaAdmin.id,
      organizationId: orgBeta.id,
      role: "ADMIN",
    },
  });

  console.log("Organization memberships assigned.");

  // 4. Create Projects for Alfa Corp
  await prisma.project.createMany({
    data: [
      {
        name: "Sistem Keamanan Server",
        description: "Audit keamanan cyber dan konfigurasi firewall tingkat lanjut.",
        status: "IN_PROGRESS",
        organizationId: orgAlfa.id,
      },
      {
        name: "Website Company Profile",
        description: "Pengembangan website profil perusahaan baru dengan SEO modern.",
        status: "COMPLETED",
        organizationId: orgAlfa.id,
      },
      {
        name: "Aplikasi Mobile Sales",
        description: "Aplikasi iOS & Android untuk tim sales lapangan melakukan input order.",
        status: "PLANNING",
        organizationId: orgAlfa.id,
      },
    ],
  });

  // Create Projects for Beta Inc
  await prisma.project.createMany({
    data: [
      {
        name: "Beta E-Commerce Portal",
        description: "Portal belanja online terintegrasi payment gateway.",
        status: "IN_PROGRESS",
        organizationId: orgBeta.id,
      },
    ],
  });

  console.log("Projects created.");

  // 5. Create Transactions for Alfa Corp (Finance Analytics Data)
  const now = new Date();
  const getPastDate = (monthsAgo: number, day: number) => {
    const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
    return d;
  };

  await prisma.transaction.createMany({
    data: [
      // 3 Months Ago
      {
        type: "INCOME",
        amount: 150000000,
        description: "Down Payment Project Mobile Sales",
        date: getPastDate(3, 5),
        organizationId: orgAlfa.id,
      },
      {
        type: "EXPENSE",
        amount: 30000000,
        description: "Biaya Pembelian AWS Server & Domain",
        date: getPastDate(3, 10),
        organizationId: orgAlfa.id,
      },
      // 2 Months Ago
      {
        type: "INCOME",
        amount: 80000000,
        description: "Termin 2 Project Website Company Profile",
        date: getPastDate(2, 5),
        organizationId: orgAlfa.id,
      },
      {
        type: "EXPENSE",
        amount: 45000000,
        description: "Gaji Bulanan Staff Developer",
        date: getPastDate(2, 28),
        organizationId: orgAlfa.id,
      },
      // 1 Month Ago
      {
        type: "INCOME",
        amount: 120000000,
        description: "Pelunasan Project Website Company Profile",
        date: getPastDate(1, 10),
        organizationId: orgAlfa.id,
      },
      {
        type: "EXPENSE",
        amount: 45000000,
        description: "Gaji Bulanan Staff Developer",
        date: getPastDate(1, 28),
        organizationId: orgAlfa.id,
      },
      {
        type: "EXPENSE",
        amount: 12000000,
        description: "Pembelian Lisensi Docker Enterprise",
        date: getPastDate(1, 15),
        organizationId: orgAlfa.id,
      },
      // Current Month
      {
        type: "INCOME",
        amount: 50000000,
        description: "Maintenance Fee Sistem Keamanan Server",
        date: getPastDate(0, 5),
        organizationId: orgAlfa.id,
      },
      {
        type: "EXPENSE",
        amount: 15000000,
        description: "Sewa Co-Working Space Event Hackathon",
        date: getPastDate(0, 12),
        organizationId: orgAlfa.id,
      },
    ],
  });

  // Create Transactions for Beta Inc
  await prisma.transaction.createMany({
    data: [
      {
        type: "INCOME",
        amount: 60000000,
        description: "Kickoff Payment E-Commerce Portal",
        date: getPastDate(0, 1),
        organizationId: orgBeta.id,
      },
      {
        type: "EXPENSE",
        amount: 10000000,
        description: "Initial Domain and Hosting setups",
        date: getPastDate(0, 2),
        organizationId: orgBeta.id,
      },
    ],
  });

  console.log("Transactions created.");
  console.log("Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
