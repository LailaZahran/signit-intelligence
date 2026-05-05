import { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { ChromeBar } from '@/components/layout/ChromeBar';
import { PersonaLensToggle } from '@/components/contracts/PersonaLensToggle';
import { usePersona } from '@/context/PersonaContext';
import { useLanguage } from '@/context/LanguageContext';
import { PersonaId } from '@/types';
import {
  narratives,
  narrativesAr,
  metrics,
  metricsAr,
  financialExposure,
  renewalPipeline,
  contradictions,
  riskMatrix,
} from '@/data/portfolio';
import { AlertCircle, AlertTriangle, Info, ExternalLink, Clock, Zap, ArrowRight, ChevronDown, X } from 'lucide-react';

// ─── Severity helpers ────────────────────────────────────────────────────────

const SEV_ICON: Record<string, React.ReactNode> = {
  critical: <AlertCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#B91C1C' }} />,
  high:     <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#B45309' }} />,
  medium:   <Info size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#3B82F6' }} />,
};

const SEV_STYLE: Record<string, { bg: string; border: string; titleColor: string; descColor: string; badgeBg: string; badgeText: string }> = {
  critical: { bg: '#FEF2F2', border: '#FECACA', titleColor: '#991B1B', descColor: '#B91C1C', badgeBg: '#FEE2E2', badgeText: '#991B1B' },
  high:     { bg: '#FFFBEB', border: '#FDE68A', titleColor: '#92400E', descColor: '#B45309', badgeBg: '#FEF3C7', badgeText: '#92400E' },
  medium:   { bg: '#EFF6FF', border: '#BFDBFE', titleColor: '#1D4ED8', descColor: '#3B82F6', badgeBg: '#DBEAFE', badgeText: '#1D4ED8' },
};

const SEV_LABEL: Record<string, { en: string; ar: string }> = {
  critical: { en: 'Critical', ar: 'حرج' },
  high:     { en: 'High',     ar: 'عالي' },
  medium:   { en: 'Medium',   ar: 'متوسط' },
};

// ─── Risk matrix cell styles ─────────────────────────────────────────────────

const CELL_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  critical: { bg: '#FEF2F2', text: '#B91C1C', label: 'C' },
  high:     { bg: '#FFFBEB', text: '#B45309', label: 'H' },
  medium:   { bg: '#EFF6FF', text: '#3B82F6', label: 'M' },
  low:      { bg: '#F0FDF4', text: '#15803D', label: 'L' },
  none:     { bg: '#F8FAFC', text: '#CBD5E1', label: '—' },
};

const CELL_LABEL_AR: Record<string, string> = {
  critical: 'حرج', high: 'عالٍ', medium: 'متوسط', low: 'منخفض', none: '—',
};

const LENS_COLOR: Record<PersonaId, string> = {
  legal: '#6366F1', procurement: '#0D9488', cfo: '#D97706',
};

// ─── Lens-adaptive Zone 3 right panel data ───────────────────────────────────

const LEGAL_RISK_BREAKDOWN = [
  { label: 'Liability gaps',       labelAr: 'فجوات المسؤولية',  pct: 38, color: '#B91C1C' },
  { label: 'Data residency',       labelAr: 'إقامة البيانات',   pct: 22, color: '#B91C1C' },
  { label: 'Auto-renewal traps',   labelAr: 'فخاخ التجديد',     pct: 18, color: '#B45309' },
  { label: 'Confidentiality gaps', labelAr: 'فجوات السرية',     pct: 13, color: '#B45309' },
  { label: 'Employment gaps',      labelAr: 'فجوات العمالة',    pct: 9,  color: '#D97706' },
];

const PROCUREMENT_VALUE_BARS = [
  { name: 'Office Lease (break)', nameAr: 'إيجار المكتب (إنهاء)', value: 'SAR 6.2M', pct: 90, color: '#B91C1C' },
  { name: 'CloudCRM SaaS',        nameAr: 'CloudCRM SaaS',          value: 'SAR 742K', pct: 20, color: '#E24B4A' },
  { name: 'NexusCloud Infra',     nameAr: 'NexusCloud Infra',        value: 'SAR 310K', pct: 8,  color: '#B45309' },
  { name: 'Al-Mizan Retainer',    nameAr: 'استئناف الميزان',        value: 'SAR 184K', pct: 4,  color: '#D97706' },
];

