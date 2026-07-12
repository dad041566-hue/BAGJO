import React from 'react';
import Image from 'next/image';
import { Edit2, ExternalLink } from 'lucide-react';
import type { Product, Brand } from '@/types';
import { formatPrice } from '@/lib/format';
import { CATALOG_STATUS_META, VISIBILITY_META, getPriceState } from '@/lib/products/constants';

interface ProductTableProps {
  products: Product[];
  brands: Brand[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (product: Product) => void;
}

export function ProductTable({
  products,
  brands,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
}: ProductTableProps) {
  const allSelected = products.length > 0 && selectedIds.size === products.length;

  return (
    <div className="bg-white border border-stone-200/50 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-200/50">
            <tr>
              <th className="px-4 py-3 w-12 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
              </th>
              <th className="px-4 py-3 min-w-[280px]">상품 정보</th>
              <th className="px-4 py-3">브랜드</th>
              <th className="px-4 py-3">카테고리</th>
              <th className="px-4 py-3">판매가</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">재고</th>
              <th className="px-4 py-3 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center text-stone-400">
                  표시할 상품이 없습니다.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const brand = brands.find((b) => b.id === p.brandId);
                const isSelected = selectedIds.has(p.id);
                const priceState = getPriceState(p.price);

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-stone-50/50 transition-colors ${
                      isSelected ? 'bg-stone-50/80' : ''
                    }`}
                  >
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(p.id)}
                        className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg border border-stone-100 overflow-hidden bg-stone-50 shrink-0">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col max-w-[200px] whitespace-normal">
                          <span className="font-medium text-stone-900 line-clamp-2 leading-snug">
                            {p.name}
                          </span>
                          <span className="text-xs text-stone-400 mt-0.5">
                            {(p as any).code || p.id.split('-')[0]}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-1 bg-stone-100 text-stone-700 rounded text-xs font-medium">
                        {brand?.name || '알 수 없음'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-stone-900">{p.category}</span>
                        {p.lifestyleCategory && (
                          <span className="text-xs text-stone-500">
                            {p.lifestyleCategory}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {priceState === 'UNSET' && (
                        <span className="text-red-500 font-medium text-xs bg-red-50 px-2 py-1 rounded">
                          가격 미등록
                        </span>
                      )}
                      {priceState === 'ZERO' && (
                        <span className="text-amber-600 font-medium text-xs bg-amber-50 px-2 py-1 rounded">
                          0원 · 확인 필요
                        </span>
                      )}
                      {priceState === 'VALID' && (
                        <div className="flex flex-col">
                          {p.salePrice ? (
                            <>
                              <span className="font-semibold text-stone-900">
                                {formatPrice(p.salePrice)}원
                              </span>
                              <span className="text-xs text-stone-400 line-through">
                                {formatPrice(p.price!)}원
                              </span>
                            </>
                          ) : (
                            <span className="font-semibold text-stone-900">
                              {formatPrice(p.price!)}원
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        {/* Catalog Status */}
                        {(() => {
                          const meta = CATALOG_STATUS_META[p.catalogStatus as keyof typeof CATALOG_STATUS_META] || CATALOG_STATUS_META.draft;
                          return (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
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
                          const meta = VISIBILITY_META[String(p.isVisible !== false) as keyof typeof VISIBILITY_META];
                          return (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
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
                    </td>
                    <td className="px-4 py-4">
                      {p.stock !== undefined && p.stock !== null ? (
                        <span className="font-medium text-stone-900">
                          {p.stock.toLocaleString()}개
                        </span>
                      ) : (
                        <span className="text-stone-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/shop/${p.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                          title="스토어에서 보기"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => onEdit(p)}
                          className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
