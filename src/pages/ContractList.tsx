import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearch, useLocation } from 'wouter';
import { ChromeBar } from '@/components/layout/ChromeBar';
import { ContractCard, CONTRACT_ROW_GRID } from '@/components/contracts/ContractCard';
import { QuickSummaryPanel } from '@/components/contracts/QuickSummaryPanel';
import { contracts } from '@/data/contracts';
import { usePersona } from '@/context/PersonaContext';
import { useLanguage } from '@/context/LanguageContext';
import { Contract, PersonaId } from '@/types';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { CompareModal } from '@/components/contracts/CompareModal';

type SortKey = 'urgency' | 'risk' | 'value';
type FilterKey = 'all' | 'flagged' | 'renewing' | 'liability' | 'urgent' | 'break' | 'pdpl';

const RISK_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

function applyFilter(list: Contract[], filter: FilterKey): Contract[] {
  switch (filter) {
    case 'flagged':
      return list.filter((c) => c.status === 'flagged');
    case 'renewing':
      return list.filter(
        (c) =>
          c.daysToNextCritical < 180 &&
          c.signals.some((s) => s.label.toLowerCase().includes('renew') || s.label.toLowerCase().includes('renewal'))
      );
    case 'liability':
      return list.filter((c) =>
        c.riskFlags.some((f) => f.title.toLowerCase().includes('liab'))
      );
    case 'urgent':
      return list.filter((c) => c.daysToNextCritical < 60);
    case 'break':
      return list.filter((c) =>
        c.riskFlags.some((f) => f.title.toLowerCase().includes('break'))
      );
    case 'pdpl':
      return list.filter((c) =>
        c.signals.some((s) => s.label.toLowerCase().includes('pdpl') || s.label.toLowerCase().includes('data residen'))
      );
    default:
      return list;
  }
}

function applySort(list: Contract[], sort: SortKey): Contract[] {
  return [...list].sort((a, b) => {
    if (sort === 'urgency') return a.daysToNextCritical - b.daysToNextCritical;
    if (sort === 'risk') return RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel];
    return b.annualValueSAR - a.annualValueSAR;
  });
}

const FILTER_LABELS: Record<FilterKey, { en: string; ar: string }> = {
  all:       { en: 'All contracts', ar: 'جميع العقود' },
  flagged:   { en: 'Flagged',       ar: 'مُعلَّمة' },
  renewing:  { en: 'Renewing soon', ar: 'التجديد قريب' },
  liability: { en: 'Liability risk', ar: 'مخاطر المسؤولية' },
  urgent:    { en: 'Urgent (<60d)', ar: 'عاجل (<60 يوم)' },
  break:     { en: 'Break clause',  ar: 'شرط الإنهاء' },
  pdpl:      { en: 'PDPL risk',     ar: 'مخاطر حماية البيانات' },
};

const SORT_LABELS: Record<SortKey, { en: string; ar: string }> = {
  urgency: { en: 'Urgency',     ar: 'الإلحاح' },
  risk:    { en: 'Risk score',  ar: 'درجة المخاطرة' },
  value:   { en: 'Annual value', ar: 'القيمة السنوية' },
};

const PERSONA_DEFAULT_SORT: Record<PersonaId, SortKey> = {
  legal:       'risk',
  procurement: 'urgency',
  cfo:         'value',
};

