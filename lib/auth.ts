"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? "change-me"
);

export type AdminJwt = {
  email: string;
  role: string;
};

export async function signAdminToken(payload: AdminJwt) {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

export async function verifyAdminToken(token: string): Promise<AdminJwt> {
  const { payload } = await jwtVerify(token, secret);
  return payload as AdminJwt;
}

export async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) return null;
  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function login(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("Credenciales de administrador no configuradas");
  }
  if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim() || password !== adminPassword) {
    throw new Error("Correo o contraseña incorrectos");
  }
  const token = await signAdminToken({ email, role: "ADMIN" });
  const cookieStore = await cookies();
  cookieStore.set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
  });
  return { ok: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-token");
  redirect("/login");
}
