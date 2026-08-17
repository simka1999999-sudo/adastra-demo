import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { OzonPhotosForm } from "@/components/admin/OzonPhotosForm";
import { readCatalog } from "@/lib/catalog-store";
import { ozonSellerConfigured } from "@/lib/ozon-seller";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = readCatalog().find((p) => p.id === id);
  if (!product) notFound();

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold">{product.shortTitle}</h2>
      <p className="mb-2 text-sm text-ink-muted">{product.title}</p>
      <p className="mb-6 text-sm">
        <Link href={`/catalog/${product.slug}`} className="underline underline-offset-4">
          Открыть на витрине
        </Link>
      </p>
      <ProductForm product={product} />
      <div className="mt-10">
        <OzonPhotosForm productId={product.id} configured={ozonSellerConfigured()} />
      </div>
      <div className="mt-10 border-t border-line pt-6">
        <DeleteProductButton id={product.id} title={product.shortTitle} />
      </div>
    </div>
  );
}
