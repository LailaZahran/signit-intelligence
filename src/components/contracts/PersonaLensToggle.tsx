import { PersonaId } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface PersonaLensToggleProps {
  active: PersonaId;
  onChange: (id: PersonaId) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}

const LENSES: { id: PersonaId; label: string; labelAr: string; color: string; bg: string; border: string }[] = [
  { id: 'legal',       label: 'Legal',       labelAr: 'قانوني',   color: '#6366F1', bg: '#EEF2FF', border: '#A5B4FC' },
  { id: 'procurement', label: 'Procurement', labelAr: 'مشتريات', color: '#0D9488', bg: '#F0FDF4', border: '#6EE7B7' },
  { id: 'cfo',         label: 'CFO / COO',   labelAr: 'مالية',    color: '#D97706', bg: '#FFFBEB', border: '#FCD34D' },
];

export function PersonaLensToggle({ active, onChange, size = 'md', fullWidth = false }: PersonaLensToggleProps) {
  const { ar } = useLanguage();
  const padding = size === 'sm' ? 'px-2.5 py-1 text-[11px]' : fullWidth ? 'px-4 py-2.5 text-[12px]' : 'px-3.5 py-1.5 text-xs';

  if (fullWidth) {
    return (
      <div className="flex border-b border-gray-200 -mx-6 px-0" data-testid="persona-lens-toggle">
        {LENSES.map((lens) => {
          const isActive = active === lens.id;
          return (
            <button
              key={lens.id}
              onClick={() => onChange(lens.id)}
              className={`${padding} font-semibold flex-1 transition-all border-b-2 whitespace-nowrap`}
              style={isActive ? {
                color: lens.color,
                borderBottomColor: lens.color,
                background: 'white',
              } : {
                color: '#94A3B8',
                borderBottomColor: 'transparent',
                background: 'white',
              }}
              data-testid={`lens-${lens.id}`}
            >
              {ar ? lens.labelAr : lens.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden" data-testid="persona-lens-toggle">
      {LENSES.map((lens) => {
        const isActive = active === lens.id;
        return (
          <button
            key={lens.id}
            onClick={() => onChange(lens.id)}
            className={`${padding} font-semibold flex-1 transition-all border-r last:border-r-0 border-gray-200 whitespace-nowrap`}
            style={isActive ? {
              background: lens.bg,
              color: lens.color,
              borderColor: lens.border,
            } : {
              background: 'white',
              color: '#94A3B8',
            }}
            data-testid={`lens-${lens.id}`}
          >
            {lens.label}
          </button>
        );
      })}
    </div>
  );
}
