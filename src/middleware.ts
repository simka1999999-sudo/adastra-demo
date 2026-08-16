import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

const FACET_PARAMS = ["color", "size", "sort", "collection", "category"];

export function middleware(request: NextRequest) {
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
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
