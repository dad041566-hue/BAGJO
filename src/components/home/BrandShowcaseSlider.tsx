'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Package, ShieldCheck } from 'lucide-react';
import { Brand, Product } from '@/types';
import ProductCard from '@/components/common/ProductCard';
import BrandLogo from '@/components/common/BrandLogo';

interface Props {
  brands: Brand[];
  productsByBrand: Record<string, Product[]>;
}

const extractNames = (fullName: string) => {
  const match = fullName.match(/(.*?)\s*\((.*?)\)/);
  if (match) return { ko: match[1].trim(), en: match[2].trim() };
  return { ko: fullName, en: fullName };
};

const getBrandCategory = (products: Product[]) => {
  const category = products[0]?.category;
  if (category === '식사와 영양') return '식사 · 영양';
  if (category === '건강과 케어') return '건강 · 케어';
  if (category === '구강과 위생') return '위생 · 냄새';
  if (category === '그루밍과 브러싱') return '그루밍';
  if (category === '패션과 액세서리') return '패션 · 액세서리';
  if (category === '생활과 오브제') return '생활 · 오브제';
  return '반려생활 셀렉션';
};

export default function BrandShowcaseSlider({ brands, productsByBrand }: Props) {
  const [shuffledBrands, setShuffledBrands] = useState<Brand[]>(brands);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasShuffled, setHasShuffled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const brandRailRef = useRef<HTMLDivElement>(null);

  const displayList = useMemo(() => {
    if (shuffledBrands.length === 0) return [];
    // 3배수로 복제하여 무한 스크롤(루프) 효과를 줌
    return [...shuffledBrands, ...shuffledBrands, ...shuffledBrands];
  }, [shuffledBrands]);

  // 클라이언트 마운트 시 브랜드를 랜덤으로 섞음 (Hydration 에러 방지)
  useEffect(() => {
    if (!hasShuffled && brands.length > 0) {
      const shuffled = [...brands].sort(() => Math.random() - 0.5);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShuffledBrands(shuffled);
      setActiveIndex(shuffled.length); // 가운데 세트부터 시작
      setHasShuffled(true);
      
      // 초기 스크롤 위치 맞추기
      setTimeout(() => {
        const initialTab = document.getElementById(`brand-tab-${shuffled.length}`);
        if (initialTab && brandRailRef.current) {
          initialTab.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
        }
      }, 50);
    }
  }, [brands, hasShuffled]);

  // 무한 루프 경계 처리 (양 끝에 도달하면 가운데 세트로 위치 순간이동)
  const handleScrollAndBoundary = useCallback((index: number) => {
    const N = shuffledBrands.length;
    if (N === 0) return index;

    let targetIndex = index;
    let shouldJump = false;

    // 만약 3번째 세트(2*N) 이상으로 가거나, 1번째 세트(N 미만)로 너무 치우치면
    if (index >= N * 2) {
      targetIndex = index - N;
      shouldJump = true;
    } else if (index < N && index === 0) {
      targetIndex = index + N;
      shouldJump = true;
    }

    if (shouldJump && brandRailRef.current) {
      const rail = brandRailRef.current;
      const targetTab = document.getElementById(`brand-tab-${targetIndex}`);
      const currentTab = document.getElementById(`brand-tab-${index}`);
      
      if (targetTab && currentTab) {
        const diff = targetTab.offsetLeft - currentTab.offsetLeft;
        rail.scrollBy({ left: diff, behavior: 'auto' }); // 부드럽지 않게 즉시 이동
      }
    }
    
    return targetIndex;
  }, [shuffledBrands.length]);

  // 자동 슬라이드 (오토 플레이)
  useEffect(() => {
    if (!hasShuffled || shuffledBrands.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = prev + 1;
        const nextTab = document.getElementById(`brand-tab-${nextIndex}`);
        if (nextTab && brandRailRef.current) {
          const rail = brandRailRef.current;
          const tabRect = nextTab.getBoundingClientRect();
          const railRect = rail.getBoundingClientRect();
          
          if (tabRect.left < railRect.left || tabRect.right > railRect.right) {
            nextTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
        
        // 경계 검사 후 보정된 인덱스 반환
        return handleScrollAndBoundary(nextIndex);
      });
    }, 2500);

    return () => clearInterval(timer);
  }, [hasShuffled, shuffledBrands, isHovered, handleScrollAndBoundary]);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(displayList.length > 1);

  const updateRailState = useCallback(() => {
    const rail = brandRailRef.current;
    if (!rail) return;
    setCanScrollLeft(rail.scrollLeft > 4);
    setCanScrollRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateRailState();
    window.addEventListener('resize', updateRailState);
    return () => window.removeEventListener('resize', updateRailState);
  }, [displayList.length, updateRailState]);

  const scrollBrands = (direction: 'left' | 'right') => {
    brandRailRef.current?.scrollBy({
      left: direction === 'right' ? 520 : -520,
      behavior: 'smooth',
    });
  };

  const selectedBrand = displayList[activeIndex] ?? shuffledBrands[0];
  const selectedProducts = selectedBrand ? productsByBrand[selectedBrand.id] ?? [] : [];
  const displayProducts = selectedProducts.slice(0, 2);
  // 원래 배열 기준 인덱스 (1~N)
  const originalIndex = selectedBrand ? shuffledBrands.findIndex((brand) => brand.id === selectedBrand.id) + 1 : 0;
  const totalProducts = useMemo(
    () => shuffledBrands.reduce((total, brand) => total + (productsByBrand[brand.id]?.length ?? 0), 0),
    [shuffledBrands, productsByBrand],
  );

  if (!selectedBrand) return null;

  const selectedNames = extractNames(selectedBrand.name);
  const selectedCategory = getBrandCategory(selectedProducts);
  const verificationLabel = selectedBrand.auditReport ? '백조 검증 완료' : '입점 자료 확인 중';

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="home-label">08 curated houses</p>
          <h3 className="text-[22px] font-bold leading-[1.25] tracking-tight text-[#18231F] sm:text-[26px]">
            브랜드의 기준까지 고른 셀렉션
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[13px] font-semibold text-[#68716C]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2EEE5] px-3 py-1.5 text-[#B99562]">
            <ShieldCheck className="size-4" strokeWidth={1.5} />
            브랜드 {shuffledBrands.length}곳
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DED8CC] bg-white px-3 py-1.5">
            <Package className="size-4" strokeWidth={1.5} />
            상품 {totalProducts}개
          </span>
        </div>
      </div>

      <div className="relative group/slider">
        <button
          type="button"
          onClick={() => scrollBrands('left')}
          disabled={!canScrollLeft}
          aria-label="이전 브랜드"
          className="absolute -left-5 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#DED8CC] bg-white text-[#18231F] shadow-sm transition-all duration-300 hover:border-[#B99562] disabled:pointer-events-none disabled:opacity-0 lg:flex"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} />
        </button>

        <div
          ref={brandRailRef}
          onScroll={updateRailState}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 scrollbar-hide lg:gap-4"
        >
          {displayList.map((brand, index) => {
            const isSelected = activeIndex === index;
            const names = extractNames(brand.name);
            const products = productsByBrand[brand.id] ?? [];
            const originalI = shuffledBrands.findIndex(b => b.id === brand.id);

            return (
              <button
                key={`${brand.id}-${index}`}
                id={`brand-tab-${index}`}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  const rail = brandRailRef.current;
                  const tab = document.getElementById(`brand-tab-${index}`);
                  if (rail && tab) {
                    tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }
                }}
                aria-pressed={isSelected}
                className={`group relative min-h-[132px] w-[180px] shrink-0 snap-start overflow-hidden rounded-[16px] p-4 text-left transition-all duration-300 sm:w-[200px] lg:w-[calc(16.666%-13.333px)] ${
                  isSelected
                    ? 'border-[1.5px] border-[#18231F] bg-[#1A2F25] text-white shadow-md'
                    : 'border border-[#DED8CC] bg-white text-[#18231F] hover:border-[#B99562]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`font-editorial text-[20px] italic ${isSelected ? 'text-[#B99562]' : 'text-[#B99562] opacity-70'}`}>
                    {String(originalI + 1).padStart(2, '0')}
                  </span>
                  <ArrowRight className={`size-4 transition-transform duration-300 group-hover:translate-x-0.5 ${isSelected ? 'text-[#B99562]' : 'text-[#68716C]'}`} strokeWidth={1.5} />
                </div>

                <BrandLogo brand={brand} size="md" surface className="mt-3" />

                <div className="mt-3">
                  <p className={`truncate text-[14px] font-bold ${isSelected ? 'text-white' : 'text-[#18231F]'}`}>{names.ko}</p>
                  <p className={`mt-0.5 truncate text-[10px] font-medium uppercase tracking-[0.15em] ${isSelected ? 'text-[#B99562]' : 'text-[#68716C]'}`}>
                    {names.en}
                  </p>
                </div>

                <div className={`absolute bottom-3 right-3 text-[10px] font-medium ${isSelected ? 'text-[#B99562]' : 'text-[#68716C]'}`}>
                  {products.length} items
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollBrands('right')}
          disabled={!canScrollRight}
          aria-label="다음 브랜드"
          className="absolute -right-5 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#DED8CC] bg-white text-[#18231F] shadow-sm transition-all duration-300 hover:border-[#B99562] disabled:pointer-events-none disabled:opacity-0 lg:flex"
        >
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-8 grid overflow-hidden rounded-[24px] border border-[#DED8CC] bg-[var(--home-surface)] lg:grid-cols-[34%_66%]">
        <div className="bg-[var(--home-surface-muted)] p-6 sm:p-8 lg:p-10">
          <div className="flex items-center justify-between">
            <p className="font-editorial text-[17px] italic text-[#B99562]">
              {String(originalIndex).padStart(2, '0')} / {String(shuffledBrands.length).padStart(2, '0')}
            </p>
            <span className="rounded-full border border-[#DED8CC] bg-white px-3 py-1 text-[11px] font-semibold tracking-wider text-[#68716C]">
              {selectedCategory}
            </span>
          </div>

          <div className="mt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#68716C]">Baekjo selected brand</p>
            <BrandLogo brand={selectedBrand} size="lg" surface className="mt-4" />
            <h4 className="mt-4 text-[26px] font-bold leading-[1.25] tracking-tight text-[#18231F] sm:text-[32px]">
              {selectedNames.ko}
            </h4>
            <p className="mt-1 font-editorial text-[18px] italic text-[#B99562]">{selectedNames.en}</p>
            <p className="mt-6 max-w-[440px] break-keep text-[14px] leading-[1.8] text-[#68716C]">
              {selectedBrand.description}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#DED8CC] bg-[var(--home-surface)] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#B99562]">Curation status</p>
              <p className="mt-1 text-[14px] font-bold text-[#18231F]">{verificationLabel}</p>
            </div>
            <div className="rounded-xl border border-[#DED8CC] bg-[var(--home-surface)] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#B99562]">In-house selection</p>
              <p className="mt-1 text-[14px] font-bold text-[#18231F]">상품 {selectedProducts.length}개</p>
            </div>
          </div>

          <ul className="mt-8 space-y-3">
            {selectedBrand.auditPoints.slice(0, 3).map((point) => (
              <li key={point} className="flex items-start gap-2.5 break-keep text-[13px] leading-[1.6] text-[#68716C]">
                <Check className="mt-0.5 size-4 shrink-0 text-[#B99562]" strokeWidth={2} />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/brands/${selectedBrand.id}`}
              className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#DED8CC] bg-[var(--home-surface)] text-[14px] font-bold text-[#18231F] transition-all duration-300 hover:border-[#B99562]"
            >
              브랜드 스토리 <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={`/shop?brandId=${selectedBrand.id}`}
              className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#18231F] text-[14px] font-bold text-white transition-all duration-300 hover:bg-[#2F3B34]"
            >
              전체 상품 보기 <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="min-w-0 bg-[var(--home-surface)] p-6 sm:p-8 lg:p-10">
          <div className="flex items-end justify-between border-b border-[#DED8CC] pb-5">
            <div>
              <p className="font-editorial text-[17px] italic text-[#B99562]">Selected products</p>
              <h5 className="mt-1 text-[20px] font-bold tracking-tight text-[#18231F]">대표 상품</h5>
            </div>
            <span className="text-[12px] font-medium text-[#68716C]">백조오브제에서 판매</span>
          </div>

          {displayProducts.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-4">
              {displayProducts.map((product) => (
                <div key={product.id} className="min-w-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[220px] items-center justify-center text-center">
              <p className="text-[14px] leading-[1.7] text-[#68716C]">등록된 대표 상품을 준비 중입니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
