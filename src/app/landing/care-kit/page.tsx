import Image from 'next/image';
import { Activity, FileText, Gift, ShieldCheck } from 'lucide-react';
import { EditorialActionLink, EditorialIconBadge } from '@/components/common/EditorialControls';
import { PageIntro, SectionHeading } from '@/components/common/EditorialHeading';

export const metadata = {
  title: '케어 키트 | 백조오브제',
  description: '동물병원, 장례식장, 그리고 보호자를 위한 백조오브제의 특별한 케어 키트입니다.',
};

const careKits = [
  {
    icon: Activity,
    number: '01',
    title: '활력 케어 키트',
    description: '일상에서 꼭 필요한 영양과 구강 관리 위주의 구성. 3일 체험용',
    target: '기초 건강 관리가 필요한 아이',
  },
  {
    icon: ShieldCheck,
    number: '02',
    title: '병원 케어 키트',
    description: '진료 후 회복을 돕는 영양식과 처방 보조 제품군',
    target: '내원 및 치료 후 회복기 아이',
  },
  {
    icon: Gift,
    number: '03',
    title: '웰컴 키트',
    description: '반려동물을 처음 맞이한 가족을 위한 필수 가이드와 입문 용품',
    target: '입양 또는 첫 만남',
  },
  {
    icon: FileText,
    number: '04',
    title: '위로 키트',
    description: '이별의 순간을 돕는 작은 위로와 기억을 담은 굿즈',
    target: '이별을 준비하거나 맞이한 가족',
  },
];

const fieldClass =
  'w-full border-b border-[#E7E0D5] bg-transparent pb-3 pt-3 text-[15px] text-[#17211D] placeholder:text-[#6F766F]/45 transition-colors duration-300 focus:border-[#A8742E] focus:outline-none';

const labelClass = 'block text-[12px] font-bold tracking-wide text-[#6F766F]';

export default function CareKitLandingPage() {
  return (
    <div className="page-canvas">
      <section className="bg-noise border-b border-[#E7E0D5] bg-[#F7F4ED] py-12 md:py-14 lg:py-16">
        <div className="site-container-wide grid items-center gap-8 md:gap-10 lg:grid-cols-12 lg:gap-16">
          <PageIntro
            className="lg:col-span-6"
            eyebrow="Baekjo Care Kit"
            title={
              <>
                가장 도움이 필요한 순간,
                <br />
                작은 위로를 전합니다
              </>
            }
            description={
              <p>
                단순한 샘플 묶음이 아닙니다. 백조오브제 케어 키트는 동물병원, 장례식장, 파트너 브랜드와 함께
                보호자가 가장 도움이 필요한 순간에 받을 수 있는 실질적인 케어 가이드입니다.
              </p>
            }
            action={<EditorialActionLink href="#partner">제휴 문의하기</EditorialActionLink>}
          />

          <div className="relative h-[300px] overflow-hidden rounded-[24px] border border-[#E7E0D5] bg-white sm:h-[360px] lg:col-span-6 lg:h-[410px]">
            <Image
              src="/images/care_guide_hero.png"
              alt="보호자에게 필요한 순간을 위한 백조오브제 케어 키트"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#17211D]/85 via-[#17211D]/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-[#FBFAF7] sm:p-8">
              <p className="font-editorial text-sm italic tracking-wide text-[#D8C4A3]">Four moments of care</p>
              <p className="mt-2 max-w-lg break-keep text-[20px] font-bold leading-[1.35] text-[#FBFAF7] sm:text-[24px]">
                각 상황에 꼭 필요한 성분과 제품만 선별했습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="site-container-wide">
          <SectionHeading
            eyebrow="Care kit collection"
            title="4가지 맞춤 케어 키트"
            description={<p>각 상황에 꼭 필요한 성분과 제품만 선별했습니다.</p>}
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
            {careKits.map((kit) => {
              const Icon = kit.icon;
              return (
                <article
                  key={kit.number}
                  className="group flex h-full flex-col rounded-[20px] border border-[#E7E0D5] bg-white p-5 transition-all duration-700 ease-out hover:-translate-y-1 hover:border-[#D8C4A3] hover:shadow-[0_20px_40px_-15px_rgba(23,33,29,0.08)] md:p-6"
                >
                  <div className="flex items-start justify-between">
                    <EditorialIconBadge icon={Icon} />
                    <span className="font-editorial text-lg italic text-[#A8742E]">{kit.number}</span>
                  </div>
                  <h2 className="mt-5 text-[18px] font-bold tracking-tight text-[#17211D]">{kit.title}</h2>
                  <p className="mt-3 break-keep text-[15px] leading-[1.8] text-[#6F766F] md:text-[14px] md:leading-[1.7]">
                    {kit.description}
                  </p>
                  <div className="mt-auto border-t border-[#E7E0D5] pt-4">
                    <p className="text-[11px] font-bold tracking-wide text-[#A8742E]">추천 대상</p>
                    <p className="mt-2 break-keep text-[14px] leading-[1.7] text-[#59615B] md:text-[13px]">
                      {kit.target}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="partner" className="page-section-muted scroll-mt-24 border-y border-[#E7E0D5]">
        <div className="site-container-wide grid items-start gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <SectionHeading
            eyebrow="Partnership inquiry"
            title="B2B 파트너십 문의"
            description={<p>동물병원, 장례식장, 브랜드 제휴 등 협력 관련 문의를 남겨주세요.</p>}
          />

          <div className="rounded-[24px] border border-[#E7E0D5] bg-white p-5 shadow-[0_20px_48px_-28px_rgba(23,33,29,0.16)] sm:p-8">
            <form className="space-y-6" aria-label="B2B 파트너십 문의 양식">
              <div>
                <label htmlFor="organization" className={labelClass}>기관 / 업체명</label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  autoComplete="organization"
                  className={fieldClass}
                  placeholder="상호명 입력"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>담당자 성함</label>
                  <input
                    id="contact-name"
                    name="contactName"
                    type="text"
                    autoComplete="name"
                    className={fieldClass}
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className={labelClass}>연락처</label>
                  <input
                    id="contact-phone"
                    name="contactPhone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    className={fieldClass}
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inquiry" className={labelClass}>문의 내용</label>
                <textarea
                  id="inquiry"
                  name="inquiry"
                  rows={4}
                  className={`${fieldClass} min-h-32 resize-y leading-[1.7]`}
                  placeholder="제휴 관련 문의하실 내용을 자유롭게 적어주세요."
                />
              </div>

              <div className="flex items-start gap-3 rounded-[16px] bg-[#FAF8F3] p-4">
                <input
                  type="checkbox"
                  id="agree"
                  name="agree"
                  className="mt-0.5 size-4 shrink-0 accent-[#17211D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8742E] focus-visible:ring-offset-2"
                />
                <label htmlFor="agree" className="text-[13px] leading-[1.7] text-[#6F766F]">
                  개인정보 수집 및 이용에 동의합니다. (필수)
                </label>
              </div>

              <button
                type="button"
                className="flex min-h-14 w-full items-center justify-center rounded-full bg-[#17211D] px-6 text-[15px] font-bold text-[#FBFAF7] transition-all duration-500 ease-out hover:bg-[#202521] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8742E] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                제휴 문의 제출하기
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
