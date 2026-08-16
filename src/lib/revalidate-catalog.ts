import { revalidatePath } from "next/cache";

export function revalidateCatalog(slug?: string, productId?: string) {
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin");
  revalidatePath("/admin/import");
  if (slug) revalidatePath(`/catalog/${slug}`);
  if (productId) revalidatePath(`/admin/products/${productId}`);
}

export function revalidateCatalogAll() {
  revalidatePath("/", "layout");
  revalidatePath("/catalog", "layout");
  revalidatePath("/admin", "layout");
}
