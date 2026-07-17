import React from 'react';
import { notFound } from 'next/navigation';
import ProductDetailEditor from '@/components/admin-new/products/ProductDetailEditor';
import { getProductById } from '@/lib/products/repo';

export default async function ProductDetailEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id, { includeHidden: true });

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailEditor product={product} />
  );
}
