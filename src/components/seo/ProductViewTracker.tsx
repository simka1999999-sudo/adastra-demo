"use client";

import { useEffect } from "react";
import { trackViewProduct } from "@/lib/metrika";
import { categoryLabels } from "@/lib/products";
import type { Product } from "@/lib/types";

/** Автоматический detail ecommerce + цель view_product на PDP. */
export function ProductViewTracker({ product }: { product: Product }) {
  useEffect(() => {
    trackViewProduct({
      id: product.id,
      name: product.title,
      price: product.price,
      category: categoryLabels[product.category],
    });
  }, [product.id, product.title, product.price, product.category]);

  return null;
}
