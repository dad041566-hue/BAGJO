'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, ShieldCheck,
  Droplet, Sparkles, Bone, Scale, Grid, Dog, Cat, Rabbit, Utensils, Bath, HeartPulse, Stethoscope, Store
} from 'lucide-react';
import { defaultHomeSettings, type HomeSettings } from '@/data/homeContent';
import BrandShowcaseSlider from '@/components/home/BrandShowcaseSlider';
import ProductCard from '@/components/common/ProductCard';
import ReviewCard from '@/components/common/ReviewCard';
import { sortProducts } from '@/lib/filters';
import { formatDate } from '@/lib/format';
import type { Brand, Notice, Product, Review } from '@/types';

// 줄바꿈�? 마크?�이 ?�니??구조(string[])�??�룬??§ homeContent). �?�??�이?�만 <br /> �?// ?�어 ?�드코딩 ?�절 DOM �??�일?�게 ?�더?�다. brClassName ?� 반응??줄바�??? 'hidden sm:block').
function renderLines(lines: string[], brClassName?: string) {
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br className={brClassName} />}
      {line}
    </Fragment>
  ));
}

// 문자????"<br />" ?�는 "<br>" 리터?�이 ?�함??경우�??�전?�게 ?�더링한??
// dangerouslySetInnerHTML ???�용?��? ?�고 split + Fragment 방식.
function renderTextWithBr(text: string) {
  const parts = text.split(/<br\s*\/?>/i);
  if (parts.length <= 1) return text;
  return parts.map((part, index) => (
    <Fragment key={`${part}-${index}`}>
      {index > 0 && <br />}
      {part}
    </Fragment>
  ));
}

