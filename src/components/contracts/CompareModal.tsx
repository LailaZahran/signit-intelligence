import { useState } from 'react';
import { X, ArrowLeftRight, ChevronDown } from 'lucide-react';
import { Contract, PersonaId } from '@/types';
import { contracts } from '@/data/contracts';
import { useLanguage } from '@/context/LanguageContext';

interface CompareModalProps {
  contractA: Contract;
  activeLens: PersonaId;
  onClose: () => void;
}

const LENS_COLOR: Record<PersonaId, string> = {
  legal: '#6366F1',
  procurement: '#0D9488',
  cfo: '#D97706',
};

const RISK_STYLE: Record<string, { bg: string; text: string }> = {
  critical: { bg: '#FEF2F2', text: '#B91C1C' },
  high:     { bg: '#FFFBEB', text: '#B45309' },
  medium:   { bg: '#EFF6FF', text: '#3B82F6' },
  low:      { bg: '#F0FDF4', text: '#15803D' },
};

const STATUS_LABEL: Record<string, { en: string; ar: string }> = {
  active:         { en: 'Active',      ar: 'نشط' },
  expiring:       { en: 'Expiring',    ar: 'قيد الانتهاء' },
  flagged:        { en: 'Flagged',     ar: 'مُعلَّم' },
  in_negotiation: { en: 'Negotiating', ar: 'قيد التفاوض' },
};

const TYPE_LABEL: Record<string, { en: string; ar: string }> = {
  saas:       { en: 'SaaS',       ar: 'برمجيات' },
  vendor:     { en: 'Vendor',     ar: 'مورد' },
  nda:        { en: 'NDA',        ar: 'سرية' },
  employment: { en: 'Employment', ar: 'توظيف' },
  lease:      { en: 'Lease',      ar: 'إيجار' },
  jv:         { en: 'JV',        ar: 'مشروع مشترك' },
  legal:      { en: 'Legal',      ar: 'قانوني' },
  cloud:      { en: 'Cloud',      ar: 'سحابي' },
  marketing:  { en: 'Marketing',  ar: 'تسويق' },
};

const SIGNAL_COLOR: Record<string, string> = {
  red:   '#B91C1C',
  amber: '#B45309',
  green: '#15803D',
};

