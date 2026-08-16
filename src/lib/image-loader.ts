type LoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

/** Префикс GitHub Pages для next/image при статическом export. */
export default function githubPagesLoader({ src }: LoaderProps): string {
  if (/^https?:\/\//.test(src)) return src;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${base}${path}`;
}
