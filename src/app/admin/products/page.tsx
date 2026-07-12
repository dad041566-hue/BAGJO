'use client';

import React, { useState } from 'react';
import { useCategorySettings } from '@/components/providers/CategorySettingsProvider';
import { Plus, LayoutTemplate, AlertCircle, Package } from 'lucide-react';
import { useAdminProducts } from '@/hooks/admin/useAdminProducts';

import { ProductFilterBar } from '@/components/admin/products/ProductFilterBar';
import { ProductTable } from '@/components/admin/products/ProductTable';
import { ProductMobileCard } from '@/components/admin/products/ProductMobileCard';
import { ProductBulkActionBar } from '@/components/admin/products/ProductBulkActionBar';
import { ProductBulkDeleteModal } from '@/components/admin/products/ProductBulkDeleteModal';
import { ProductFormModal, type ProductFormData } from '@/components/admin/products/ProductFormModal';
import { CategoryManagementModal } from '@/components/admin/products/CategoryManagementModal';

import { createProduct, updateProduct } from '@/lib/storage';
import type { Product } from '@/types';

export default function AdminProductsDashboard() {
  const { categorySettings } = useCategorySettings();
  const {
    products,
    brands,
    loading,
    error,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedProducts,
    totalFiltered,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    refreshData,
    performBulkDelete,
    performBulkUpdateStatus,
    performBulkUpdateVisibility,
  } = useAdminProducts(20);

  const [activeGroup, setActiveGroup] = useState<'product' | 'lifestyle' | 'brand'>('product');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavingForm, setIsSavingForm] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Statistics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.catalogStatus === 'ready' || p.catalogStatus === 'draft').length; // Assuming 'ready' is preparing, wait, "판매 중" ? Usually ready = preparing? Actually in this app draft/ready/sold_out are the status. Let's assume ready = preparing, draft = draft. The requirement said "판매중/준비중/가격미정 상품 통계 제공"
  const unsetPriceCount = products.filter(p => p.price === null || p.price === undefined || String(p.price) === '' || p.price === 0).length;

  if (loading) {
    return <p className="p-12 text-center text-sm text-stone-500">상품 목록 불러오는 중…</p>;
  }

  if (error) {
    return (
      <div className="p-12 flex flex-col items-center text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
        <p className="text-stone-700">{error}</p>
        <button onClick={refreshData} className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl hover:bg-black">
          다시 시도
        </button>
      </div>
    );
  }

  const handleFormSubmit = async (data: ProductFormData, isEdit: boolean) => {
    setIsSavingForm(true);
    const brandName = brands.find((b) => b.id === data.brandId)?.name;
    const price = data.price.trim() ? Number(data.price) : null;

    if (isEdit && editingProduct) {
      const { error: updateError } = await updateProduct(editingProduct.id, {
        name: data.name.trim(),
        brandId: data.brandId,
        brandName,
        category: data.category,
        lifestyleCategory: data.lifestyleCategory || data.category,
        price,
      });
      if (updateError) {
        alert('상품 수정에 실패했습니다.');
      }
    } else {
      const { error: createError } = await createProduct({
        name: data.name.trim(),
        brandId: data.brandId,
        brandName,
        category: data.category,
        lifestyleCategory: data.lifestyleCategory || data.category,
        price,
        rating: 0,
        reviewCount: 0,
        concernTags: [],
        petType: 'both',
        ageGroup: 'all',
        image: '/images/icon-product.svg',
        stock: 0,
        description: data.name.trim(),
        isBest: false,
        isRecommended: false,
        catalogStatus: 'draft',
        isVisible: false,
      });
      if (createError) {
        alert('상품 등록에 실패했습니다.');
      }
    }

    setIsSavingForm(false);
    setIsFormModalOpen(false);
    setEditingProduct(null);
    await refreshData();
  };

  const handleBulkDelete = async () => {
    setIsProcessingBulk(true);
    const { failedItems } = await performBulkDelete(Array.from(selectedIds));
    setIsProcessingBulk(false);
    setIsDeleteModalOpen(false);

    if (failedItems.length > 0) {
      alert(`다음 ${failedItems.length}개 상품 삭제 실패:\n` + failedItems.map(f => f.id).join(', '));
    }
  };

  const selectedProductsList = products.filter(p => selectedIds.has(p.id));

  return (
    <div className="flex flex-col h-full bg-[#FAF9F5]">
      {/* Header Area */}
      <div className="px-8 py-6 bg-white border-b border-stone-200/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Package className="w-6 h-6" />
            상품 관리
          </h1>
          <p className="mt-1.5 text-sm text-stone-500">전체 상품 현황을 확인하고 관리합니다.</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-4 px-6 py-2 border-r border-stone-200">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-stone-400">전체 상품</span>
              <span className="text-lg font-bold text-stone-900">{totalProducts.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-stone-400">가격 미정</span>
              <span className="text-lg font-bold text-red-600">{unsetPriceCount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-stone-700 bg-white border border-stone-200 hover:border-stone-400 rounded-xl transition-all shadow-sm"
            >
              <LayoutTemplate className="w-4 h-4" />
              카테고리 관리
            </button>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsFormModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-stone-900 hover:bg-black rounded-xl transition-all shadow-md shadow-stone-900/10"
            >
              <Plus className="w-4 h-4" />
              새 상품 등록
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar Nav for Categories */}
        <div className="hidden md:flex w-64 flex-col bg-white border-r border-stone-200/50">
          <div className="p-3 border-b border-stone-100 flex gap-1 bg-stone-50/50 shrink-0">
            <button
              onClick={() => { setActiveGroup('product'); setFilters(prev => ({ ...prev, category: '', lifestyleCategory: '', brandId: '' })); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeGroup === 'product' ? 'bg-white shadow-sm text-stone-900 border border-stone-200/50' : 'text-stone-500 hover:bg-stone-100'}`}
            >
              일반
            </button>
            <button
              onClick={() => { setActiveGroup('lifestyle'); setFilters(prev => ({ ...prev, category: '', lifestyleCategory: '', brandId: '' })); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeGroup === 'lifestyle' ? 'bg-white shadow-sm text-stone-900 border border-stone-200/50' : 'text-stone-500 hover:bg-stone-100'}`}
            >
              라이프
            </button>
            <button
              onClick={() => { setActiveGroup('brand'); setFilters(prev => ({ ...prev, category: '', lifestyleCategory: '', brandId: '' })); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeGroup === 'brand' ? 'bg-white shadow-sm text-stone-900 border border-stone-200/50' : 'text-stone-500 hover:bg-stone-100'}`}
            >
              업체
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
            <button
              onClick={() => setFilters(prev => ({ ...prev, category: '', lifestyleCategory: '', brandId: '' }))}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                (activeGroup === 'product' && !filters.category) ||
                (activeGroup === 'lifestyle' && !filters.lifestyleCategory) ||
                (activeGroup === 'brand' && !filters.brandId)
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              전체 보기
            </button>

            {activeGroup === 'product' && categorySettings.productCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilters(prev => ({ ...prev, category: cat, lifestyleCategory: '', brandId: '' }))}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex justify-between items-center ${
                  filters.category === cat ? 'bg-stone-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="truncate">{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filters.category === cat ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-400'}`}>
                  {products.filter(p => p.category === cat).length}
                </span>
              </button>
            ))}

            {activeGroup === 'lifestyle' && categorySettings.lifestyleCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilters(prev => ({ ...prev, lifestyleCategory: cat, category: '', brandId: '' }))}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex justify-between items-center ${
                  filters.lifestyleCategory === cat ? 'bg-stone-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="truncate">{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filters.lifestyleCategory === cat ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-400'}`}>
                  {products.filter(p => p.lifestyleCategory === cat).length}
                </span>
              </button>
            ))}

            {activeGroup === 'brand' && brands.map(brand => (
              <button
                key={brand.id}
                onClick={() => setFilters(prev => ({ ...prev, brandId: brand.id, category: '', lifestyleCategory: '' }))}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex justify-between items-center ${
                  filters.brandId === brand.id ? 'bg-stone-900 text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="truncate">{brand.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filters.brandId === brand.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-400'}`}>
                  {products.filter(p => p.brandId === brand.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto p-8 relative">
          <ProductFilterBar
            filters={filters}
            setFilters={setFilters}
            brands={brands}
            categories={categorySettings.productCategories}
            lifestyleCategories={categorySettings.lifestyleCategories}
          />

          <div className="flex justify-between items-end mb-4">
            <p className="text-sm text-stone-500 font-medium">
              검색 결과 <span className="text-stone-900 font-bold">{totalFiltered}</span>건
            </p>
          </div>

          <div className="hidden md:block">
            <ProductTable
              products={paginatedProducts}
              brands={brands}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelection}
              onToggleSelectAll={toggleSelectAll}
              onEdit={(p) => {
                setEditingProduct(p);
                setIsFormModalOpen(true);
              }}
            />
          </div>

          <div className="md:hidden flex flex-col gap-3">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-sm border rounded-xl bg-white">표시할 상품이 없습니다.</div>
            ) : (
              paginatedProducts.map(p => (
                <ProductMobileCard
                  key={p.id}
                  product={p}
                  brand={brands.find(b => b.id === p.brandId)}
                  isSelected={selectedIds.has(p.id)}
                  onToggleSelect={toggleSelection}
                  onEdit={(prod) => {
                    setEditingProduct(prod);
                    setIsFormModalOpen(true);
                  }}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 pb-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-3 py-1.5 text-sm bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-50 transition-colors"
              >
                이전
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                  .map((p, i, arr) => (
                    <React.Fragment key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && <span className="px-2 py-1 text-stone-400">...</span>}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === p ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 py-1.5 text-sm bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-50 transition-colors"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>

      <ProductBulkActionBar
        selectedCount={selectedIds.size}
        onClearSelection={clearSelection}
        onRequestBulkDelete={() => setIsDeleteModalOpen(true)}
        onBulkUpdateStatus={async (status) => {
          const { failedItems } = await performBulkUpdateStatus(Array.from(selectedIds), status);
          if (failedItems.length > 0) alert(`상태 변경 일부 실패 (${failedItems.length}건)`);
        }}
        onBulkUpdateVisibility={async (isVisible) => {
          const { failedItems } = await performBulkUpdateVisibility(Array.from(selectedIds), isVisible);
          if (failedItems.length > 0) alert(`노출 변경 일부 실패 (${failedItems.length}건)`);
        }}
      />

      <ProductBulkDeleteModal
        isOpen={isDeleteModalOpen}
        selectedProducts={selectedProductsList}
        isProcessing={isProcessingBulk}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleBulkDelete}
      />

      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleFormSubmit}
        isSaving={isSavingForm}
        editingProduct={editingProduct}
        brands={brands}
        categories={categorySettings.productCategories}
        lifestyleCategories={categorySettings.lifestyleCategories}
        defaultBrandId={activeGroup === 'brand' ? filters.brandId : undefined}
        defaultCategory={activeGroup === 'product' ? filters.category : undefined}
        defaultLifestyleCategory={activeGroup === 'lifestyle' ? filters.lifestyleCategory : undefined}
      />

      <CategoryManagementModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
}