export function CompareModal({ contractA, activeLens, onClose }: CompareModalProps) {
  const { ar } = useLanguage();
  const t = (en: string, arStr: string) => ar ? arStr : en;

  const others = contracts.filter((c) => c.id !== contractA.id);
  const [bId, setBId] = useState(others[0]?.id ?? '');
  const contractB = contracts.find((c) => c.id === bId) ?? others[0];

  const lensColor = LENS_COLOR[activeLens];
  const lensName = activeLens === 'legal' ? t('Legal', 'قانوني') : activeLens === 'procurement' ? t('Procurement', 'مشتريات') : t('CFO', 'المدير المالي');

  if (!contractB) return null;

  // Build merged extracted field label list
  const allLabels = Array.from(new Set([
    ...contractA.extractedFields.map((f) => f.label),
    ...contractB.extractedFields.map((f) => f.label),
  ]));
  const getField = (c: Contract, label: string) => c.extractedFields.find((f) => f.label === label);

  const flagCount = (c: Contract, sev: string) => c.riskFlags.filter((f) => f.severity === sev).length;

  const coreRows = [
    {
      label:  t('Type', 'النوع'),
      aVal:   ar ? (TYPE_LABEL[contractA.type]?.ar ?? contractA.type) : (TYPE_LABEL[contractA.type]?.en ?? contractA.type),
      bVal:   ar ? (TYPE_LABEL[contractB.type]?.ar ?? contractB.type) : (TYPE_LABEL[contractB.type]?.en ?? contractB.type),
      differ: contractA.type !== contractB.type,
    },
    {
      label:  t('Status', 'الحالة'),
      aVal:   ar ? (STATUS_LABEL[contractA.status]?.ar ?? contractA.status) : (STATUS_LABEL[contractA.status]?.en ?? contractA.status),
      bVal:   ar ? (STATUS_LABEL[contractB.status]?.ar ?? contractB.status) : (STATUS_LABEL[contractB.status]?.en ?? contractB.status),
      differ: contractA.status !== contractB.status,
    },
    {
      label:  t('Annual value', 'القيمة السنوية'),
      aVal:   contractA.annualValueDisplay === 'No financial value' ? '—' : contractA.annualValueDisplay,
      bVal:   contractB.annualValueDisplay === 'No financial value' ? '—' : contractB.annualValueDisplay,
      differ: contractA.annualValueSAR !== contractB.annualValueSAR,
    },
    {
      label:    t('Risk level', 'مستوى المخاطرة'),
      aVal:     contractA.riskLevel.toUpperCase(),
      bVal:     contractB.riskLevel.toUpperCase(),
      differ:   contractA.riskLevel !== contractB.riskLevel,
      aRiskStyle: RISK_STYLE[contractA.riskLevel],
      bRiskStyle: RISK_STYLE[contractB.riskLevel],
    },
    {
      label:  t('Days to deadline', 'أيام للموعد'),
      aVal:   `${contractA.daysToNextCritical}${ar ? ' ي' : 'd'}`,
      bVal:   `${contractB.daysToNextCritical}${ar ? ' ي' : 'd'}`,
      differ: contractA.daysToNextCritical !== contractB.daysToNextCritical,
    },
    {
      label:  t('Notice required', 'مهلة الإشعار'),
      aVal:   `${contractA.noticeRequiredDays}${ar ? ' ي' : 'd'}`,
      bVal:   `${contractB.noticeRequiredDays}${ar ? ' ي' : 'd'}`,
      differ: contractA.noticeRequiredDays !== contractB.noticeRequiredDays,
    },
    {
      label:  t('Governing law', 'القانون الحاكم'),
      aVal:   contractA.governingLaw,
      bVal:   contractB.governingLaw,
      differ: contractA.governingLaw !== contractB.governingLaw,
    },
  ];

  const aCrit = flagCount(contractA, 'critical');
  const aHigh = flagCount(contractA, 'high');
  const bCrit = flagCount(contractB, 'critical');
  const bHigh = flagCount(contractB, 'high');
  const flagsDiffer = aCrit !== bCrit || aHigh !== bHigh;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(17,24,39,0.55)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: '94vw', maxWidth: 940, maxHeight: '90vh' }}
      >

        {/* ── Modal header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={14} style={{ color: lensColor }} />
            <span className="text-[13px] font-bold text-[var(--brand-navy)]">
              {t('Contract comparison', 'مقارنة العقود')}
            </span>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${lensColor}18`, color: lensColor }}
            >
              {lensName} {t('lens', 'عدسة')}
            </span>
            <span className="text-[10px] text-gray-300 ms-1">
              {t('Amber rows = values differ', 'الصفوف الكهرمانية = قيم مختلفة')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Two-column contract header ────────────────────────────── */}
        <div className="grid grid-cols-2 border-b border-gray-100 flex-shrink-0">
          {/* Contract A */}
          <div
            className="px-6 py-3 border-e border-gray-100"
            style={{ borderInlineStart: `3px solid ${lensColor}` }}
          >
            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: lensColor }}>
              {t('Contract A · fixed', 'العقد أ · ثابت')}
            </p>
            <p className="text-[13px] font-bold text-[var(--brand-navy)] truncate" dir="ltr">{contractA.counterparty}</p>
            <p className="text-[10px] text-gray-400 font-mono" dir="ltr">{contractA.contractNumber}</p>
          </div>

          {/* Contract B — picker */}
          <div className="px-6 py-3">
            <p className="text-[9px] font-bold uppercase tracking-widest mb-1 text-gray-400">
              {t('Contract B — choose to compare', 'العقد ب — اختر للمقارنة')}
            </p>
            <div className="flex items-center gap-1">
              <select
                value={bId}
                onChange={(e) => setBId(e.target.value)}
                className="flex-1 text-[12px] font-bold text-[var(--brand-navy)] bg-transparent border-b border-gray-200 pb-0.5 outline-none cursor-pointer hover:border-[var(--brand-indigo)] transition-colors"
                dir={ar ? 'rtl' : 'ltr'}
              >
                {others.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.counterparty}  ·  {c.contractNumber}
                  </option>
                ))}
              </select>
              <ChevronDown size={11} className="text-gray-400 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* ── Scrollable comparison body ────────────────────────────── */}
        <div className="overflow-y-auto flex-1">

          {/* Core field rows */}
          {coreRows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-2 border-b border-gray-50"
              style={row.differ ? { background: '#FFFBEB' } : undefined}
            >
              <div className="px-6 py-2.5 border-e border-gray-100">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{row.label}</p>
                {row.aRiskStyle ? (
                  <span
                    className="text-[11px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: row.aRiskStyle.bg, color: row.aRiskStyle.text }}
                  >
                    {row.aVal}
                  </span>
                ) : (
                  <p className="text-[13px] font-semibold text-[var(--brand-navy)]" dir="ltr">{row.aVal}</p>
                )}
              </div>
              <div className="px-6 py-2.5">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{row.label}</p>
                {row.bRiskStyle ? (
                  <span
                    className="text-[11px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: row.bRiskStyle.bg, color: row.bRiskStyle.text }}
                  >
                    {row.bVal}
                  </span>
                ) : (
                  <p className="text-[13px] font-semibold text-[var(--brand-navy)]" dir="ltr">{row.bVal}</p>
                )}
              </div>
            </div>
          ))}

          {/* Signals row */}
          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="px-6 py-2.5 border-e border-gray-100">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                {t('Signals', 'الإشارات')}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {contractA.signals.length === 0 ? (
                  <span className="text-[11px] text-gray-300">—</span>
                ) : contractA.signals.map((sig, i) => (
                  <div key={i} className="flex items-center gap-1" title={sig.label}>
                    <div className="h-2 w-2 rounded-full" style={{ background: SIGNAL_COLOR[sig.color] ?? '#94A3B8' }} />
                    <span className="text-[10px] text-gray-500 truncate max-w-[120px]" dir="ltr">{sig.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                {t('Signals', 'الإشارات')}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {contractB.signals.length === 0 ? (
                  <span className="text-[11px] text-gray-300">—</span>
                ) : contractB.signals.map((sig, i) => (
                  <div key={i} className="flex items-center gap-1" title={sig.label}>
                    <div className="h-2 w-2 rounded-full" style={{ background: SIGNAL_COLOR[sig.color] ?? '#94A3B8' }} />
                    <span className="text-[10px] text-gray-500 truncate max-w-[120px]" dir="ltr">{sig.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk flags row */}
          <div
            className="grid grid-cols-2 border-b border-gray-100"
            style={flagsDiffer ? { background: '#FFFBEB' } : undefined}
          >
            <div className="px-6 py-2.5 border-e border-gray-100">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                {t('Risk flags', 'مؤشرات المخاطر')}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {aCrit > 0 && (
                  <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-700">
                    {aCrit} {t('critical', 'حرج')}
                  </span>
                )}
                {aHigh > 0 && (
                  <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                    {aHigh} {t('high', 'عالٍ')}
                  </span>
                )}
                {aCrit === 0 && aHigh === 0 && (
                  <span className="text-[11px] text-green-600 font-medium">{t('None', 'لا يوجد')}</span>
                )}
              </div>
            </div>
            <div className="px-6 py-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                {t('Risk flags', 'مؤشرات المخاطر')}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {bCrit > 0 && (
                  <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-700">
                    {bCrit} {t('critical', 'حرج')}
                  </span>
                )}
                {bHigh > 0 && (
                  <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                    {bHigh} {t('high', 'عالٍ')}
                  </span>
                )}
                {bCrit === 0 && bHigh === 0 && (
                  <span className="text-[11px] text-green-600 font-medium">{t('None', 'لا يوجد')}</span>
                )}
              </div>
            </div>
          </div>

          {/* Extracted fields section */}
          {allLabels.length > 0 && (
            <>
              <div className="px-6 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  {t('Extracted fields', 'البيانات المستخرجة')}
                </p>
              </div>
              {allLabels.map((label, i) => {
                const fA = getField(contractA, label);
                const fB = getField(contractB, label);
                const differ = fA?.value !== fB?.value;
                return (
                  <div
                    key={i}
                    className="grid grid-cols-2 border-b border-gray-50"
                    style={differ ? { background: '#FFFBEB' } : undefined}
                  >
                    <div className="px-6 py-2 border-e border-gray-100">
                      <p className="text-[9px] text-gray-400 mb-0.5">{label}</p>
                      <p className="text-[12px] font-semibold text-[var(--brand-navy)]" dir="ltr">
                        {fA ? fA.value : <span className="text-gray-300">—</span>}
                      </p>
                      {fA && (
                        <div className="mt-1 h-0.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${fA.confidence}%`, background: lensColor, opacity: 0.5 }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="px-6 py-2">
                      <p className="text-[9px] text-gray-400 mb-0.5">{label}</p>
                      <p className="text-[12px] font-semibold text-[var(--brand-navy)]" dir="ltr">
                        {fB ? fB.value : <span className="text-gray-300">—</span>}
                      </p>
                      {fB && (
                        <div className="mt-1 h-0.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${fB.confidence}%`, background: lensColor, opacity: 0.5 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* AI Summary section */}
          <div>
            <div
              className="px-6 py-2 border-b border-gray-100 border-t border-t-gray-100"
              style={{ background: `${lensColor}0C` }}
            >
              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: lensColor }}>
                {t('AI Summary', 'الملخص الذكي')} · {lensName}
              </p>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-6 py-4 border-e border-gray-100">
                <p
                  className="text-[12px] leading-relaxed text-[var(--brand-navy)]"
                  dir="ltr"
                  style={{ borderInlineStart: `2px solid ${lensColor}`, paddingInlineStart: 10 }}
                >
                  {contractA.aiSummary[activeLens]}
                </p>
              </div>
              <div className="px-6 py-4">
                <p
                  className="text-[12px] leading-relaxed text-[var(--brand-navy)]"
                  dir="ltr"
                  style={{ borderInlineStart: `2px solid ${lensColor}`, paddingInlineStart: 10 }}
                >
                  {contractB.aiSummary[activeLens]}
                </p>
              </div>
            </div>
          </div>

          <div className="h-4" />
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-gray-100 px-6 py-3 flex items-center justify-between bg-gray-50">
          <p className="text-[10px] text-gray-400">
            {t('Amber rows indicate differing values between contracts', 'الصفوف الكهرمانية تُشير إلى اختلاف القيم بين العقدين')}
          </p>
          <button
            onClick={onClose}
            className="text-[12px] font-medium px-4 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 transition-colors"
          >
            {t('Close', 'إغلاق')}
          </button>
        </div>
      </div>
    </div>
  );
}
