import React from 'react';
import { Search } from 'lucide-react';
import type { ProductFilterState } from '@/hooks/admin/useAdminProducts';
import type { Brand } from '@/types';
import { CATALOG_STATUS_META, VISIBILITY_META } from '@/lib/products/constants';

interface ProductFilterBarProps {
  filters: ProductFilterState;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilterState>>;
  brands: Brand[];
  categories: string[];
  lifestyleCategories: string[];
}

export function ProductFilterBar({
  filters,
  setFilters,
  brands,
  categories,
  lifestyleCategories,
}: ProductFilterBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      searchKeyword: '',
      brandId: '',
      category: '',
      lifestyleCategory: '',
      catalogStatus: '',
      isVisible: '',
      priceStatus: '',
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200/50 mb-6 flex flex-col gap-4">
      {/* Search row */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          name="searchKeyword"
          value={filters.searchKeyword}
          onChange={handleChange}
          placeholder="상품명 또는 상품 코드 검색..."
          className="w-full pl-10 pr-4 py-2 bg-stone-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-stone-300 transition-shadow"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          name="brandId"
          value={filters.brandId}
          onChange={handleChange}
          className="px-3 py-1.5 bg-stone-50 border-none rounded-lg text-sm min-w-[120px]"
        >
          <option value="">전체 브랜드</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="px-3 py-1.5 bg-stone-50 border-none rounded-lg text-sm min-w-[120px]"
        >
          <option value="">일반 카테고리 (전체)</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          name="lifestyleCategory"
          value={filters.lifestyleCategory}
          onChange={handleChange}
          className="px-3 py-1.5 bg-stone-50 border-none rounded-lg text-sm min-w-[120px]"
        >
          <option value="">라이프스타일 (전체)</option>
          {lifestyleCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          name="catalogStatus"
          value={filters.catalogStatus}
          onChange={handleChange}
          className="px-3 py-1.5 bg-stone-50 border-none rounded-lg text-sm min-w-[120px]"
        >
          <option value="">판매 상태 (전체)</option>
          {Object.entries(CATALOG_STATUS_META).map(([key, meta]) => (
            <option key={key} value={key}>{meta.label}</option>
          ))}
        </select>

        <select
          name="isVisible"
          value={filters.isVisible}
          onChange={handleChange}
          className="px-3 py-1.5 bg-stone-50 border-none rounded-lg text-sm min-w-[120px]"
        >
          <option value="">노출 상태 (전체)</option>
          <option value="true">{VISIBILITY_META.true.label}</option>
          <option value="false">{VISIBILITY_META.false.label}</option>
        </select>

        <select
          name="priceStatus"
          value={filters.priceStatus}
          onChange={handleChange}
          className="px-3 py-1.5 bg-stone-50 border-none rounded-lg text-sm min-w-[120px]"
        >
          <option value="">가격 상태 (전체)</option>
          <option value="UNSET">가격 미등록</option>
          <option value="ZERO">0원</option>
          <option value="VALID">정상가 등록됨</option>
        </select>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors ml-auto"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
