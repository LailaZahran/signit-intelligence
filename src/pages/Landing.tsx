import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { usePersona } from '@/context/PersonaContext';
import { useLanguage } from '@/context/LanguageContext';
import { AR_PERSONAS, AR_UI, EN_UI } from '@/data/ar';
import { ChromeBar } from '@/components/layout/ChromeBar';
import { TimelineStrip } from '@/components/landing/TimelineStrip';
import { contracts } from '@/data/contracts';
import {
  GitMerge, ShieldAlert, Lock, Columns2, FileDown, Flag,
  RefreshCw, Clock, DoorOpen, Upload,
  TrendingUp, Presentation, EyeOff,
  Search, ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  GitMerge, ShieldAlert, Lock, Columns2, FileDown, Flag,
  RefreshCw, Clock, DoorOpen, Upload,
  TrendingUp, Presentation, EyeOff,
};

function greetingWord(ar: boolean): string {
  const h = new Date().getHours();
  const ui = ar ? AR_UI : EN_UI;
  if (h < 12) return ui.greetingMorning;
  if (h < 18) return ui.greetingAfternoon;
  return ui.greetingEvening;
}

const RISK_BADGE: Record<string, { bg: string; text: string }> = {
  critical: { bg: '#FEF2F2', text: '#B91C1C' },
  high:     { bg: '#FFF7ED', text: '#C2410C' },
  medium:   { bg: '#FFFBEB', text: '#92400E' },
  low:      { bg: '#F0FDF4', text: '#15803D' },
};

