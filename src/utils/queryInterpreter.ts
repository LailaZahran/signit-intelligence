import { Contract } from '@/types';

export interface InterpretedQuery {
  filter: (c: Contract) => boolean;
  label: string;
  labelAr: string;
}

const INTENTS: Array<{
  patterns: RegExp[];
  filter: (c: Contract) => boolean;
  label: string;
  labelAr: string;
}> = [
  // ── Renewal / deadline windows ────────────────────────────────────────────
  {
    patterns: [/renew.*(this quarter|q[1-4]|90|three month)|quarter.*renew/i],
    filter: (c) =>
      c.daysToNextCritical <= 90 &&
      c.signals.some((s) => s.label.toLowerCase().includes('renew')),
    label: 'Renewing this quarter (≤ 90 days)',
    labelAr: 'التجديد هذا الربع (≤ 90 يوم)',
  },
  {
    patterns: [/renew.*(this month|30|one month)|month.*renew/i],
    filter: (c) =>
      c.daysToNextCritical <= 30 &&
      c.signals.some((s) => s.label.toLowerCase().includes('renew')),
    label: 'Renewing this month (≤ 30 days)',
    labelAr: 'التجديد هذا الشهر (≤ 30 يوم)',
  },
  {
    patterns: [/renew|auto.?renew|renewal/i],
    filter: (c) =>
      c.signals.some((s) => s.label.toLowerCase().includes('renew')),
    label: 'Contracts with auto-renewal',
    labelAr: 'العقود ذات التجديد التلقائي',
  },

  // ── Urgency / deadlines ───────────────────────────────────────────────────
  {
    patterns: [/urgent|critical deadline|deadline.*(week|month|soon)|expir.*(week|month|soon)|soon/i],
    filter: (c) => c.daysToNextCritical <= 30,
    label: 'Critical deadlines within 30 days',
    labelAr: 'مواعيد نهائية حرجة خلال 30 يوماً',
  },
  {
    patterns: [/expir/i],
    filter: (c) => c.status === 'expiring',
    label: 'Expiring contracts',
    labelAr: 'العقود قاربت على الانتهاء',
  },

  // ── Risk level ────────────────────────────────────────────────────────────
  {
    patterns: [/critical risk|highest risk|most risk|riskiest/i],
    filter: (c) => c.riskLevel === 'critical',
    label: 'Critical risk contracts',
    labelAr: 'العقود ذات المخاطر الحرجة',
  },
  {
    patterns: [/high risk/i],
    filter: (c) => c.riskLevel === 'critical' || c.riskLevel === 'high',
    label: 'High & critical risk contracts',
    labelAr: 'العقود عالية المخاطر والحرجة',
  },
  {
    patterns: [/flagged/i],
    filter: (c) => c.status === 'flagged',
    label: 'Flagged contracts',
    labelAr: 'العقود المُعلَّمة',
  },

  // ── Liability ─────────────────────────────────────────────────────────────
  {
    patterns: [/no liability cap|missing liability|without.*cap|uncapped/i],
    filter: (c) =>
      c.riskFlags.some((f) => f.title.toLowerCase().includes('liab') && f.title.toLowerCase().includes('cap')),
    label: 'Contracts missing a liability cap',
    labelAr: 'عقود تفتقر إلى سقف المسؤولية',
  },
  {
    patterns: [/liabilit/i],
    filter: (c) =>
      c.riskFlags.some((f) => f.title.toLowerCase().includes('liab')),
    label: 'Contracts with liability risk flags',
    labelAr: 'عقود بها إشارات مخاطر المسؤولية',
  },

  // ── PDPL / data residency ─────────────────────────────────────────────────
  {
    patterns: [/pdpl|data residen|data privacy|data protection/i],
    filter: (c) =>
      c.signals.some(
        (s) =>
          s.label.toLowerCase().includes('pdpl') ||
          s.label.toLowerCase().includes('data residen')
      ) ||
      c.riskFlags.some((f) => f.title.toLowerCase().includes('pdpl') || f.title.toLowerCase().includes('data residen')),
    label: 'PDPL / data residency risk',
    labelAr: 'مخاطر نظام حماية البيانات / الإقامة',
  },

  // ── Contract type ─────────────────────────────────────────────────────────
  {
    patterns: [/employment|staff|employee|hr/i],
    filter: (c) => c.type === 'employment',
    label: 'Employment contracts',
    labelAr: 'عقود التوظيف',
  },
  {
    patterns: [/saas|software|subscription/i],
    filter: (c) => c.type === 'saas',
    label: 'SaaS subscriptions',
    labelAr: 'اشتراكات البرمجيات',
  },
  {
    patterns: [/vendor|supplier/i],
    filter: (c) => c.type === 'vendor',
    label: 'Vendor agreements',
    labelAr: 'اتفاقيات الموردين',
  },
  {
    patterns: [/nda|non.?disclosure|confidential/i],
    filter: (c) => c.type === 'nda',
    label: 'NDAs',
    labelAr: 'اتفاقيات عدم الإفصاح',
  },
  {
    patterns: [/lease|office|rent|property/i],
    filter: (c) => c.type === 'lease',
    label: 'Lease agreements',
    labelAr: 'عقود الإيجار',
  },
  {
    patterns: [/joint venture|jv|partnership/i],
    filter: (c) => c.type === 'jv',
    label: 'Joint ventures',
    labelAr: 'المشاريع المشتركة',
  },
  {
    patterns: [/cloud|infrastructure/i],
    filter: (c) => c.type === 'cloud',
    label: 'Cloud infrastructure',
    labelAr: 'البنية التحتية السحابية',
  },
  {
    patterns: [/legal|retainer|law firm/i],
    filter: (c) => c.type === 'legal',
    label: 'Legal retainers',
    labelAr: 'استئناف الخدمات القانونية',
  },
  {
    patterns: [/marketing|agency|brand/i],
    filter: (c) => c.type === 'marketing',
    label: 'Marketing agreements',
    labelAr: 'اتفاقيات التسويق',
  },

  // ── Status ────────────────────────────────────────────────────────────────
  {
    patterns: [/negotiat/i],
    filter: (c) => c.status === 'in_negotiation',
    label: 'In negotiation',
    labelAr: 'قيد التفاوض',
  },

  // ── Financial ─────────────────────────────────────────────────────────────
  {
    patterns: [/largest|biggest|most expensive|highest value|top value/i],
    filter: (c) => c.annualValueSAR >= 1_000_000,
    label: 'High-value contracts (≥ SAR 1M)',
    labelAr: 'العقود عالية القيمة (≥ مليون ريال)',
  },
  {
    patterns: [/break clause/i],
    filter: (c) =>
      c.riskFlags.some((f) => f.title.toLowerCase().includes('break')),
    label: 'Contracts with break clauses',
    labelAr: 'عقود تحتوي على شروط الإنهاء',
  },
  {
    patterns: [/non.?compete|noncompete/i],
    filter: (c) =>
      c.extractedFields.some((f) => f.label.toLowerCase().includes('non-compete')),
    label: 'Contracts with non-compete clauses',
    labelAr: 'عقود تحتوي على شروط عدم المنافسة',
  },
  {
    patterns: [/success fee|bonus.*fee/i],
    filter: (c) =>
      c.riskFlags.some((f) => f.title.toLowerCase().includes('success fee')),
    label: 'Contracts with success fee risk',
    labelAr: 'عقود بها مخاطر رسوم النجاح',
  },
  {
    patterns: [/ip|intellectual property|ownership/i],
    filter: (c) =>
      c.riskFlags.some((f) =>
        f.title.toLowerCase().includes('ip') || f.title.toLowerCase().includes('ownership')
      ),
    label: 'IP / ownership disputes',
    labelAr: 'نزاعات الملكية الفكرية',
  },
];

export function interpretQuery(query: string): InterpretedQuery | null {
  const q = query.trim();
  if (!q) return null;
  for (const intent of INTENTS) {
    if (intent.patterns.some((p) => p.test(q))) {
      return { filter: intent.filter, label: intent.label, labelAr: intent.labelAr };
    }
  }
  return null;
}
