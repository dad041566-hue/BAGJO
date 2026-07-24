import Link from 'next/link';
import { ArrowDown, Check, FileCheck2, Search, ShieldCheck } from 'lucide-react';
import type { Brand } from '@/types';

const reviewingTopics = [
  'ë¸Œëœ??ì² í•™ê³??œí’ˆ ë°©í–¥',
  '?ë£ŒÂ·?Œì¬?€ ?ì„¸ ?•ë³´',
  '?œì¡°?€ ? í†µ ê³¼ì •',
  '?í™œ ???¬ìš©?±ê³¼ ?ˆë‚´ ë°©ì‹',
];

export default function BrandAuditReport({ brand }: { brand: Brand }) {
  const report = brand.auditReport;

  if (!report) {
    return (
      <section
        aria-labelledby={`${brand.id}-reviewing-title`}
        className="mt-16 overflow-hidden rounded-3xl border border-[#E7E0D5] bg-[#FAF8F3] sm:mt-24"
      >
        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[0.42fr_0.58fr] lg:p-12">
          <div>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#F3EEE6] text-[#A8742E]">
              <Search className="size-5" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <p className="page-eyebrow mt-6">ì§€ê¸??•ì¸?˜ê³  ?ˆì–´??/p>
            <h2
              id={`${brand.id}-reviewing-title`}
              className="mt-3 break-keep text-2xl font-bold leading-[1.25] tracking-tight text-[#17211D] sm:text-3xl"
            >
              ë¸Œëœ???ë£Œë¥??´í´ë³´ê³  ?ˆì–´??
            </h2>
            <p className="mt-5 break-keep text-sm leading-7 text-[#6F766F] sm:text-base sm:leading-8">
              {brand.name}??ë¬´ì—‡??ë§Œë“¤ê³??´ë–¤ ë§ˆìŒ?¼ë¡œ ?´ì–´ê°€?”ì? ì°¨ê·¼ì°¨ê·¼ ?•ì¸?˜ëŠ” ì¤‘ì´?ìš”. ?•ì¸??ë§ˆì¹œ ?´ìš©ë¶€???”ì§?˜ê²Œ ?ˆë‚´? ê²Œ??
            </p>
          </div>

          <div className="rounded-2xl border border-[#E7E0D5] bg-white p-6 sm:p-8">
            <h3 className="text-sm font-bold tracking-tight text-[#17211D]">?¨ê»˜ ?´í´ë³´ëŠ” ?´ìš©</h3>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {reviewingTopics.map((topic) => (
                <li key={topic} className="flex items-start gap-3 break-keep text-sm leading-6 text-[#6F766F]">
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#F3EEE6] text-[#A8742E]">
                    <Search className="size-3" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  {topic}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-[#E7E0D5] pt-5 break-keep text-xs leading-5 text-[#8A7A64]">
              ?„ì§ ?•ì¸ ì¤‘ì¸ ?´ìš©?€ ?„ë£Œ??ê²ƒì²˜???œì‹œ?˜ì? ?ŠìŠµ?ˆë‹¤.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#E7E0D5] bg-white px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
          <p className="break-keep text-sm leading-6 text-[#6F766F]">?í’ˆ ?•ë³´??ì¤€ë¹„ë˜???œì„œ?€ë¡?ì°¨ë¶„??ì±„ì›Œê°€ê³??ˆì–´??</p>
          <Link href="#brand-products" className="btn-secondary shrink-0">
            ë¸Œëœ???í’ˆ ë³´ê¸°
            <ArrowDown className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  const statusLabel = /[ê°€-??/.test(report.status) ? report.status : '?•ì¸ ê¸°ë¡ ê³µê°œ';

  return (
    <section
      aria-labelledby={`${brand.id}-audit-title`}
      className="bg-noise relative mt-16 overflow-hidden rounded-3xl bg-[#202521] text-[#FBFAF7] shadow-[0_28px_80px_rgba(23,33,29,0.12)] sm:mt-24"
    >
      <div aria-hidden="true" className="absolute -right-24 -top-24 size-80 rounded-full border border-[#FBFAF7]/10" />
      <div className="relative z-10 border-b border-[#FBFAF7]/10 px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#D8C4A3]">
            <ShieldCheck className="size-4" strokeWidth={1.5} aria-hidden="true" />
            ë°±ì¡°ê°€ ?´í´ë³?ê¸°ë¡
          </div>
          <h2
            id={`${brand.id}-audit-title`}
            className="mt-5 max-w-3xl break-keep text-3xl font-bold leading-[1.2] tracking-tight text-[#FBFAF7] sm:text-4xl lg:text-5xl"
          >
            {report.headline}
          </h2>
          <p className="mt-5 max-w-2xl break-keep text-sm leading-7 text-[#FBFAF7]/70 sm:text-base sm:leading-8">
            ë¸Œëœ?œê? ë¬´ì—‡??ë§Œë“¤ê³??´ë–¤ ë§ˆìŒ?¼ë¡œ ?´ì–´ê°€?”ì?, ë°±ì¡°?¤ë¸Œ?œê? ì°¨ê·¼ì°¨ê·¼ ?´í´ë³??´ìš©???´ì•˜?´ìš”.
          </p>
        </div>

        <dl className="mt-10 grid overflow-hidden rounded-2xl border border-[#FBFAF7]/10 bg-white/5 sm:grid-cols-3">
          {[
            ['?•ì¸ ê¸°ë¡', report.reportNo],
            ['ë§ˆì?ë§??•ì¸', report.auditedAt],
            ['?„ì¬ ?íƒœ', statusLabel],
          ].map(([label, value], index) => (
            <div
              key={label}
              className={`px-5 py-5 ${index > 0 ? 'border-t border-[#FBFAF7]/10 sm:border-l sm:border-t-0' : ''}`}
            >
              <dt className="text-xs font-medium text-[#FBFAF7]/45">{label}</dt>
              <dd className="mt-2 break-keep text-sm font-semibold text-[#FBFAF7]/90">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative z-10 grid border-b border-[#FBFAF7]/10 lg:grid-cols-2 lg:divide-x lg:divide-[#FBFAF7]/10">
        <div className="px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
          <p className="text-sm font-semibold text-[#D8C4A3]">?´í´ë³??´ìš©</p>
          {/* summaryTitle?€ ê´€ë¦¬ìê°€ ?…ë ¥?˜ëŠ” ?œê? ?œë“œ ?°ì´?°ë¼ Â§6 ?„ë©”??ê·œì¹™(?œê???Playfair
              Display/font-editorial ê°•ì œ ê¸ˆì? ???Œë” ê¹¨ì§)???´ê¸´?? Pretendardê°€ ?ì—°??              ?ì†?˜ë„ë¡?font-editorial/italic???œê±°?˜ê³  ?¬ê¸°Â·êµµê¸°Â·?‰ìƒë§?? ì??œë‹¤. */}
          <h3 className="mt-4 break-keep text-2xl leading-[1.3] text-[#FBFAF7]">
            {report.summaryTitle}
          </h3>
          <p className="mt-5 break-keep text-sm leading-7 text-[#FBFAF7]/70 sm:text-[15px] sm:leading-8">
            {report.summary}
          </p>
        </div>

        <div className="border-t border-[#FBFAF7]/10 px-6 py-10 sm:px-10 lg:border-t-0 lg:px-16 lg:py-14">
          <p className="text-sm font-semibold text-[#D8C4A3]">?Œê°œ?˜ëŠ” ?´ìœ </p>
          <p className="mt-5 break-keep text-sm leading-7 text-[#FBFAF7]/70 sm:text-[15px] sm:leading-8">
            {report.selectionReason}
          </p>
        </div>
      </div>

      <div className="relative z-10 bg-[#FAF8F3] px-6 py-10 text-[#17211D] sm:px-10 lg:px-16 lg:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2">
              <FileCheck2 className="size-5 text-[#A8742E]" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="text-base font-bold tracking-tight">?¨ê»˜ ?•ì¸??ê¸°ì?</h3>
            </div>
            <ul className="mt-7 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {report.process.map((item) => (
                <li key={item} className="flex items-start gap-3 break-keep text-sm leading-6 text-[#6F766F]">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#17211D] text-[#FBFAF7]">
                    <Check className="size-3" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Link href="#brand-products" className="btn-primary shrink-0">
            ì¶”ì²œ ?í’ˆ ë³´ê¸°
            <ArrowDown className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