const CFO_SAR_BREAKDOWN = financialExposure;

// ─── Narrative block ─────────────────────────────────────────────────────────

function NarrativeBlock({ lens, lensColor }: { lens: PersonaId; lensColor: string }) {
  const [, navigate] = useLocation();
  const { ar } = useLanguage();
  const narr = ar ? narrativesAr[lens] : narratives[lens];

  return (
    <div
      className="rounded-xl px-5 py-4"
      style={{
        background: '#F8F9FA',
        border: `1px solid ${lensColor}30`,
        borderLeftWidth: ar ? '1px' : '4px',
        borderRightWidth: ar ? '4px' : '1px',
        borderLeftColor: ar ? `${lensColor}30` : lensColor,
        borderRightColor: ar ? lensColor : `${lensColor}30`,
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: lensColor }}>
        {ar ? 'الملخص الاستراتيجي' : 'Portfolio narrative'}
      </p>
      <p
        className="text-[13px] leading-relaxed text-[var(--brand-navy)]"
        dir={ar ? 'rtl' : 'ltr'}
      >
        {narr.segments.map((seg, i) => {
          if (seg.type === 'text') return <span key={i}>{seg.content}</span>;
          return (
            <span
              key={i}
              onClick={() => seg.route && navigate(seg.route)}
              className="cursor-pointer underline underline-offset-2 font-semibold transition-all hover:opacity-70"
              title={ar ? 'انقر للاستعراض' : 'Click to explore'}
              style={{
                color: seg.emphasis === 'critical' ? '#B91C1C' : seg.emphasis === 'warning' ? '#B45309' : lensColor,
                textDecorationThickness: '2px',
              }}
            >
              {seg.content}
            </span>
          );
        })}
      </p>
      <p className="text-[9px] text-gray-400 mt-2" dir={ar ? 'rtl' : 'ltr'}>
        {ar ? '↑ انقر النص المميز للانتقال إلى العقد' : '↑ Click highlighted text to jump to that contract'}
      </p>
      <div className="flex items-start justify-between mt-2 pt-3 border-t border-gray-200 gap-4">
        <div className="flex items-start gap-1.5 min-w-0">
          <Clock size={11} className="flex-shrink-0 mt-0.5 text-gray-400" />
          <p className="text-[11px] text-gray-400 leading-relaxed">{narr.delta}</p>
        </div>
        <div
          className="flex items-start gap-2 px-3 py-2 rounded-lg flex-shrink-0 max-w-[260px]"
          style={{ background: `${lensColor}14`, borderLeft: ar ? 'none' : `3px solid ${lensColor}`, borderRight: ar ? `3px solid ${lensColor}` : 'none' }}
        >
          <Zap size={11} className="flex-shrink-0 mt-0.5" style={{ color: lensColor }} />
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: lensColor }}>
              {ar ? 'الإجراء المطلوب' : 'Directive'}
            </p>
            <p className="text-[11px] font-semibold leading-snug" style={{ color: lensColor }}>
              {narr.urgentAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Metric card — hero number ───────────────────────────────────────────────

function MetricCard({
  label, value, sub, variant, route,
}: {
  label: string; value: string; sub: string;
  variant: 'default' | 'warning' | 'critical';
  route?: string;
}) {
  const [, navigate] = useLocation();
  const { ar } = useLanguage();
  const numColor = variant === 'critical' ? '#B91C1C' : variant === 'warning' ? '#B45309' : '#6366F1';
  const cardBg = variant === 'critical' ? '#FEF2F2' : variant === 'warning' ? '#FFFBEB' : 'white';
  const cardBorder = variant === 'critical' ? '#FECACA' : variant === 'warning' ? '#FDE68A' : '#E5E7EB';
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-1 transition-all ${route ? 'cursor-pointer hover:shadow-md hover:-translate-y-px' : ''}`}
      style={{ background: cardBg, borderColor: cardBorder }}
      onClick={() => route && navigate(route)}
      data-testid="metric-card"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="font-bold leading-none" style={{ fontSize: 28, color: numColor }} dir="ltr">
        {value}
      </p>
      <p className="text-[11px] text-gray-500 leading-tight mt-1">{sub}</p>
      {route && (
        <div
          className="flex items-center gap-1 mt-2 pt-1.5"
          style={{ borderTop: `1px solid ${numColor}25` }}
        >
          <ArrowRight size={11} style={{ color: numColor }} />
          <span className="text-[10px] font-semibold" style={{ color: numColor }}>
            {ar ? 'عرض' : 'View →'}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Renewal pipeline ────────────────────────────────────────────────────────

function RenewalPipeline() {
  const [, navigate] = useLocation();
  const { ar } = useLanguage();
  return (
    <div className="flex flex-col gap-3">
      {renewalPipeline.map((item) => {
        const isUrgent = item.days < 60;
        const isWarn = item.days >= 60 && item.days < 120;
        const dayColor = isUrgent ? '#B91C1C' : isWarn ? '#B45309' : '#64748B';
        return (
          <div
            key={item.contractId}
            className="cursor-pointer group flex items-center gap-3"
            onClick={() => navigate(`/contracts/${item.contractId}`)}
          >
            <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: dayColor }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1 gap-2">
                <p className="text-[11px] font-medium text-[var(--brand-navy)] truncate group-hover:text-[var(--brand-indigo)] transition-colors">
                  {ar ? item.nameAr : item.name}
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-gray-400" dir="ltr">{item.value}</span>
                  <span className="text-[13px] font-bold" style={{ color: dayColor }} dir="ltr">
                    {item.days}{ar ? 'ي' : 'd'}
                  </span>
                </div>
              </div>
              <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: dayColor, opacity: 0.5 }} />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {ar ? `مهلة إشعار ${item.notice} يوم` : `${item.notice}d notice required`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Zone 3 right panel — adapts per lens ────────────────────────────────────

function Zone3RightPanel({ lens }: { lens: PersonaId }) {
  const [, navigate] = useLocation();
  const { ar } = useLanguage();

  if (lens === 'legal') {
    const max = LEGAL_RISK_BREAKDOWN[0].pct;
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-bold text-[var(--brand-navy)]">
            {ar ? 'توزيع مخاطر المحفظة' : 'Risk flags by category'}
          </p>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#FEF2F2', color: '#B91C1C' }}>
            {ar ? '14 إجمالاً' : '14 total'}
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {LEGAL_RISK_BREAKDOWN.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] text-[var(--brand-navy)] font-medium">
                  {ar ? item.labelAr : item.label}
                </p>
                <span className="text-[11px] font-bold" style={{ color: item.color }} dir="ltr">{item.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(item.pct / max) * 100}%`, background: item.color, opacity: 0.8 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (lens === 'procurement') {
    const max = PROCUREMENT_VALUE_BARS[0].pct;
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-bold text-[var(--brand-navy)]">
            {ar ? 'القيمة المعرضة للخطر' : 'Renewal value at stake'}
          </p>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#FFFBEB', color: '#B45309' }} dir="ltr">
            SAR 5.1M
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {PROCUREMENT_VALUE_BARS.map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1 gap-2">
                <p className="text-[11px] font-medium text-[var(--brand-navy)] truncate">
                  {ar ? item.nameAr : item.name}
                </p>
                <span className="text-[11px] font-bold flex-shrink-0" style={{ color: item.color }} dir="ltr">
                  {item.value}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(item.pct / max) * 100}%`, background: item.color, opacity: 0.7 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // CFO: Financial exposure
  const maxVal = CFO_SAR_BREAKDOWN[0].value;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-bold text-[var(--brand-navy)]">
          {ar ? 'التعرض المالي' : 'Financial exposure'}
        </p>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#EEF2FF', color: '#6366F1' }} dir="ltr">
          SAR 8.4M+
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {CFO_SAR_BREAKDOWN.map((item) => (
          <div
            key={item.contractId}
            className="cursor-pointer group"
            onClick={() => navigate(`/contracts/${item.contractId}`)}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[11px] font-semibold flex-shrink-0 group-hover:underline transition-colors"
                style={{ color: '#6366F1', minWidth: 68 }}
                dir="ltr"
              >
                {item.display}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(item.value / maxVal) * 100}%`, background: 'var(--gradient-cta)', opacity: 0.7 }}
                />
              </div>
              <p className="text-[11px] text-[var(--brand-navy)] truncate" style={{ maxWidth: 80 }}>
                {item.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Risk matrix ─────────────────────────────────────────────────────────────

const RISK_TYPE_AR: Record<string, string> = {
  Liability: 'المسؤولية',
  Data: 'البيانات',
  Renewal: 'التجديد',
  Terms: 'الشروط',
};

function RiskMatrix() {
  const [, navigate] = useLocation();
  const { ar } = useLanguage();

  return (
    <div>
      <div className="mb-3">
        <p className="text-[12px] font-bold text-[var(--brand-navy)]">
          {ar ? 'مصفوفة تركّز المخاطر' : 'Risk concentration matrix'}
        </p>
        <p className="text-[10px] text-gray-400">
          {ar ? 'المورد × نوع المخاطرة — انقر للاستعراض' : 'Vendor × risk type — click to explore'}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px]" style={{ borderCollapse: 'separate', borderSpacing: '2px' }}>
          <thead>
            <tr>
              <td className="w-20" />
              {riskMatrix.riskTypes.map((rt) => (
                <th key={rt} className="text-center font-semibold text-gray-400 pb-1 px-1 text-[10px]">
                  {ar ? (RISK_TYPE_AR[rt] ?? rt) : rt}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {riskMatrix.vendors.map((vendor, vi) => (
              <tr key={vendor}>
                <td
                  className="text-[10px] font-medium text-[var(--brand-navy)] pe-2 py-1 cursor-pointer hover:text-[var(--brand-indigo)] transition-colors"
                  dir="ltr"
                  onClick={() => navigate(`/contracts/${riskMatrix.contractIds[vi][0]}`)}
                >
                  {vendor}
                </td>
                {riskMatrix.cells[vi].map((cell: string, ci: number) => {
                  const style = CELL_STYLE[cell] ?? CELL_STYLE.none;
                  const contractId = riskMatrix.contractIds[vi][ci];
                  return (
                    <td key={ci} className="p-0.5">
                      <div
                        className="rounded-md h-9 flex items-center justify-center font-bold cursor-pointer transition-all hover:scale-105 hover:shadow-sm text-[11px]"
                        style={{ background: style.bg, color: style.text }}
                        onClick={() => contractId && navigate(`/contracts/${contractId}`)}
                        title={`${vendor} — ${ar ? (RISK_TYPE_AR[riskMatrix.riskTypes[ci]] ?? riskMatrix.riskTypes[ci]) : riskMatrix.riskTypes[ci]}: ${ar ? (CELL_LABEL_AR[cell] ?? cell) : cell}`}
                      >
                        {style.label}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 flex-wrap">
        {Object.entries(CELL_STYLE)
          .filter(([k]) => k !== 'none')
          .map(([k, s]) => (
            <div key={k} className="flex items-center gap-1">
              <div className="h-4 w-4 rounded flex items-center justify-center text-[9px] font-bold" style={{ background: s.bg, color: s.text }}>
                {s.label}
              </div>
              <span className="text-[10px] text-gray-400">
                {ar ? (CELL_LABEL_AR[k] ?? k) : k}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

// ─── Contradictions — compact ─────────────────────────────────────────────────

function ContradictionList() {
  const [, navigate] = useLocation();
  const { ar } = useLanguage();

  return (
    <div>
      <div className="mb-3">
        <p className="text-[12px] font-bold text-[var(--brand-navy)]">
          {ar ? 'التعارضات المكتشفة' : 'Cross-contract contradictions'}
        </p>
        <p className="text-[10px] text-gray-400">
          {ar ? '5 تعارضات تتطلب مراجعة' : '5 identified — requires review'}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {contradictions.map((c: any) => {
          const ss = SEV_STYLE[c.severity] ?? SEV_STYLE.medium;
          const sl = SEV_LABEL[c.severity];
          const title = ar ? (c.titleAr ?? c.title) : c.title;
          const description = ar ? (c.descriptionAr ?? c.description) : c.description;
          return (
            <div
              key={c.id}
              className="rounded-xl px-3 py-2.5"
              style={{ background: ss.bg, border: `1px solid ${ss.border}` }}
              data-testid={`contradiction-${c.id}`}
            >
              {/* Title row */}
              <div className="flex items-center gap-2 mb-1.5">
                {SEV_ICON[c.severity]}
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: ss.badgeBg, color: ss.badgeText }}
                >
                  {ar ? sl.ar : sl.en}
                </span>
                <span className="text-[12px] font-semibold truncate" style={{ color: ss.titleColor }}>
                  {title}
                </span>
              </div>
              {/* Description */}
              <p className="text-[11px] leading-snug mb-2" style={{ color: ss.descColor }}>
                {description}
              </p>
              {/* Contract tags */}
              <div className="flex items-center flex-wrap gap-1.5">
                {c.contracts.map((cId: string, i: number) => (
                  <button
                    key={cId}
                    onClick={() => navigate(`/contracts/${cId}`)}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors hover:opacity-80"
                    style={{ color: ss.badgeText, borderColor: `${ss.badgeText}40`, background: ss.badgeBg }}
                    dir="ltr"
                  >
                    {c.contractLabels[i]}
                    <ExternalLink size={8} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Board brief export modal ─────────────────────────────────────────────────

function BoardBriefModal({ lens, lensColor, onClose }: { lens: PersonaId; lensColor: string; onClose: () => void }) {
  const { ar } = useLanguage();
  const lensMetrics = (metrics)[lens];
  const criticalCount = contradictions.filter((c: any) => c.severity === 'critical').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.55)' }} onClick={onClose}>
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4" style={{ borderBottom: `3px solid ${lensColor}` }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: lensColor }}>
                {ar ? 'إحاطة مجلس الإدارة' : 'Board Brief'}
              </p>
              <h2 className="text-[15px] font-bold text-[var(--brand-navy)]">
                {ar ? 'المدار القابضة · ذكاء العقود' : 'Al-Madar Holding · Contract Intelligence'}
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5" dir="ltr">Q2 2026 · May 5, 2026</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors mt-0.5"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Metrics row */}
          <div className="grid grid-cols-2 gap-3">
            {lensMetrics.slice(0, 4).map((m, i) => {
              const numColor = m.variant === 'critical' ? '#B91C1C' : m.variant === 'warning' ? '#B45309' : '#6366F1';
              return (
                <div key={i} className="rounded-xl border border-gray-100 p-3 bg-gray-50">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{m.label}</p>
                  <p className="font-bold text-[22px] leading-none" style={{ color: numColor }} dir="ltr">{m.value}</p>
                  <p className="text-[10px] text-gray-400 mt-1 leading-tight">{m.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Contradictions summary */}
          <div className="rounded-xl px-4 py-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={13} style={{ color: '#B91C1C' }} />
              <p className="text-[12px] font-bold" style={{ color: '#991B1B' }}>
                {ar ? `${criticalCount} تعارضات حرجة تتطلب اتخاذ قرار` : `${criticalCount} critical contradictions require board decision`}
              </p>
            </div>
            <p className="text-[11px] leading-snug" style={{ color: '#B91C1C' }}>
              {ar
                ? 'تعارضات في إقامة البيانات، وسقف المسؤولية، والسرية تمتد عبر عقود متعددة.'
                : 'Data residency, liability cap, and confidentiality gaps span multiple vendor contracts.'}
            </p>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-3 pt-1">
            <button
              className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-white transition-all hover:opacity-90"
              style={{ background: lensColor }}
              onClick={() => {
                window.print();
              }}
            >
              {ar ? 'تصدير PDF' : 'Export PDF'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {ar ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

// ─── Metric navigation routes per lens ───────────────────────────────────────
const METRIC_ROUTES: Record<PersonaId, (string | undefined)[]> = {
  legal:       ['/contracts', '/contracts/c6', undefined,        '/contracts/c7'],
  procurement: ['/contracts', '/contracts/c9', '/contracts/c8',  '/contracts'],
  cfo:         [undefined,    '/contracts/c8', '/contracts/c10', '/contracts/c7'],
};

export default function Portfolio() {
  const { activePersonaId, setPersona } = usePersona();
  const { ar } = useLanguage();
  const [lens, setLens] = useState<PersonaId>(activePersonaId);
  const rawSearch = useSearch();
  const [, navigate] = useLocation();
  const showBoardBrief = new URLSearchParams(rawSearch).get('export') === 'board';

  // Keep local lens in sync when user switches persona via ChromeBar
  useEffect(() => {
    setLens(activePersonaId);
  }, [activePersonaId]);

  const lensColor = LENS_COLOR[lens];
  const lensMetrics = (ar ? metricsAr : metrics)[lens];
  const metricRoutes = METRIC_ROUTES[lens];

  function handleLensChange(id: PersonaId) {
    setLens(id);
    setPersona(id);
  }

  const zone3LeftTitle = ar ? 'جدول التجديدات' : 'Renewal pipeline';
  const zone3LeftTag = {
    label: ar ? '5 عاجلة' : '5 urgent',
    style: { background: '#FEF2F2', color: '#B91C1C' },
  };

  const briefingDate = ar ? '5 مايو 2026 · 09:00' : 'May 5, 2026 · 09:00';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface-2)' }}>
      {showBoardBrief && (
        <BoardBriefModal
          lens={lens}
          lensColor={LENS_COLOR[lens]}
          onClose={() => navigate('/portfolio')}
        />
      )}
      <ChromeBar />

      <div className="flex-1 overflow-y-auto pt-11">
        <div className="max-w-[1200px] mx-auto px-6 py-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-[15px] font-bold text-[var(--brand-navy)]">
                {ar ? 'ذكاء المحفظة' : 'Portfolio Intelligence'}
              </h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {ar ? 'تحليل متقاطع لعقود المدار القابضة · 25 عقداً' : 'Cross-contract analysis · Al-Madar Holding · 25 contracts'}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <Clock size={10} className="text-gray-400" />
                <span className="text-[10px] text-gray-400" dir="ltr">
                  {ar ? 'إحاطة الذكاء الاصطناعي · ' : 'Intelligence brief · '}{briefingDate}
                </span>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#F0FDF4', color: '#15803D' }}
                >
                  {ar ? 'مباشر' : 'Live'}
                </span>
              </div>
            </div>
            <PersonaLensToggle active={lens} onChange={handleLensChange} />
          </div>

          {/* Zone 1 — Narrative */}
          <div className="mb-4">
            <NarrativeBlock lens={lens} lensColor={lensColor} />
          </div>

          {/* Zone 2 — Metric cards */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {lensMetrics.map((m, i) => (
              <MetricCard key={i} {...m} route={metricRoutes[i]} />
            ))}
          </div>

          {/* Below-fold content guide */}
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-white border border-gray-100">
            <ChevronDown size={12} className="text-gray-300 flex-shrink-0" />
            <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto flex-nowrap">
              {[
                { label: ar ? 'جدول التجديدات' : 'Renewal pipeline', urgent: false },
                { label: ar ? 'التعارضات (5)' : 'Contradictions (5)', urgent: true },
                { label: ar ? 'مصفوفة المخاطر' : 'Risk matrix', urgent: false },
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-1 text-[10px] whitespace-nowrap flex-shrink-0">
                  {i > 0 && <span className="text-gray-200 mx-1">·</span>}
                  <span style={{ color: item.urgent ? '#B45309' : '#94A3B8' }}>{item.label}</span>
                </span>
              ))}
            </div>
            <span className="text-[9px] text-gray-300 whitespace-nowrap flex-shrink-0">
              {ar ? 'مرر للأسفل ↓' : 'scroll ↓'}
            </span>
          </div>

          {/* Zone 3 — Lens-adaptive left + right panels */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] font-bold text-[var(--brand-navy)]">{zone3LeftTitle}</p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={zone3LeftTag.style}>
                  {zone3LeftTag.label}
                </span>
              </div>
              <RenewalPipeline />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <Zone3RightPanel lens={lens} />
            </div>
          </div>

          {/* Zone 4 — Risk Matrix + Contradictions */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <RiskMatrix />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <ContradictionList />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