export default function HomeClient({
  products,
  brands,
  notices,
  reviews,
  settings = defaultHomeSettings,
}: {
  products: Product[];
  brands: Brand[];
  notices: Notice[];
  reviews: Review[];
  settings?: HomeSettings;
}) {
  const bestProducts = sortProducts(
    products.filter((product) => product.isBest || product.isRecommended),
    'popular',
  ).slice(0, 3);
  const recentNotices = notices.slice(0, 4);
  const displayBrands = brands.filter(b => b.isVisible !== false);

  const { hero, quickShop, curation, audit, insuranceBanner, trustBoard } = settings;
  const bestProductsCopy = settings.bestProducts;

  // ?�이콘·href·?��?지 ??"구조"???�기 ?�드코딩?�로 ?�고, 문구�?settings �??�버?�이?�다.
  const quickLinks = [
    { icon: Grid, href: '/shop' },
    { icon: Dog, href: '/shop?petType=dog' },
    { icon: Cat, href: '/shop?petType=cat' },
    { icon: Rabbit, href: '/shop?petType=small' },
    { icon: Utensils, href: '/shop?category=dining-and-nourish' },
    { icon: Bath, href: '/shop?category=fragrance-and-hygiene' },
    { icon: HeartPulse, href: '/shop?category=wellness-and-care' },
    { icon: Stethoscope, href: '/concerns' },
    { icon: Store, href: '/brands' },
  ];

  const curationCards = [
    { icon: Droplet, href: '/concerns/tear', img: '/images/curation_tear.png' },
    { icon: Sparkles, href: '/concerns/skin', img: '/images/curation_skin.png' },
    { icon: Bone, href: '/concerns/joint', img: '/images/curation_joint.png' },
    { icon: Scale, href: '/concerns/obesity', img: '/images/curation_weight.png' },
  ];

  return (
    <main className="home-page min-h-screen bg-white">
      
      {/* ?�?�?� 1. Intro Stage ?�?�?� */}
      <section className="home-intro pt-[32px] lg:pt-[48px]">
        <div className="mx-auto w-full max-w-[1264px] px-[20px] md:px-[24px] lg:px-[32px]">
          
          {/* Hero */}
          <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,0.41fr)_minmax(0,0.59fr)] lg:items-center gap-[28px] lg:gap-[48px]">
            <div className="flex w-full flex-col items-start">
              <span className="block text-[11px] lg:text-[13px] font-bold tracking-[0.15em] text-[#B68B4E] uppercase mb-4 md:mb-5">{hero.eyebrow}</span>
              <h1 className="text-[32px] md:text-[38px] lg:text-[48px] font-[700] leading-[1.18] tracking-[-0.035em] text-[#17231E] break-keep min-w-0">
                {renderLines(hero.titleLines)}
              </h1>
              <p className="mt-[20px] lg:mt-[24px] max-w-[450px] text-[14px] md:text-[15px] leading-[1.7] text-[#6F746F] break-keep min-w-0">
                {renderLines(hero.descriptionLines, 'hidden sm:block')}
              </p>
              <div className="mt-[26px] flex flex-col sm:flex-row gap-[10px] w-full sm:w-auto">
                <Link href="/shop" className="flex h-[44px] lg:h-[46px] items-center justify-center rounded-[10px] lg:rounded-[12px] bg-[#173C32] px-[24px] gap-[10px] text-[14px] font-semibold text-white transition-colors hover:bg-[#2F3B34]">
                  {hero.primaryCtaLabel}
                </Link>
                <Link href="/concerns" className="flex h-[44px] lg:h-[46px] items-center justify-center rounded-[10px] lg:rounded-[12px] border border-[#DCD8CF] bg-transparent px-[24px] gap-[10px] text-[14px] font-semibold text-[#26312C] transition-colors hover:border-[#173C32]">
                  {hero.secondaryCtaLabel}
                </Link>
              </div>
              <div className="mt-[16px] flex items-center gap-2 text-[13px] font-medium text-[#99978F]">
                <ShieldCheck className="size-4 text-[#B99562]" strokeWidth={2} />
                {hero.trustNote}
              </div>
            </div>
            <div className="w-full h-[290px] lg:h-[380px] relative overflow-hidden rounded-[20px]">
              <Image src="/images/poodle-pet-food.png" alt="백조?�브?????�드?� ?�들" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
              <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-xl bg-white/50 border border-white/20 backdrop-blur-md px-3 py-2 shadow-sm">
                <ShieldCheck className="size-4 text-[#2E7D32]" strokeWidth={2} />
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold leading-none text-[#18231F]">{hero.badgeTitle}</span>
                  <span className="mt-0.5 text-[10px] text-[#26312C]">{hero.badgeSubtitle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit */}
          <div 
            id="home-audit-title"
            className="mt-[20px] lg:mt-[24px] flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_250px] xl:grid-cols-[minmax(0,1fr)_280px] gap-[24px] lg:gap-[24px] xl:gap-[28px] rounded-[18px] border border-[#E7E2D9] bg-[#F6F3ED] overflow-hidden h-auto lg:min-h-[190px]"
          >
            <div className="flex w-full flex-col justify-center min-w-0 p-[24px] lg:p-[26px_30px]">
              <span className="text-[12px] font-[700] tracking-[0.08em] text-[#A48D67] uppercase">
                {audit.badge}
              </span>
              
              <h2 className="mt-[12px] font-bold tracking-tight text-[#17231E] text-[24px] md:text-[28px] lg:text-[32px] leading-[1.35] break-keep min-w-0">
                <span className="block whitespace-nowrap">브랜?��? ?�택?�기 ?�에</span>
                <span className="block whitespace-nowrap">?�리??먼�? 검증합?�다.</span>
              </h2>
              
              <p className="mt-[12px] max-w-[520px] line-clamp-2 break-keep text-[14px] leading-[1.65] text-[#6E746F]">
                {audit.description}
              </p>

              <div className="mt-[18px] flex flex-wrap xl:flex-nowrap items-center gap-x-[14px] gap-y-[10px]">
                <div className="flex items-center gap-[14px]">
                  <div className="flex items-baseline gap-1.5">
                     <span className="font-editorial text-[28px] leading-none text-[#17211D]">100</span>
                     <span className="text-[13px] font-medium text-[#6E746F]">개의 브랜??�?/span>
                  </div>
                  <div className="h-[24px] w-[1px] bg-[#E7E2D9]"></div>
                  <div className="flex items-baseline gap-1.5">
                     <span className="font-editorial text-[28px] leading-none text-[#B68B4E]">5</span>
                     <span className="text-[13px] font-medium text-[#6E746F]">개만 ?�택?�니??</span>
                  </div>
                </div>

                <Link
                  href="/audit"
                  className="group inline-flex h-[40px] items-center justify-center rounded-full bg-[#173C32] px-[18px] text-[13px] font-bold text-white transition-colors hover:bg-[#2F3B34] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173C32] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F3ED]"
                >
                  {audit.linkLabel} <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-[3px]" />
                </Link>
              </div>
            </div>

            <div className="w-full flex items-center justify-center p-[24px] pt-0 lg:p-0 lg:pr-[30px]">
              <div className="relative w-full max-w-[300px] lg:w-[250px] xl:w-[280px] h-[130px] rounded-[14px] overflow-hidden">
                <Image 
                  src="/images/baekjo-audit-logo.png" 
                  alt="백조 ?�브??고양?��? �?브랜??로고" 
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 280px"
                  className="object-cover saturate-[0.82] brightness-[1.04]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ?�?�?� 2. Discovery Commerce Stage ?�?�?� */}
      <section className="home-discovery mt-[56px] lg:mt-[72px]">
        <div className="mx-auto w-full max-w-[1264px] px-[20px] md:px-[24px] lg:px-[32px]">
          
          <div className="w-full">
            
            {/* Quick Nav */}
            <div className="mb-[28px] flex min-h-[60px] h-auto flex-col bg-transparent py-2 lg:flex-row lg:items-center lg:justify-between lg:py-0">
              <div className="flex shrink-0 items-center pb-4 lg:w-[140px] lg:pb-0 lg:pr-8 lg:border-r lg:border-[#E7E2D9]/70 border-b border-[#E7E2D9]/70 lg:border-b-0">
                <h2 className="text-[16px] font-bold tracking-tight text-[#17211D] md:text-[17px]">빠른 ?�핑</h2>
              </div>
              <div className="hide-scrollbar flex w-full flex-1 items-center justify-between overflow-x-auto overscroll-x-contain pt-4 lg:pl-6 lg:pt-0 gap-[16px] lg:gap-0">
                {quickLinks.map((link, i) => {
                  const Icon = link.icon;
                  const name = quickShop.links[i]?.name ?? '';
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className="group shrink-0 flex flex-col items-center justify-center gap-[8px] min-w-[56px] lg:min-w-0 p-1 rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173C32]"
                    >
                      <div className="flex size-[48px] items-center justify-center rounded-[12px] bg-transparent text-[#17211D] transition-colors group-hover:bg-[#E8EFEA] group-focus-visible:bg-[#E8EFEA] md:size-[52px] lg:size-[44px]">
                        <Icon className="size-[18px] lg:size-[20px]" strokeWidth={1.5} />
                      </div>
                      <span className="whitespace-nowrap text-[12px] lg:text-[13px] font-medium tracking-tight text-[#6E746F] group-hover:text-[#173C32] group-focus-visible:text-[#173C32]">{name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Curation */}
            <div className="mb-[24px] flex flex-col lg:flex-row lg:items-end lg:justify-between gap-[20px] lg:gap-[32px]">
              <div>
                <h2 className="text-[22px] md:text-[24px] lg:text-[29px] font-bold tracking-tight text-[#17211D] leading-[1.35] truncate min-w-0">
                  {curation.title.replace(/<br\s*\/?>/gi, ' ')}
                </h2>
                <p className="mt-[7px] text-[14px] text-[#68706B] leading-[1.6] max-w-[650px] truncate min-w-0">
                  {curation.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-[10px] shrink-0">
                <Link href="/diagnosis" className="flex h-[40px] items-center justify-center rounded-lg bg-[#E8EFEA] px-4 md:px-5 text-[13px] md:text-[14px] font-bold text-[#173C32] transition-colors hover:bg-[#D1E0D6]">
                  {curation.diagnosisLinkLabel}
                </Link>
                <Link href="/concerns" className="group flex h-[40px] items-center justify-center rounded-lg border border-[#E8E3DA] bg-white px-4 md:px-5 text-[13px] md:text-[14px] font-bold text-[#68706B] transition-colors hover:border-[#173C32] hover:text-[#173C32]">
                  {curation.allConcernsLinkLabel} <ArrowRight className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-[4px]" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
              {curationCards.map((card, i) => {
                const title = curation.cards[i]?.title ?? '';
                const desc = curation.cards[i]?.desc ?? '';
                return (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="group relative flex min-w-0 flex-col overflow-hidden rounded-[16px] bg-white h-[210px] lg:h-[228px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173C32]"
                  >
                    <div className="absolute inset-0 h-full w-full overflow-hidden bg-black z-0">
                      <Image
                        src={card.img}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    {/* Base weak overlay */}
                    <div className="absolute inset-0 bg-black/[0.08] pointer-events-none z-10" />
                    {/* Bottom gradient overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none z-10" />
                    
                    <div className="relative z-20 flex flex-col justify-end p-[18px] h-full break-keep">
                      <div className="mb-1 flex items-center gap-2">
                         <span className="text-[18px] lg:text-[19px] font-bold text-white">{title}</span>
                      </div>
                      <span className="text-[12px] lg:text-[13px] font-medium leading-[1.55] text-[#F5F1E9] line-clamp-2">{renderTextWithBr(desc)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Product Recommendation */}
            <div className="mt-[40px] border-t border-[#E7E2D9] pt-[36px] lg:mt-[48px] lg:pt-[40px]">
              <div className="flex items-end justify-between mb-[24px]">
                <h2 className="text-[22px] md:text-[24px] lg:text-[29px] font-bold tracking-tight text-[#17211D] leading-[1.35] truncate min-w-0">{bestProductsCopy.title}</h2>
                <Link href="/shop" className="group hidden sm:flex items-center text-[13px] font-bold text-[#68706B] transition-colors hover:text-[#173C32] focus-visible:outline-none focus-visible:underline">
                  {bestProductsCopy.linkLabel} <ArrowRight className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-[4px]" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:gap-5">
                {bestProducts.map((product) => (
                  <div key={product.id} className="min-w-0">
                    <ProductCard product={product} variant="home" />
                  </div>
                ))}
              </div>
              <Link href="/shop" className="mt-8 flex w-full h-[48px] items-center justify-center rounded-xl border border-[#DED8CC] text-[14px] font-bold text-[#18231F] sm:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173C32]">
                {bestProductsCopy.linkLabel}
              </Link>
            </div>
            
          </div>
        </div>
      </section>

      {/* ?�?�?� 3. Brand Trust Stage ?�?�?� */}
      <section className="home-trust mt-[64px] bg-white py-[56px] lg:mt-[80px] lg:py-[80px]">
        <div className="mx-auto w-full max-w-[1264px] px-[20px] md:px-[24px] lg:px-[32px]">
          
          <BrandShowcaseSlider brands={displayBrands} />

          {/* Insurance Banner */}
          <div className="mt-[52px] lg:mt-[64px] grid min-h-[250px] lg:min-h-[270px] overflow-hidden rounded-[20px] bg-white border border-[#E7E2D9]/70 shadow-none lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
            <div className="flex flex-col justify-center p-[20px] md:p-[24px] lg:p-[38px] min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="size-4 text-[#173C32]" strokeWidth={2} />
                <span className="text-[12px] md:text-[13px] font-semibold text-[#173C32]">{insuranceBanner.eyebrow}</span>
              </div>
              <h2 className="text-[22px] md:text-[24px] lg:text-[28px] font-bold leading-[1.3] tracking-tight text-[#17211D] break-keep min-w-0">
                {insuranceBanner.title}
              </h2>
              <p className="mt-2 text-[13px] lg:text-[14px] leading-[1.6] text-[#68706B] break-keep min-w-0 max-w-[420px]">
                {insuranceBanner.description}
              </p>
              <div className="mt-5">
                <Link href="/insurance" className="inline-flex h-[42px] items-center justify-center rounded-xl bg-[#173C32] px-6 text-[13px] font-bold text-white transition-colors hover:bg-[#214D41]">
                  {insuranceBanner.buttonLabel}
                </Link>
              </div>
            </div>
            <div className="relative min-h-[210px] lg:min-h-0">
              <Image src="/images/care_guide_hero.png" alt="강아지?� 고양?? fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center scale-x-[-1]" />
            </div>
          </div>

          {/* Review and Notice Editorial Layout */}
          <div className="mt-[52px] lg:mt-[64px] grid grid-cols-1 gap-[40px] lg:grid-cols-[minmax(0,0.64fr)_minmax(0,0.36fr)] lg:gap-[40px]">
            
            {/* Review Section */}
            <div>
              <div className="flex items-end justify-between mb-[22px] lg:mb-[24px]">
                <h2 className="text-[22px] md:text-[24px] lg:text-[29px] font-bold tracking-tight text-[#17211D] leading-[1.35] truncate min-w-0">{trustBoard.reviewsTitle}</h2>
                <Link href="/reviews" className="group flex items-center text-[13px] font-bold text-[#68706B] transition-colors hover:text-[#173C32]">
                  {trustBoard.reviewsLinkLabel} <ArrowRight className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-[4px]" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
                {reviews.slice(0, 2).map(review => (
                  <div key={review.id} className="border-t border-[#DED8CE] py-[22px] bg-transparent">
                    <ReviewCard
                      review={review}
                      productName={products.find((p) => p.id === review.productId)?.name}
                      variant="home"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Notice Section */}
            <div>
              <div className="flex items-end justify-between mb-[22px] lg:mb-[24px]">
                <h2 className="text-[22px] md:text-[24px] lg:text-[29px] font-bold tracking-tight text-[#17211D] leading-[1.35] truncate min-w-0">{trustBoard.noticesTitle}</h2>
                <Link href="/notices" className="group flex items-center text-[13px] font-bold text-[#68706B] transition-colors hover:text-[#173C32]">
                  {trustBoard.noticesLinkLabel} <ArrowRight className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-[4px]" />
                </Link>
              </div>
              <div className="border-t border-[#DED8CE]">
                {recentNotices.map((notice) => (
                  <Link key={notice.id} href={`/notices/${notice.id}`} className="group flex items-center justify-between gap-4 border-b border-[#E7E2D9] min-h-[56px] md:min-h-[64px] py-[16px] md:py-[18px] transition-colors hover:bg-black/5 min-w-0">
                    <p className="min-w-0 break-keep pr-4 text-[14px] font-medium text-[#17211D] transition-colors group-hover:text-[#173C32] truncate">
                      {notice.title}
                    </p>
                    <time className="shrink-0 font-editorial text-[12px] italic text-[#68706B]">
                      {formatDate(notice.date)}
                    </time>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
