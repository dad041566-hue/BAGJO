import React from 'react';
import Image from 'next/image';
import { Edit2, ExternalLink } from 'lucide-react';
import type { Product, Brand } from '@/types';
import { formatPrice } from '@/lib/format';
import { CATALOG_STATUS_META, VISIBILITY_META, getPriceState } from '@/lib/products/constants';

interface ProductMobileCardProps {
  product: Product;
  brand?: Brand;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (product: Product) => void;
}

export function ProductMobileCard({
  product,
  brand,
  isSelected,
  onToggleSelect,
  onEdit,
}: ProductMobileCardProps) {
  const priceState = getPriceState(product.price);

  return (
    <div
      className={`relative p-4 bg-white border rounded-xl shadow-sm transition-colors ${
        isSelected ? 'border-stone-400 bg-stone-50/50' : 'border-stone-200/50'
      }`}
    >
      <div className="absolute top-4 left-4 z-10 bg-white rounded">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(product.id)}
          className="w-5 h-5 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
        />
      </div>

      <div className="flex gap-4 ml-8">
        <div className="relative w-20 h-20 rounded-lg border border-stone-100 overflow-hidden bg-stone-50 shrink-0">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">
              No Img
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-xs font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
              {brand?.name || '알 수 없음'}
            </span>
            <div className="flex gap-1">
              <a
                href={`/shop/${product.id}`}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-stone-400 hover:text-stone-900 bg-stone-50 rounded"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => onEdit(product)}
                className="p-1 text-stone-400 hover:text-stone-900 bg-stone-50 rounded"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h3 className="text-sm font-medium text-stone-900 line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {/* Catalog Status */}
            {(() => {
              const meta = CATALOG_STATUS_META[product.catalogStatus as keyof typeof CATALOG_STATUS_META] || CATALOG_STATUS_META.draft;
              return (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    (meta.tone as string) === 'success'
                      ? 'bg-green-100 text-green-700'
                      : meta.tone === 'warning'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {meta.label}
                </span>
              );
            })()}
            {/* Visibility Status */}
            {(() => {
              const meta = VISIBILITY_META[String(product.isVisible !== false) as keyof typeof VISIBILITY_META];
              return (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    meta.tone === 'success'
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'bg-stone-50 text-stone-500 border border-stone-200'
                  }`}
                >
                  {meta.label}
                </span>
              );
            })()}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
              {priceState === 'UNSET' && (
                <span className="text-red-500 font-medium text-xs">가격 미등록</span>
              )}
              {priceState === 'ZERO' && (
                <span className="text-amber-600 font-medium text-xs">0원 · 확인 필요</span>
              )}
              {priceState === 'VALID' && (
                <span className="font-semibold text-stone-900 text-sm">
                  {formatPrice(product.salePrice || product.price!)}원
                </span>
              )}
            </div>
            
            {product.stock !== undefined && product.stock !== null && (
              <span className="text-xs text-stone-500">
                재고 {product.stock.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
