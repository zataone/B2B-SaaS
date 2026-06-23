import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key-b2b-saas-dashboard-2026";
const encoder = new TextEncoder();
const encodedSecret = encoder.encode(SECRET_KEY);

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  organizations: {
    orgId: string;
    orgName: string;
    role: string;
    slug: string;
  }[];
}

// Hash password helper
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Compare password helper
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Sign JWT Token
export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(encodedSecret);
}

// Verify JWT Token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Get current session on the server-side (Server Components, Actions, API Routes)
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return await verifyToken(token);
}
