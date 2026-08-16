import { revalidatePath } from "next/cache";

export function revalidateCatalog(slug?: string, productId?: string) {
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/catalog/${slug}`);
  if (productId) revalidatePath(`/admin/products/${productId}`);
}
