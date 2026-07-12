import React, { useState, useEffect } from 'react';
import type { Brand, Product } from '@/types';
import { X } from 'lucide-react';

export interface ProductFormData {
  name: string;
  brandId: string;
  category: string;
  lifestyleCategory: string;
  price: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData, isEdit: boolean) => Promise<void>;
  isSaving: boolean;
  editingProduct: Product | null;
  brands: Brand[];
  categories: string[];
  lifestyleCategories: string[];
  defaultBrandId?: string;
  defaultCategory?: string;
  defaultLifestyleCategory?: string;
}

const emptyForm: ProductFormData = { name: '', brandId: '', category: '', lifestyleCategory: '', price: '' };

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
  editingProduct,
  brands,
  categories,
  lifestyleCategories,
  defaultBrandId,
  defaultCategory,
  defaultLifestyleCategory,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>(emptyForm);

  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        setForm({
          name: editingProduct.name,
          brandId: editingProduct.brandId,
          category: editingProduct.category,
          lifestyleCategory: editingProduct.lifestyleCategory ?? '',
          price: editingProduct.price !== null && editingProduct.price !== undefined ? String(editingProduct.price) : '',
        });
      } else {
        setForm({
          name: '',
          brandId: defaultBrandId || brands[0]?.id || '',
          category: defaultCategory || categories[0] || '',
          lifestyleCategory: defaultLifestyleCategory || '',
          price: '',
        });
      }
    }
  }, [isOpen, editingProduct, brands, categories, defaultBrandId, defaultCategory, defaultLifestyleCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.brandId || !form.category) {
      alert('상품명, 브랜드, 카테고리는 필수입니다.');
      return;
    }
    onSubmit(form, !!editingProduct);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-stone-100 bg-white flex justify-between items-center shrink-0">
          <h3 className="text-lg font-bold text-stone-900">{editingProduct ? '상품 수정' : '새 상품 등록'}</h3>
          <button type="button" onClick={onClose} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto bg-stone-50/30">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">상품명 <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400 rounded-xl px-4 py-2.5 text-sm transition-all"
              placeholder="예: 시그니처 연어 사료 2kg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">브랜드 <span className="text-red-500">*</span></label>
            <select
              required
              value={form.brandId}
              onChange={(e) => setForm({ ...form, brandId: e.target.value })}
              className="w-full border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400 rounded-xl px-4 py-2.5 text-sm bg-white transition-all"
            >
              <option value="" disabled>브랜드 선택...</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">일반 카테고리 <span className="text-red-500">*</span></label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400 rounded-xl px-4 py-2.5 text-sm bg-white transition-all"
              >
                <option value="" disabled>카테고리 선택...</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">라이프스타일 카테고리</label>
              <select
                value={form.lifestyleCategory}
                onChange={(e) => setForm({ ...form, lifestyleCategory: e.target.value })}
                className="w-full border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400 rounded-xl px-4 py-2.5 text-sm bg-white transition-all"
              >
                <option value="">(해당 없음)</option>
                {lifestyleCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5 flex justify-between">
              <span>판매가(원)</span>
              <span className="text-xs font-normal text-stone-400">비워두면 '가격 미등록'으로 표시</span>
            </label>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400 rounded-xl px-4 py-2.5 text-sm transition-all"
              placeholder="예: 32000"
            />
          </div>
        </div>
        
        <div className="px-6 py-5 border-t border-stone-100 bg-white flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSaving}
            className="px-5 py-2.5 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 hover:text-stone-900 transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button 
            type="submit" 
            disabled={isSaving} 
            className="px-5 py-2.5 text-sm font-medium text-white bg-stone-900 rounded-xl hover:bg-black transition-colors disabled:opacity-60 shadow-md shadow-stone-900/10"
          >
            {isSaving ? '저장 중...' : editingProduct ? '수정 완료' : '등록 완료'}
          </button>
        </div>
      </form>
    </div>
  );
}
