"use client";

import { withBasePath } from "@/lib/site";

export async function accountRequest<T = Record<string, unknown>>(
  path: string,
  init?: RequestInit,
): Promise<T & { ok?: boolean; error?: string }> {
  const res = await fetch(withBasePath(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = (await res.json()) as T & { ok?: boolean; error?: string };
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || "Не удалось выполнить запрос");
  }
  return data;
}
