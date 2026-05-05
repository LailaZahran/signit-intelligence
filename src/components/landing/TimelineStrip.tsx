import { useLocation } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { AR_UI, EN_UI } from '@/data/ar';

type Urgency = 'red' | 'amber' | 'green';

interface TimelineItem {
  days: number;
  daysAr: string;
  name: string;
  nameAr: string;
  sub: string;
  subAr: string;
  urgency: Urgency;
  fillPct: number;
  route: string;
}

const ITEMS: TimelineItem[] = [
  { days: 30,  daysAr: '٣٠',  name: 'BrandWave',   nameAr: 'براند ويف',    sub: 'Non-renewal',    subAr: 'عدم التجديد',  urgency: 'red',   fillPct: 15,  route: '/contracts/c9' },
  { days: 47,  daysAr: '٤٧',  name: 'CloudCRM',    nameAr: 'كلاود CRM',   sub: 'Notice deadline', subAr: 'موعد الإشعار', urgency: 'red',   fillPct: 37,  route: '/contracts/c3' },
  { days: 119, daysAr: '١١٩', name: 'Office Lease', nameAr: 'عقد المكتب', sub: 'Break clause',    subAr: 'بند الفسخ',    urgency: 'amber', fillPct: 60,  route: '/contracts/c8' },
  { days: 192, daysAr: '١٩٢', name: 'Al-Mizan',    nameAr: 'المِيزان',   sub: 'Annual renewal',  subAr: 'تجديد سنوي',   urgency: 'amber', fillPct: 80,  route: '/contracts/c7' },
  { days: 335, daysAr: '٣٣٥', name: 'NexusCloud',  nameAr: 'نيكسس كلاود', sub: 'Renewal',        subAr: 'تجديد',         urgency: 'green', fillPct: 100, route: '/contracts/c6' },
];

const URGENCY = {
  red:   { bg: '#FEF2F2', bar: '#B91C1C', dot: '#B91C1C', days: '#B91C1C' },
  amber: { bg: '#FFFBEB', bar: '#B45309', dot: '#B45309', days: '#B45309' },
  green: { bg: '#F0FDF4', bar: '#15803D', dot: '#15803D', days: '#15803D' },
};

export function TimelineStrip() {
  const [, navigate] = useLocation();
  const { ar } = useLanguage();
  const ui = ar ? AR_UI : EN_UI;

  return (
    <div data-testid="timeline-strip">
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#0D9488' }}>
        {ui.timelineLabel}
      </p>
      <div
        className="flex rounded-xl overflow-hidden border border-gray-200"
        style={{ background: '#F8FAFC' }}
      >
        {ITEMS.map((item, i) => {
          const u = URGENCY[item.urgency];
          const isLast = i === ITEMS.length - 1;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.route)}
              className="flex-1 px-2.5 py-2.5 text-left transition-colors hover:brightness-95 cursor-pointer"
              style={{
                background: u.bg,
                borderRight: isLast ? 'none' : '1px solid #E2E8F0',
                direction: ar ? 'rtl' : 'ltr',
                textAlign: ar ? 'right' : 'left',
              }}
              data-testid={`timeline-item-${item.name.toLowerCase().replace(/\s/g, '-')}`}
            >
              {/* Fill bar */}
              <div className="h-0.5 rounded-full mb-2" style={{ background: '#E2E8F0' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.fillPct}%`, background: u.bar }}
                />
              </div>
              {/* Day count */}
              <div className="text-base font-semibold leading-none mb-1" style={{ color: u.days }}>
                {ar ? item.daysAr : item.days}
                <span className="text-[10px] font-normal ms-0.5">{ar ? 'ي' : 'd'}</span>
              </div>
              {/* Name */}
              <div className="text-[10px] font-semibold text-gray-800 truncate leading-tight">
                {ar ? item.nameAr : item.name}
              </div>
              {/* Sub-label */}
              <div className="text-[9px] text-gray-400 leading-tight mt-0.5">
                {ar ? item.subAr : item.sub}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