export default function Landing() {
  const { activePersona } = usePersona();
  const { ar } = useLanguage();
  const [, navigate] = useLocation();
  const [cmdQuery, setCmdQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const cmdWrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (cmdWrapperRef.current && !cmdWrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    const q = cmdQuery.trim().toLowerCase();
    if (!q) return [];
    return contracts
      .filter((c) =>
        c.counterparty.toLowerCase().includes(q) ||
        (c.counterpartyAr ?? '').includes(cmdQuery.trim()) ||
        c.title.toLowerCase().includes(q) ||
        (c.titleAr ?? '').includes(cmdQuery.trim()) ||
        c.contractNumber.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.riskLevel.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q) ||
        c.signals.some((s) => s.label.toLowerCase().includes(q)) ||
        c.riskFlags.some((f) => f.title.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [cmdQuery]);

  const ui = ar ? AR_UI : EN_UI;
  const arData = AR_PERSONAS[activePersona.id];

  const firstName = activePersona.name.split(' ')[0];
  const briefingLines = ar ? arData.briefingLines : activePersona.briefingLines;
  const cmdPlaceholder = ar ? arData.cmdPlaceholder : activePersona.cmdPlaceholder;
  const footerNote = ar ? arData.footerNote : activePersona.footerNote;
  const footerStat = ar ? arData.footerStat : activePersona.footerStat;

  const primaryBubbles = activePersona.bubbles.filter((b) => b.isPrimary);
  const secondaryBubbles = activePersona.bubbles.filter((b) => !b.isPrimary);
  const arBubbleLabels = arData.bubbleLabels;

  const isProcurement = activePersona.id === 'procurement';

  return (
    <div className="min-h-screen hero-gradient flex flex-col" dir={ar ? 'rtl' : 'ltr'}>
      <ChromeBar />

      <div className="flex-1 flex flex-col items-center justify-start pt-24 pb-12 px-4">
        <div className="w-full max-w-[680px] flex flex-col gap-4">

          {/* ── Card ── */}
          <div
            className="rounded-2xl bg-white/90 backdrop-blur-sm border border-white/60 px-6 py-5"
            style={{ boxShadow: 'var(--shadow-xl)' }}
            data-testid="briefing-card"
          >
            {/* Greeting row */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--brand-indigo)] mb-1">
                  {ui.briefLabel}
                </p>
                <h1 className="text-lg font-semibold text-[var(--brand-navy)] leading-tight">
                  {greetingWord(ar)}،{' '}<span dir="ltr">{firstName}</span>
                </h1>
              </div>
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: 'var(--gradient-cta)' }}
              >
                {activePersona.initials}
              </div>
            </div>

            {/* ── 1. Command bar — FIRST, prominent ── */}
            <div className="relative mb-4" ref={cmdWrapperRef} data-testid="command-bar">
              <div
                className="flex items-center gap-3 rounded-xl border-2 border-[var(--brand-indigo)] bg-[#FAFBFF] px-4 transition-shadow focus-within:shadow-md"
                style={{ height: '54px' }}
              >
                <Search size={17} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={cmdQuery}
                  onChange={(e) => { setCmdQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => { if (cmdQuery.trim()) setShowDropdown(true); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && cmdQuery.trim()) {
                      setShowDropdown(false);
                      navigate(`/contracts?q=${encodeURIComponent(cmdQuery.trim())}`);
                    }
                    if (e.key === 'Escape') setShowDropdown(false);
                  }}
                  placeholder={cmdPlaceholder}
                  className="flex-1 bg-transparent text-[15px] text-[var(--brand-navy)] placeholder:text-gray-400 focus:outline-none"
                  dir={ar ? 'rtl' : 'ltr'}
                  data-testid="command-input"
                  autoComplete="off"
                />
                <span className="flex-shrink-0 text-[10px] font-semibold text-gray-300 border border-gray-200 rounded px-1.5 py-0.5">
                  {ui.cmdKbd}
                </span>
              </div>

              {/* Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div
                  className="absolute left-0 right-0 top-[58px] rounded-xl border border-gray-200 bg-white overflow-hidden z-50"
                  style={{ boxShadow: 'var(--shadow-xl)' }}
                >
                  {suggestions.map((c) => {
                    const badge = RISK_BADGE[c.riskLevel];
                    const label = ar && c.counterpartyAr ? c.counterpartyAr : c.counterparty;
                    const title = ar && c.titleAr ? c.titleAr : c.title;
                    return (
                      <button
                        key={c.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setShowDropdown(false);
                          setCmdQuery('');
                          navigate(`/contracts/${c.id}`);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--brand-indigo-pale)] transition-colors text-left border-b border-gray-50 last:border-0"
                        dir={ar ? 'rtl' : 'ltr'}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[var(--brand-navy)] truncate">{label}</p>
                          <p className="text-[11px] text-gray-400 truncate">{title}</p>
                        </div>
                        <span
                          className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded capitalize"
                          style={{ background: badge.bg, color: badge.text }}
                        >
                          {c.riskLevel}
                        </span>
                        <ArrowRight size={12} className="flex-shrink-0 text-gray-300" style={{ transform: ar ? 'scaleX(-1)' : undefined }} />
                      </button>
                    );
                  })}
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowDropdown(false);
                      navigate(`/contracts?q=${encodeURIComponent(cmdQuery.trim())}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[11px] font-medium text-[var(--brand-indigo)] hover:bg-[var(--brand-indigo-pale)] transition-colors border-t border-gray-100"
                  >
                    <Search size={11} />
                    {ar ? `عرض جميع النتائج لـ "${cmdQuery}"` : `See all results for "${cmdQuery}"`}
                  </button>
                </div>
              )}

              {/* No results */}
              {showDropdown && cmdQuery.trim() && suggestions.length === 0 && (
                <div
                  className="absolute left-0 right-0 top-[58px] rounded-xl border border-gray-200 bg-white px-4 py-3 z-50 text-center"
                  style={{ boxShadow: 'var(--shadow-xl)' }}
                >
                  <p className="text-[12px] text-gray-400">{ar ? 'لا توجد نتائج' : 'No contracts found'}</p>
                </div>
              )}
            </div>

            {/* ── 2. Action bubbles ── */}
            <div className="mb-4" data-testid="action-bubbles">
              {/* Primary row */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                {primaryBubbles.map((bubble, i) => {
                  const Icon = ICON_MAP[bubble.icon] ?? Search;
                  const label = ar ? arBubbleLabels[i] : bubble.label;
                  return (
                    <button
                      key={i}
                      onClick={() => navigate(bubble.navigateTo)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{ background: 'var(--gradient-cta)', boxShadow: 'var(--shadow-sm)' }}
                      data-testid={`bubble-primary-${i}`}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  );
                })}
              </div>
              {/* Secondary row */}
              <div className="grid grid-cols-4 gap-1.5">
                {secondaryBubbles.map((bubble, i) => {
                  const Icon = ICON_MAP[bubble.icon] ?? Search;
                  const label = ar ? arBubbleLabels[primaryBubbles.length + i] : bubble.label;
                  return (
                    <button
                      key={i}
                      onClick={() => navigate(bubble.navigateTo)}
                      className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-[11px] font-medium border bg-white/80 transition-all hover:bg-white hover:shadow-sm hover:border-[var(--brand-indigo)] hover:text-[var(--brand-indigo)] text-gray-500 border-gray-200 active:scale-[0.97]"
                      data-testid={`bubble-secondary-${i}`}
                    >
                      <Icon size={14} className="opacity-70" />
                      <span className="text-center leading-tight">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 3. Timeline strip (Procurement only) ── */}
            {isProcurement && (
              <div className="mb-4">
                <TimelineStrip />
              </div>
            )}

            {/* ── 4. Intelligence brief items ── */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--brand-indigo)] mb-2">
                {ui.briefLabel}
              </p>
              <div className="flex flex-col divide-y divide-gray-100">
                {briefingLines.map((line, i) => {
                  const navigateTo = activePersona.briefingLines[i]?.navigateTo ?? '/';
                  return (
                    <button
                      key={i}
                      onClick={() => navigate(navigateTo)}
                      className="group flex items-center gap-3 py-2.5 text-left hover:bg-[var(--brand-indigo-pale)] hover:rounded-lg px-2 -mx-2 transition-colors"
                      dir={ar ? 'rtl' : 'ltr'}
                      data-testid={`briefing-line-${i}`}
                    >
                      <span
                        className="h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                        style={{
                          background: activePersona.id === 'procurement'
                            ? '#0D9488'
                            : activePersona.id === 'cfo'
                            ? '#D97706'
                            : 'var(--brand-indigo)',
                        }}
                      >
                        {ar ? ['١','٢','٣'][i] : i + 1}
                      </span>
                      <span className="flex-1 text-[13px] text-[var(--brand-navy)] leading-snug group-hover:text-[var(--brand-indigo)] transition-colors">
                        {line.text}
                      </span>
                      {line.delta && (
                        <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 whitespace-nowrap" dir="ltr">
                          {line.delta}
                        </span>
                      )}
                      <ArrowRight
                        size={13}
                        className="flex-shrink-0 text-gray-300 group-hover:text-[var(--brand-indigo)] transition-colors"
                        style={{ transform: ar ? 'scaleX(-1)' : undefined }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 5. Footer stat line ── */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2" dir={ar ? 'rtl' : 'ltr'}>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-indigo)] opacity-50 flex-shrink-0" />
              <p className="text-[11px] text-gray-400 font-medium">{footerStat}</p>
            </div>
          </div>

          {/* ── Footer note (below card) ── */}
          <p
            className="text-center text-[11px] text-white/60 leading-relaxed px-4"
            data-testid="footer-note"
            dir={ar ? 'rtl' : 'ltr'}
          >
            {footerNote}
          </p>

        </div>
      </div>
    </div>
  );
}
