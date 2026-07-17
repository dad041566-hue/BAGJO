import React from 'react';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin-new/products/ProductForm';
import { getProductById } from '@/lib/products/repo';
import { listAllBrandsForAdmin } from '@/lib/brands/repo';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id, { includeHidden: true });

  if (!product) {
    notFound();
  }

  const brands = await listAllBrandsForAdmin();

  return (
    <ProductForm 
      brands={brands}
      initialData={product}
    />
  );
}
