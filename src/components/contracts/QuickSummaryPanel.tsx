import { useState } from 'react';
import { useLocation } from 'wouter';
import { Contract, PersonaId } from '@/types';
import { PersonaLensToggle } from './PersonaLensToggle';
import { SignalStrip } from './SignalStrip';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { X, ExternalLink, Flag, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { CompareModal } from './CompareModal';

interface QuickSummaryPanelProps {
  contract: Contract;
  initialLens: PersonaId;
  onClose: () => void;
}

const SEVERITY_ICON = {
  critical: <AlertCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#B91C1C' }} />,
  high:     <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#B45309' }} />,
  medium:   <Info size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#3B82F6' }} />,
};

const FLAG_STYLE: Record<string, { bg: string; border: string; titleColor: string; descColor: string }> = {
  critical: { bg: '#FEF2F2', border: '#FECACA', titleColor: '#991B1B', descColor: '#B91C1C' },
  high:     { bg: '#FFFBEB', border: '#FDE68A', titleColor: '#92400E', descColor: '#B45309' },
  medium:   { bg: '#EFF6FF', border: '#BFDBFE', titleColor: '#1D4ED8', descColor: '#3B82F6' },
};

const LENS_COLOR: Record<PersonaId, string> = {
  legal: '#6366F1',
  procurement: '#0D9488',
  cfo: '#D97706',
};

const CONF_COLOR = (v: number) => v >= 90 ? '#6366F1' : v >= 70 ? '#B45309' : '#B91C1C';

export function QuickSummaryPanel({ contract: c, initialLens, onClose }: QuickSummaryPanelProps) {
  const [lens, setLens] = useState<PersonaId>(initialLens);
  const [showCompare, setShowCompare] = useState(false);
  const [, navigate] = useLocation();
  const { ar } = useLanguage();

  function handleFlag() {
    toast({
      title: ar ? 'تم تعليم العقد للمراجعة' : 'Flagged for review',
      description: c.counterparty,
    });
  }

  const lensColor = LENS_COLOR[lens];
  const summary = c.aiSummary[lens];
  const visibleFlags = c.riskFlags.filter((f) => f.persona.includes(lens));

  return (
    <div
      className="flex flex-col h-full bg-white overflow-hidden"
      dir={ar ? 'rtl' : 'ltr'}
      data-testid="quick-summary-panel"
    >
      {showCompare && (
        <CompareModal
          contractA={c}
          activeLens={lens}
          onClose={() => setShowCompare(false)}
        />
      )}
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5" dir="ltr">
            {c.contractNumber}
          </p>
          <h3 className="text-[13px] font-bold text-[var(--brand-navy)] leading-tight" dir="ltr">
            {c.counterparty}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5" dir="ltr">{c.title}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          data-testid="panel-close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* Signals */}
        <div className="px-4 py-3 border-b border-gray-100">
          <SignalStrip signals={c.signals} size="md" />
        </div>

        {/* Lens toggle */}
        <div className="px-4 py-3 border-b border-gray-100">
          <PersonaLensToggle active={lens} onChange={setLens} size="sm" />
        </div>

        {/* 1. AI Summary */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: lensColor }}>
            {ar ? 'الملخص الذكي' : 'AI Summary'}
          </p>
          <div
            className="rounded-lg px-3 py-2.5 text-[12px] leading-relaxed text-[var(--brand-navy)]"
            dir="ltr"
            style={{
              borderLeft: `3px solid ${lensColor}`,
              background: '#F8F9FA',
            }}
          >
            {summary}
          </div>
        </div>

        {/* 2. Risk flags — ABOVE extracted fields */}
        {visibleFlags.length > 0 && (
          <div className="border-b border-gray-100">
            <p className="text-[10px] font-semibold uppercase tracking-widest px-4 pt-3 pb-2 text-gray-400">
              {ar ? 'مؤشرات المخاطر' : 'Risk flags'}
            </p>
            <div className="flex flex-col gap-2 px-4 pb-3">
              {visibleFlags.map((flag, i) => {
                const fs = FLAG_STYLE[flag.severity] ?? FLAG_STYLE.medium;
                return (
                  <div
                    key={i}
                    className="rounded-lg px-3 py-2"
                    style={{ background: fs.bg, border: `1px solid ${fs.border}` }}
                  >
                    <div className="flex items-start gap-1.5" dir="ltr">
                      {SEVERITY_ICON[flag.severity]}
                      <div>
                        <p className="text-[11px] font-semibold leading-tight" style={{ color: fs.titleColor }}>
                          {flag.title}
                        </p>
                        <p className="text-[11px] leading-snug mt-0.5" style={{ color: fs.descColor }}>
                          {flag.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Key extracted fields — 2-col grid */}
        <div className="border-b border-gray-100">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-4 pt-3 pb-2 text-gray-400">
            {ar ? 'البيانات المستخرجة' : 'Key fields'}
          </p>
          <div className="grid grid-cols-2 gap-1.5 px-4 pb-3">
            {c.extractedFields.slice(0, 6).map((f, i) => {
              const isCritical = f.riskLevel === 'critical';
              const isHigh = f.riskLevel === 'high';
              const valColor = isCritical ? '#B91C1C' : isHigh ? '#B45309' : 'var(--brand-navy)';
              const cc = CONF_COLOR(f.confidence);
              return (
                <div key={i} className="rounded-lg px-2.5 py-2" style={{ background: 'var(--surface-2)' }}>
                  <p className="text-[10px] text-gray-400 mb-1 leading-tight">{f.label}</p>
                  <p
                    className="text-[12px] font-semibold leading-tight"
                    style={{ color: valColor }}
                    dir="ltr"
                  >
                    {f.value}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <div className="flex-1 h-0.5 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${f.confidence}%`, background: cc }} />
                    </div>
                    <span className="text-[9px]" style={{ color: cc }}>{f.confidence}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-4 py-3 flex flex-col gap-2">
          <button
            onClick={() => navigate(`/contracts/${c.id}`)}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--gradient-cta)' }}
            data-testid="panel-view-detail"
          >
            <ExternalLink size={13} />
            {ar ? 'عرض التفاصيل' : 'View full detail'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCompare(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium border border-gray-200 text-gray-500 hover:border-[var(--brand-indigo)] hover:text-[var(--brand-indigo)] transition-colors"
              data-testid="panel-compare"
            >
              {ar ? 'مقارنة' : 'Compare'}
            </button>
            <button
              onClick={handleFlag}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
              data-testid="panel-flag"
            >
              <Flag size={11} />
              {ar ? 'تعليم' : 'Flag'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