export default function ContractList() {
  const rawSearch = useSearch();
  const params = useMemo(() => new URLSearchParams(rawSearch), [rawSearch]);
  const [, navigate] = useLocation();

  const { activePersonaId } = usePersona();
  const { ar } = useLanguage();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>((params.get('filter') as FilterKey) ?? 'all');
  const [sort, setSort] = useState<SortKey>(PERSONA_DEFAULT_SORT[activePersonaId]);
  const [selectedId, setSelectedId] = useState<string | null>(params.get('contract'));
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showCompare, setShowCompare] = useState(params.get('mode') === 'compare');
  const searchRef = useRef<HTMLInputElement>(null);

  // Sync URL params on mount (?contract=, ?filter=, ?q=)
  useEffect(() => {
    const urlContract = params.get('contract');
    if (urlContract) setSelectedId(urlContract);
    const urlFilter = params.get('filter') as FilterKey | null;
    if (urlFilter) setFilter(urlFilter);
    const urlQ = params.get('q');
    if (urlQ) setQuery(urlQ);
  }, []);

  // Update default sort when persona changes
  useEffect(() => {
    setSort(PERSONA_DEFAULT_SORT[activePersonaId]);
  }, [activePersonaId]);

  const filtered = useMemo(() => {
    let list = contracts;
    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.counterparty.toLowerCase().includes(q) ||
          (c.counterpartyAr ?? '').includes(query.trim()) ||
          c.title.toLowerCase().includes(q) ||
          (c.titleAr ?? '').includes(query.trim()) ||
          c.contractNumber.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q) ||
          c.riskLevel.toLowerCase().includes(q) ||
          c.status.toLowerCase().includes(q) ||
          c.signals.some((s) => s.label.toLowerCase().includes(q)) ||
          c.riskFlags.some((f) => f.title.toLowerCase().includes(q))
      );
    }
    list = applyFilter(list, filter);
    return applySort(list, sort);
  }, [query, filter, sort]);

  const selectedContract = selectedId ? contracts.find((c) => c.id === selectedId) ?? null : null;

  // Keyboard shortcuts: Esc / J / K / / / Enter
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.key === 'Escape') {
        setSelectedId(null);
        setShowFilterMenu(false);
        setShowSortMenu(false);
        return;
      }
      if (isInput) return;

      if (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedId((prev) => {
          const idx = filtered.findIndex((c) => c.id === prev);
          const next = filtered[idx + 1] ?? filtered[0];
          return next?.id ?? prev;
        });
        return;
      }
      if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedId((prev) => {
          const idx = filtered.findIndex((c) => c.id === prev);
          const next = filtered[idx - 1] ?? filtered[filtered.length - 1];
          return next?.id ?? prev;
        });
        return;
      }
      if (e.key === 'Enter' && selectedId) {
        navigate(`/contracts/${selectedId}`);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtered, selectedId, navigate]);

  function handleCardClick(id: string) {
    setSelectedId(id);
  }

  const hasPanel = selectedContract !== null;
  const t = (en: string, arStr: string) => (ar ? arStr : en);

  const compareContract = selectedContract ?? contracts[0];

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--surface-2)' }}>
      {showCompare && compareContract && (
        <CompareModal
          contractA={compareContract}
          activeLens={activePersonaId}
          onClose={() => { setShowCompare(false); navigate('/contracts'); }}
        />
      )}
      <ChromeBar />

      {/* Main layout below ChromeBar */}
      <div className="flex flex-1 overflow-hidden pt-11">
        {/* Left: card list */}
        <div
          className="flex flex-col overflow-hidden transition-all duration-300"
          style={{ width: hasPanel ? 'calc(100% - 360px)' : '100%' }}
        >
          {/* Sticky toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-2 flex-shrink-0">
            {/* Search */}
            <div className="flex-1 min-w-0 relative">
              <Search
                size={14}
                className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                style={{ [ar ? 'right' : 'left']: '10px' }}
              />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('Search contracts…', 'البحث في العقود...')}
                className="w-full text-[12px] bg-gray-50 border border-gray-200 rounded-lg py-1.5 outline-none focus:border-[var(--brand-indigo)] focus:bg-white transition-colors"
                style={{
                  paddingLeft: ar ? '10px' : '30px',
                  paddingRight: ar ? '30px' : '10px',
                }}
                data-testid="contracts-search"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  style={{ [ar ? 'left' : 'right']: '8px' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowFilterMenu((v) => !v); setShowSortMenu(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors whitespace-nowrap"
                style={{ color: filter !== 'all' ? 'var(--brand-indigo)' : '#64748B', borderColor: filter !== 'all' ? 'var(--brand-indigo)' : undefined }}
                data-testid="filter-dropdown-btn"
              >
                <SlidersHorizontal size={12} />
                {ar ? FILTER_LABELS[filter].ar : FILTER_LABELS[filter].en}
                <ChevronDown size={11} />
              </button>
              {showFilterMenu && (
                <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1 min-w-40" style={{ [ar ? 'right' : 'left']: 0 }}>
                  {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => { setFilter(key); setShowFilterMenu(false); }}
                      className="w-full text-start px-3 py-1.5 text-[12px] hover:bg-gray-50 transition-colors font-medium"
                      style={{ color: filter === key ? 'var(--brand-indigo)' : '#374151' }}
                    >
                      {ar ? FILTER_LABELS[key].ar : FILTER_LABELS[key].en}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowSortMenu((v) => !v); setShowFilterMenu(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors whitespace-nowrap"
                style={{ color: '#64748B' }}
                data-testid="sort-dropdown-btn"
              >
                {t('Sort:', 'ترتيب:')} {ar ? SORT_LABELS[sort].ar : SORT_LABELS[sort].en}
                <ChevronDown size={11} />
              </button>
              {showSortMenu && (
                <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-1 min-w-36" style={{ [ar ? 'right' : 'left']: 0 }}>
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => { setSort(key); setShowSortMenu(false); }}
                      className="w-full text-start px-3 py-1.5 text-[12px] hover:bg-gray-50 transition-colors font-medium"
                      style={{ color: sort === key ? 'var(--brand-indigo)' : '#374151' }}
                    >
                      {ar ? SORT_LABELS[key].ar : SORT_LABELS[key].en}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Count */}
            <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap flex-shrink-0">
              {filtered.length}{t(' contracts', ' عقد')}
            </span>
          </div>

          {/* Active filter banner */}
          {filter !== 'all' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-indigo-pale)] border-b border-[#C7D2FE] text-[11px]">
              <span className="font-medium" style={{ color: 'var(--brand-indigo)' }}>
                {t('Filtered by:', 'مُصفَّى بـ:')} {ar ? FILTER_LABELS[filter].ar : FILTER_LABELS[filter].en}
              </span>
              <button
                onClick={() => setFilter('all')}
                className="flex items-center gap-1 font-medium hover:underline"
                style={{ color: 'var(--brand-indigo)' }}
              >
                <X size={11} />
                {t('Clear', 'إلغاء')}
              </button>
            </div>
          )}

          {/* Column header */}
          <div
            className="flex-shrink-0 border-b border-gray-200 bg-gray-50"
            style={{
              display: 'grid',
              gridTemplateColumns: CONTRACT_ROW_GRID,
              paddingLeft: 14,
              paddingRight: 14,
              paddingTop: 6,
              paddingBottom: 6,
            }}
            dir={ar ? 'rtl' : 'ltr'}
          >
            {/* Contract — sorts by risk */}
            <button
              onClick={() => setSort('risk')}
              className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors"
              style={{ color: sort === 'risk' ? 'var(--brand-indigo)' : '#9CA3AF' }}
            >
              {t('Contract', 'العقد')}
              <span style={{ opacity: sort === 'risk' ? 1 : 0, fontSize: 10 }}>↑</span>
            </button>
            {/* Value — sorts by value (desc) */}
            <button
              onClick={() => setSort('value')}
              className="text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 w-full transition-colors"
              style={{ color: sort === 'value' ? 'var(--brand-indigo)' : '#9CA3AF' }}
            >
              {t('Value', 'القيمة')}
              <span style={{ opacity: sort === 'value' ? 1 : 0, fontSize: 10 }}>↓</span>
            </button>
            {/* Status — not sortable */}
            <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 text-center select-none">
              {t('Status', 'الحالة')}
            </div>
            {/* Critical date — sorts by urgency (asc) */}
            <button
              onClick={() => setSort('urgency')}
              className="text-[10px] font-semibold uppercase tracking-wider flex items-center justify-end gap-1 w-full transition-colors"
              style={{ color: sort === 'urgency' ? 'var(--brand-indigo)' : '#9CA3AF' }}
            >
              <span style={{ opacity: sort === 'urgency' ? 1 : 0, fontSize: 10 }}>↑</span>
              {t('Critical date', 'الموعد الحرج')}
            </button>
            {/* Notice — not sortable */}
            <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 text-right select-none">
              {t('Notice', 'الإشعار')}
            </div>
            {/* Signals — not sortable, with color legend */}
            <div
              className="flex flex-col items-end gap-0.5 pe-0.5 select-none"
              title={t('Red = critical risk · Amber = warning · Green = compliant', 'أحمر = مخاطرة حرجة · كهرماني = تحذير · أخضر = سليم')}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {t('Signals', 'الإشارات')}
              </span>
              <div className="flex items-center gap-[3px]">
                <div className="h-[5px] w-[5px] rounded-full" style={{ background: '#B91C1C' }} />
                <div className="h-[5px] w-[5px] rounded-full" style={{ background: '#B45309' }} />
                <div className="h-[5px] w-[5px] rounded-full" style={{ background: '#15803D' }} />
              </div>
            </div>
          </div>

          {/* Row list */}
          <div
            className="flex-1 overflow-y-auto bg-white"
            dir={ar ? 'rtl' : 'ltr'}
            onClick={() => {
              if (showFilterMenu || showSortMenu) {
                setShowFilterMenu(false);
                setShowSortMenu(false);
              }
            }}
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Search size={22} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-600">
                    {t('No contracts found', 'لا توجد عقود')}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {t('Try adjusting your search or filter', 'جرّب تعديل البحث أو الفلتر')}
                  </p>
                </div>
                <button
                  onClick={() => { setQuery(''); setFilter('all'); }}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 transition-colors"
                >
                  {t('Clear filters', 'مسح الفلاتر')}
                </button>
              </div>
            ) : (
              filtered.map((c) => (
                <ContractCard
                  key={c.id}
                  contract={c}
                  isSelected={selectedId === c.id}
                  onClick={() => handleCardClick(c.id)}
                  activeLens={activePersonaId}
                />
              ))
            )}
          </div>

          {/* Keyboard shortcut hint strip — sticky status bar */}
          {filtered.length > 0 && (
            <div
              className="flex-shrink-0 border-t border-gray-100 py-1.5 px-4 bg-white flex items-center gap-4"
              dir="ltr"
            >
              <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-300">
                shortcuts
              </span>
              {[
                { key: 'J / K', label: t('navigate', 'تنقل') },
                { key: '↵', label: t('open', 'فتح') },
                { key: '/', label: t('search', 'بحث') },
                { key: 'Esc', label: t('close', 'إغلاق') },
              ].map((s) => (
                <div key={s.key} className="flex items-center gap-1">
                  <kbd className="text-[9px] font-mono px-1 py-0.5 rounded bg-gray-50 border border-gray-200 text-gray-400 leading-none">
                    {s.key}
                  </kbd>
                  <span className="text-[9px] text-gray-300">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick summary panel */}
        <div
          className="flex-shrink-0 border-s border-gray-200 bg-white overflow-hidden transition-all duration-300"
          style={{ width: hasPanel ? '360px' : '0px' }}
        >
          {selectedContract && (
            <QuickSummaryPanel
              contract={selectedContract}
              initialLens={activePersonaId}
              onClose={() => setSelectedId(null)}
            />
          )}
        </div>
      </div>

      {/* Click-outside overlay for menus */}
      {(showFilterMenu || showSortMenu) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => { setShowFilterMenu(false); setShowSortMenu(false); }}
        />
      )}
    </div>
  );
}
