import { Contract, PersonaId } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface ContractCardProps {
  contract: Contract;
  isSelected: boolean;
  onClick: () => void;
  activeLens: PersonaId;
}

const TYPE_STYLE: Record<string, { en: string; ar: string; bg: string; text: string }> = {
  saas:       { en: 'SaaS',       ar: 'برمجيات',       bg: '#EEF2FF', text: '#4338CA' },
  vendor:     { en: 'Vendor',     ar: 'مورد',          bg: '#F0FDF4', text: '#15803D' },
  nda:        { en: 'NDA',        ar: 'سرية',          bg: '#F5F3FF', text: '#6D28D9' },
  employment: { en: 'Employment', ar: 'توظيف',         bg: '#FFF7ED', text: '#C2410C' },
  lease:      { en: 'Lease',      ar: 'إيجار',         bg: '#ECFDF5', text: '#065F46' },
  jv:         { en: 'JV',         ar: 'مشروع مشترك',  bg: '#FDF4FF', text: '#86198F' },
  legal:      { en: 'Legal',      ar: 'قانوني',        bg: '#FEF2F2', text: '#991B1B' },
  cloud:      { en: 'Cloud',      ar: 'سحابي',         bg: '#EEF2FF', text: '#4338CA' },
  marketing:  { en: 'Marketing',  ar: 'تسويق',         bg: '#FFF7ED', text: '#9A3412' },
};

const STATUS_STYLE: Record<string, { en: string; ar: string; bg: string; text: string }> = {
  active:         { en: 'Active',      ar: 'نشط',          bg: '#F0FDF4', text: '#15803D' },
  expiring:       { en: 'Expiring',    ar: 'قيد الانتهاء', bg: '#FEF2F2', text: '#B91C1C' },
  flagged:        { en: 'Flagged',     ar: 'مُعلَّم',      bg: '#FFFBEB', text: '#B45309' },
  in_negotiation: { en: 'Negotiating', ar: 'قيد التفاوض',  bg: '#EEF2FF', text: '#4338CA' },
};

const SIGNAL_COLOR: Record<string, string> = {
  red:   '#B91C1C',
  amber: '#B45309',
  green: '#15803D',
};

function daysColor(days: number): string {
  if (days < 60)  return '#B91C1C';
  if (days < 180) return '#B45309';
  return '#64748B';
}

// Grid columns — must match the header in ContractList
const GRID = '2fr 1fr 100px 80px 70px 56px';

export function ContractCard({ contract: c, isSelected, onClick, activeLens }: ContractCardProps) {
  const { ar } = useLanguage();

  const type   = TYPE_STYLE[c.type]   ?? { en: c.type,      ar: c.type,      bg: '#F1F5F9', text: '#475569' };
  const status = STATUS_STYLE[c.status] ?? { en: c.status, ar: c.status, bg: '#F1F5F9', text: '#475569' };
  const lensAccent = activeLens === 'legal' ? '#6366F1' : activeLens === 'procurement' ? '#0D9488' : '#D97706';
  const dayColor = daysColor(c.daysToNextCritical);

  return (
    <div
      onClick={onClick}
      role="row"
      data-testid={`contract-card-${c.id}`}
      className="cursor-pointer select-none transition-colors border-b border-gray-100 last:border-b-0"
      style={{
        display: 'grid',
        gridTemplateColumns: GRID,
        minHeight: 46,
        alignItems: 'center',
        paddingLeft: 14,
        paddingRight: 14,
        borderLeft: `2px solid ${isSelected ? lensAccent : 'transparent'}`,
        background: isSelected ? '#EEF2FF' : undefined,
      }}
      onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#EEF2FF'; }}
      onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = ''; }}
    >
      {/* Col 1 — Contract name + type badge + number */}
      <div className="min-w-0 py-2 pe-2">
        <p className="text-[13px] font-medium text-[var(--brand-navy)] truncate leading-tight" dir="ltr">
          {c.counterparty}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="text-[10px] font-semibold px-1.5 py-[1px] rounded flex-shrink-0"
            style={{ background: type.bg, color: type.text }}
          >
            {ar ? type.ar : type.en}
          </span>
          <span className="text-[9px] text-gray-300 font-mono truncate" dir="ltr">{c.contractNumber}</span>
        </div>
      </div>

      {/* Col 2 — Annual value */}
      <div className="text-center">
        <p className="text-[12px] font-medium text-[var(--brand-navy)] leading-tight" dir="ltr">
          {c.annualValueDisplay === 'No financial value' ? '—' : c.annualValueDisplay}
        </p>
      </div>

      {/* Col 3 — Status */}
      <div className="flex justify-center">
        <span
          className="text-[10px] font-medium px-1.5 py-[2px] rounded"
          style={{ background: status.bg, color: status.text }}
        >
          {ar ? status.ar : status.en}
        </span>
      </div>

      {/* Col 4 — Days to deadline */}
      <div className="text-right">
        <p className="text-[14px] font-semibold leading-tight" style={{ color: dayColor }} dir="ltr">
          {c.daysToNextCritical}{ar ? 'ي' : 'd'}
        </p>
        <p className="text-[9px] text-gray-400 leading-tight mt-0.5">
          {ar ? 'للموعد' : 'deadline'}
        </p>
      </div>

      {/* Col 5 — Notice required */}
      <div className="text-right">
        <p className="text-[12px] text-gray-500 leading-tight" dir="ltr">
          {c.noticeRequiredDays}{ar ? 'ي' : 'd'}
        </p>
      </div>

      {/* Col 6 — Signal dots */}
      <div className="flex items-center gap-[3px] justify-end pe-0.5">
        {c.signals.slice(0, 4).map((sig, i) => (
          <div
            key={i}
            title={sig.label}
            style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: SIGNAL_COLOR[sig.color] ?? '#94A3B8',
              flexShrink: 0,
              cursor: 'help',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Export the grid so ContractList can share it for the column header
export const CONTRACT_ROW_GRID = GRID;
