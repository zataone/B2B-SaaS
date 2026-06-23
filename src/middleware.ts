import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key-b2b-saas-dashboard-2026";
const encodedSecret = new TextEncoder().encode(SECRET_KEY);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // 1. Verifikasi JWT token secara manual (jose kompatibel dengan Edge Runtime)
  let payload: any = null;
  if (token) {
    try {
      const { payload: verified } = await jwtVerify(token, encodedSecret);
      payload = verified;
    } catch (e) {
      // Token tidak valid atau kedaluwarsa
    }
  }

  // 2. Proteksi Halaman Workspace
  if (pathname.startsWith("/workspace")) {
    if (!payload) {
      // Pengguna tidak terautentikasi -> dialihkan ke login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Deteksi Tenant Isolation: URL berbentuk /workspace/[orgId]/...
    const segments = pathname.split("/"); // e.g. ["", "workspace", "cld123...", "dashboard"]
    if (segments.length >= 3) {
      const targetOrgId = segments[2];
      
      // Jika mengakses halaman pemilihan organisasi, lewati pengecekan isolasi
      if (targetOrgId === "select") {
        return NextResponse.next();
      }

      // Pastikan targetOrgId ada dalam daftar organisasi yang berhak diakses oleh user ini
      const isMember = payload.organizations?.some(
        (org: any) => org.orgId === targetOrgId || org.slug === targetOrgId
      );

      if (!isMember) {
        // Jika tidak berhak, alihkan ke organisasi pertama mereka
        if (payload.organizations && payload.organizations.length > 0) {
          const firstOrgId = payload.organizations[0].orgId;
          const redirectUrl = new URL(`/workspace/${firstOrgId}/dashboard`, request.url);
          return NextResponse.redirect(redirectUrl);
        } else {
          // Jika tidak punya organisasi sama sekali, alihkan ke halaman buat/pilih organisasi
          const selectUrl = new URL("/workspace/select", request.url);
          return NextResponse.redirect(selectUrl);
        }
      }
    }
  }

  // 3. Cegah user yang sudah login untuk mengakses halaman login/register/landing page
  if (pathname === "/login" || pathname === "/register" || pathname === "/") {
    if (payload) {
      if (payload.organizations && payload.organizations.length > 0) {
        const firstOrgId = payload.organizations[0].orgId;
        const redirectUrl = new URL(`/workspace/${firstOrgId}/dashboard`, request.url);
        return NextResponse.redirect(redirectUrl);
      } else {
        const selectUrl = new URL("/workspace/select", request.url);
        return NextResponse.redirect(selectUrl);
      }
    }
  }

  return NextResponse.next();
}

// Menentukan rute mana saja yang akan diproses oleh middleware ini
export const config = {
  matcher: [
    "/workspace/:path*",
    "/login",
    "/register",
    "/",
  ],
};
