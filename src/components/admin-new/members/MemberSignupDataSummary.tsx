'use client';

import React from 'react';
import { FileText, Link as LinkIcon } from 'lucide-react';

const FIELD_LABELS: Record<string, string> = {
  brandName: 'ë¸Œëœ?œëª…',
  companyName: '?Œì‚¬ëª?,
  ceoName: '?€?œìëª?,
  businessNumber: '?¬ì—…?ë“±ë¡ë²ˆ??,
  businessType: '?¬ì—…??? í˜•',
  establishedYear: '?¤ë¦½?°ë„',
  website: '?¹ì‚¬?´íŠ¸',
  instagram: '?¸ìŠ¤?€ê·¸ë¨',
  address: '?¬ì—…??ì£¼ì†Œ',
  managerName: '?´ë‹¹?ëª…',
  contact: '?´ë‹¹???°ë½ì²?,
  email: '?´ë‹¹???´ë©”??,
  companyTagline: '?Œì‚¬ ?Œê°œ ??ì¤?,
  brandTagline: 'ë¸Œëœ???Œê°œ ??ì¤?,
  mainServices: 'ì£¼ìš” ?œë¹„??,
  providedServices: '?œê³µ ?œë¹„??,
  operationHours: '?´ì˜ ?œê°„',
  serviceArea: '?œë¹„??ì§€??,
  startMotivation: 'ë¸Œëœ???œì‘ ë°°ê²½',
  joinReason: '?…ì /?œíœ´ ?¬ë§ ?¬ìœ ',
  repProductName: '?€???í’ˆëª?,
  salesCategory: '?ë§¤ ì¹´í…Œê³ ë¦¬',
  launchDate: 'ì¶œì‹œ??,
  manufacturingMethod: '?œì¡° ë°©ì‹',
  repProductDescription: '?€???í’ˆ ?¤ëª…',
  differentiation: 'ì°¨ë³„??,
  currentSalesChannels: '?„ì¬ ?ë§¤ ì±„ë„',
  monthlyProductionCapacity: '???ì‚° ê°€?¥ëŸ‰',
  philosophy: 'ë¸Œëœ??ì² í•™',
  attachedFiles: 'ì²¨ë? ?Œì¼',
} as const;

const DOCUMENT_LABELS: Record<string, string> = {
  attachBizLicense: '?¬ì—…?ë“±ë¡ì¦',
  attachMedicalLicense: '?™ë¬¼ë³‘ì› ?¸í—ˆê°€ì¦?,
  attachFuneralLicense: '?¥ë??ì¥ ?¸í—ˆê°€ì¦?,
  attachEntrustLicense: '?„íƒ/?œíœ´ ì¦ë¹™',
  attachBeautyLicense: 'ë¯¸ìš©/?«ìƒµ ê´€???¸í—ˆê°€ì¦?,
  attachOtherLicense: 'ê¸°í? ?¸í—ˆê°€ ?œë¥˜',
  attachCompanyIntro: '?Œì‚¬ ?Œê°œ??,
  attachServiceIntro: '?œë¹„???Œê°œ??,
  attachFacilityPhoto: '?œì„¤ ?¬ì§„',
  attachCert: '?¸ì¦??,
  attachEtc: 'ê¸°í? ì²¨ë?',
  safetyTestReport: '?ˆì „???œí—˜?±ì ??,
  safetyCert: '?ˆì „ ?¸ì¦',
  safetyPatent: '?¹í—ˆ ?ë£Œ',
  safetyTrademark: '?í‘œ ?±ë¡ ?ë£Œ',
  safetyDesign: '?”ì???±ë¡ ?ë£Œ',
  safetyEtc: 'ê¸°í? ?ˆì „ ?ë£Œ',
} as const;

const AGREEMENT_LABELS: Record<string, string> = {
  privacyAgreement: 'ê°œì¸?•ë³´ ë°??ë£Œ ?œìš© ?™ì˜',
  auditAgreement: 'ë¸Œëœ??Audit ?™ì˜',
} as const;

const HIDDEN_KEYS = new Set(['password', 'passwordConfirm']);

interface MemberSignupDataSummaryProps {
  data: Record<string, unknown>;
}

type UploadedFile = {
  readonly category?: string;
  readonly name: string;
  readonly path?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? '?? : '?„ë‹ˆ??;
  if (Array.isArray(value)) return value.map(toText).filter(Boolean).join(', ');
  if (isRecord(value)) {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${FIELD_LABELS[key] ?? key}: ${toText(nestedValue)}`)
      .filter((line) => !line.endsWith(': '))
      .join(' / ');
  }
  return '';
}

function toUploadedFile(value: unknown): UploadedFile | null {
  if (!isRecord(value) || typeof value.name !== 'string' || value.name.trim() === '') return null;
  return {
    category: typeof value.category === 'string' ? value.category : undefined,
    name: value.name.trim(),
    path: typeof value.path === 'string' && value.path.trim() !== '' ? value.path : undefined,
  };
}

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function isDocumentKey(key: string): boolean {
  return key in DOCUMENT_LABELS;
}

function isAgreementKey(key: string): boolean {
  return key in AGREEMENT_LABELS;
}

function SignupValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    const uploadedFiles = value.map(toUploadedFile).filter((file): file is UploadedFile => file !== null);
    if (uploadedFiles.length > 0) {
      return (
        <ul className="space-y-2">
          {uploadedFiles.map((file) => (
            <li key={`${file.category ?? 'file'}-${file.name}`} className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-[#687069]" />
              <span>{file.category ? `${file.category} Â· ${file.name}` : file.name}</span>
              {file.path && (
                <a href={file.path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#2F3B34] underline">
                  ë³´ê¸° <LinkIcon className="h-3 w-3" />
                </a>
              )}
            </li>
          ))}
        </ul>
      );
    }
  }

  return <span className="whitespace-pre-wrap">{toText(value) || '-'}</span>;
}

export default function MemberSignupDataSummary({ data }: MemberSignupDataSummaryProps) {
  const fields = Object.entries(data).filter(
    ([key, value]) => !HIDDEN_KEYS.has(key) && !isDocumentKey(key) && !isAgreementKey(key) && toText(value) !== '',
  );
  const documents = Object.entries(data).filter(([key, value]) => isDocumentKey(key) && value === true);
  const agreements = Object.entries(data).filter(([key, value]) => isAgreementKey(key) && value === true);

  return (
    <div className="space-y-4">
      {documents.length > 0 && (
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <div className="mb-2 text-[12px] font-semibold text-gray-500">?œì¶œ ?œë¥˜</div>
          <div className="flex flex-wrap gap-2">
            {documents.map(([key]) => (
              <span key={key} className="rounded-md border border-[#D1D0C8] bg-white px-2.5 py-1 text-[12px] font-medium text-[#17201B]">
                {DOCUMENT_LABELS[key]}
              </span>
            ))}
          </div>
        </div>
      )}

      {fields.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {fields.map(([key, value]) => (
            <div key={key} className="rounded-md border border-gray-200 bg-white p-3">
              <div className="mb-1 text-[12px] font-semibold text-gray-500">{FIELD_LABELS[key] ?? humanizeKey(key)}</div>
              <div className="text-[13px] leading-relaxed text-[#17201B]">
                <SignupValue value={value} />
              </div>
            </div>
          ))}
        </div>
      )}

      {agreements.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {agreements.map(([key]) => (
            <span key={key} className="rounded-md bg-[#F4F2EC] px-2.5 py-1 text-[12px] font-medium text-[#4F5751]">
              {AGREEMENT_LABELS[key]} ?„ë£Œ
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
