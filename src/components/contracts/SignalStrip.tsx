import { Signal } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/context/LanguageContext';

interface SignalStripProps {
  signals: Signal[];
  size?: 'sm' | 'md';
}

const COLOR_MAP = {
  red:   'bg-[var(--risk-red)]',
  amber: 'bg-[var(--risk-amber)]',
  green: 'bg-[var(--risk-green)]',
};

export function SignalStrip({ signals, size = 'sm' }: SignalStripProps) {
  const dotSize = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';
  const { ar } = useLanguage();
  return (
    <div className="flex items-center gap-1.5" data-testid="signal-strip">
      {signals.map((sig, i) => (
        <Tooltip key={i} delayDuration={150}>
          <TooltipTrigger asChild>
            <span
              className={`${dotSize} rounded-full flex-shrink-0 cursor-default ${COLOR_MAP[sig.color]}`}
              data-testid={`signal-dot-${sig.color}-${i}`}
            />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-xs text-xs font-medium"
          >
            {ar && sig.labelAr ? sig.labelAr : sig.label}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
