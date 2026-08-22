import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, cookieMatches } from "@/lib/admin-session";

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

const FACET_PARAMS = ["color", "size", "sort", "collection", "category"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminApi = pathname.startsWith("/api/admin");
  const isAdminUi = pathname.startsWith("/admin");
  const isLogin =
    pathname === "/admin/login" || pathname === "/api/admin/login";

  const isAccountPublic =
    pathname === "/account/login" ||
    pathname === "/account/register" ||
    pathname === "/account/forgot" ||
    pathname === "/account/reset" ||
    pathname === "/account/find";
  if (
    pathname.startsWith("/account") &&
    !isAccountPublic &&
    !request.cookies.get("adastra_customer")?.value
  ) {
    const login = new URL("/account/login", request.url);
    login.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }

  if ((isAdminApi || isAdminUi) && !isLogin) {
    if (process.env.NEXT_PUBLIC_STATIC_DEMO === "true") {
      if (isAdminApi) {
        return NextResponse.json({ ok: false, error: "Демо" }, { status: 403 });
      }
    } else if (!(await cookieMatches(request.cookies.get(ADMIN_COOKIE)?.value))) {
      if (isAdminApi) {
        return NextResponse.json({ ok: false, error: "Нет доступа" }, { status: 401 });
      }
      const login = new URL("/admin/login", request.url);
      return NextResponse.redirect(login);
    }
  }

  const response = NextResponse.next();
  if (!allowIndexing) {
    response.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive, nosnippet, noimageindex",
    );
    return response;
  }
  const hasFacet = FACET_PARAMS.some((key) =>
    request.nextUrl.searchParams.has(key),
  );
  if (hasFacet) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }
  if (isAdminUi) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  if (pathname.startsWith("/account")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
