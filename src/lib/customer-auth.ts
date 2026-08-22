import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Customer } from "@prisma/client";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site";

export const CUSTOMER_COOKIE = "adastra_customer";
export const SIGNED_IN_COOKIE = "adastra_signed_in";
const SESSION_DAYS = 30;

export function customerAuthEnabled() {
  return !siteConfig.isStaticDemo;
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(customerId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.customerSession.create({
    data: {
      customerId,
      tokenHash: hashToken(token),
      expiresAt,
    },
  });
  return { token, expiresAt };
}

export function applyCustomerCookies(
  response: NextResponse,
  token: string,
  expiresAt: Date,
) {
  const secure = process.env.NODE_ENV === "production";
  const maxAge = Math.max(
    60,
    Math.floor((expiresAt.getTime() - Date.now()) / 1000),
  );
  response.cookies.set({
    name: CUSTOMER_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge,
  });
  response.cookies.set({
    name: SIGNED_IN_COOKIE,
    value: "1",
    httpOnly: false,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge,
  });
  return response;
}

export function clearCustomerCookies(response: NextResponse) {
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set({
    name: CUSTOMER_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
  response.cookies.set({
    name: SIGNED_IN_COOKIE,
    value: "",
    httpOnly: false,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
  return response;
}

export const getCurrentCustomer = cache(async (): Promise<Customer | null> => {
  if (!customerAuthEnabled()) return null;
  const jar = await cookies();
  const token = jar.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.customerSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { customer: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.customerSession.delete({ where: { id: session.id } }).catch(
      () => undefined,
    );
    return null;
  }
  return session.customer;
});

export async function destroyCurrentSession() {
  const jar = await cookies();
  const token = jar.get(CUSTOMER_COOKIE)?.value;
  if (!token) return;
  await prisma.customerSession.deleteMany({
    where: { tokenHash: hashToken(token) },
  });
}

export async function destroyAllSessions(customerId: string) {
  await prisma.customerSession.deleteMany({ where: { customerId } });
}

export async function requireCustomer(): Promise<
  | { customer: Customer; error: null }
  | { customer: null; error: NextResponse }
> {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return {
      customer: null,
      error: NextResponse.json(
        { ok: false, error: "Войдите в кабинет" },
        { status: 401 },
      ),
    };
  }
  return { customer, error: null };
}

export async function attachOrdersByEmail(customerId: string, email: string) {
  await prisma.order.updateMany({
    where: { email: email.toLowerCase(), customerId: null },
    data: { customerId },
  });
}

export async function startCustomerSession(customerId: string) {
  const { token, expiresAt } = await createSession(customerId);
  return applyCustomerCookies(
    NextResponse.json({ ok: true }),
    token,
    expiresAt,
  );
}

export function publicCustomer(customer: Customer) {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    city: customer.city,
    marketingOptIn: customer.marketingOptIn,
    heightCm: customer.heightCm,
    sizeRu: customer.sizeRu,
    chestCm: customer.chestCm,
    waistCm: customer.waistCm,
    hipsCm: customer.hipsCm,
  };
}
