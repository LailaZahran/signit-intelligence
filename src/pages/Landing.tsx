import { useState } from 'react';
import { useLocation } from 'wouter';
import { usePersona } from '@/context/PersonaContext';
import { useLanguage } from '@/context/LanguageContext';
import { AR_PERSONAS, AR_UI, EN_UI } from '@/data/ar';
import { ChromeBar } from '@/components/layout/ChromeBar';
import { TimelineStrip } from '@/components/landing/TimelineStrip';
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

export default function Landing() {
  const { activePersona } = usePersona();
  const { ar } = useLanguage();
  const [, navigate] = useLocation();
  const [cmdQuery, setCmdQuery] = useState('');

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
            <div
              className="flex items-center gap-3 rounded-xl border-2 border-[var(--brand-indigo)] bg-[#FAFBFF] px-4 mb-4 transition-shadow focus-within:shadow-md"
              style={{ height: '54px' }}
              data-testid="command-bar"
            >
              <Search size={17} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && cmdQuery.trim()) {
                    navigate(`/contracts?q=${encodeURIComponent(cmdQuery.trim())}`);
                  }
                }}
                placeholder={cmdPlaceholder}
                className="flex-1 bg-transparent text-[15px] text-[var(--brand-navy)] placeholder:text-gray-400 focus:outline-none"
                dir={ar ? 'rtl' : 'ltr'}
                data-testid="command-input"
              />
              <span className="flex-shrink-0 text-[10px] font-semibold text-gray-300 border border-gray-200 rounded px-1.5 py-0.5">
                {ui.cmdKbd}
              </span>
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
