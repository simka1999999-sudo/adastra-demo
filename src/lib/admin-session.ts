import { siteConfig } from "@/lib/site";

export const ADMIN_COOKIE = "adastra_admin";
const SESSION_MSG = "adastra-admin-session";

function bytesToHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function hmacHex(secret: string, message: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return bytesToHex(sig);
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD) && !siteConfig.isStaticDemo;
}

export async function sessionToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return "";
  return hmacHex(password, SESSION_MSG);
}

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

export async function cookieMatches(value: string | undefined) {
  const token = await sessionToken();
  if (!value || !token) return false;
  return safeEqual(value, token);
}
