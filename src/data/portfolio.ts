import { Contradiction, RiskMatrixData, PersonaNarrative, MetricCardData } from '../types';

// ─── Narratives ──────────────────────────────────────────────────────────────

export const narratives: Record<string, PersonaNarrative> = {
  legal: {
    segments: [
      { type: 'text', content: 'Portfolio contains ' },
      { type: 'link', content: '2 critical contracts', route: '/contracts?filter=flagged', emphasis: 'critical' },
      { type: 'text', content: ' — NexusCloud and Al-Mizan — both flagged for missing or inadequate liability caps. The ' },
      { type: 'link', content: 'data residency conflict', route: '/contracts/c6', emphasis: 'critical' },
      { type: 'text', content: ' between NexusCloud (US-East-1) and CloudCRM (UAE/Dubai) creates a direct PDPL compliance gap. ' },
      { type: 'link', content: 'Al-Mizan Legal Retainer', route: '/contracts/c7' },
      { type: 'text', content: ' has an 18-month success fee tail that may have already captured the Gulf Logistics JV (SAR 147K exposure). Confidentiality survival is inconsistent across the portfolio: NDA is 5 years, Legal Retainer is 3, Marketing Agency is 2.' },
    ],
    delta: 'Since last week: +2 critical flags, 1 new contradiction (IP conflict in BrandWave vs. employment contract)',
    urgentAction: 'Review Al-Mizan success fee tail and Al-Nakheel break clause deadline before August 31.',
  },
  procurement: {
    segments: [
      { type: 'text', content: '3 contracts renewing this quarter totalling SAR 892K: ' },
      { type: 'link', content: 'CloudCRM in 47 days', route: '/contracts/c3', emphasis: 'critical' },
      { type: 'text', content: ', ' },
      { type: 'link', content: 'BrandWave in 30 days', route: '/contracts/c9', emphasis: 'critical' },
      { type: 'text', content: ', and the ' },
      { type: 'link', content: 'Office Lease break clause', route: '/contracts/c8', emphasis: 'warning' },
      { type: 'text', content: ' in 119 days — 120-day notice means decision needed within 1 day. CloudCRM has 21% seat underutilization (118 of 150 seats active) — strong negotiation leverage exists before the window closes.' },
    ],
    delta: 'CloudCRM deadline moved from 60 days to 47 days since last briefing. BrandWave added to urgent queue.',
    urgentAction: 'Initiate CloudCRM renewal negotiation this week. Decide on Office Lease break clause by end of day.',
  },
  cfo: {
    segments: [
      { type: 'text', content: 'Total portfolio annual obligations: ' },
      { type: 'link', content: 'SAR 8.4M+', route: '/portfolio', emphasis: 'critical' },
      { type: 'text', content: '. The ' },
      { type: 'link', content: 'Office Lease', route: '/contracts/c8' },
      { type: 'text', content: ' alone is SAR 3.6M (43% of total). ' },
      { type: 'link', content: 'Al-Mizan Legal Retainer', route: '/contracts/c7' },
      { type: 'text', content: ' has no liability cap and an uncapped success fee tail (~SAR 147K for Gulf Logistics JV). Sara Al-Otaibi\'s phantom equity creates a ' },
      { type: 'link', content: 'SAR 18.75M unfunded contingent obligation', route: '/contracts/c10', emphasis: 'warning' },
      { type: 'text', content: ' — not reserved on the balance sheet.' },
    ],
    delta: '+1 overdue commitment. 2 contracts require board-level disclosure at today\'s meeting.',
    urgentAction: 'Confirm Al-Mizan JV success fee status. Establish phantom equity reserve policy before IPO planning.',
  },
};

export const narrativesAr: Record<string, PersonaNarrative> = {
  legal: {
    segments: [
      { type: 'text', content: 'المحفظة تحتوي على ' },
      { type: 'link', content: 'عقدين بمخاطر حرجة', route: '/contracts?filter=flagged', emphasis: 'critical' },
      { type: 'text', content: ' — NexusCloud والميزان — كلاهما مُعلَّم لغياب سقف المسؤولية أو عدم كفايته. ' },
      { type: 'link', content: 'تعارض موقع البيانات', route: '/contracts/c6', emphasis: 'critical' },
      { type: 'text', content: ' بين NexusCloud (US-East-1) وCloudCRM (الإمارات/دبي) يُفرز فجوة امتثال مباشرة لنظام PDPL. ' },
      { type: 'link', content: 'استئناف الميزان القانوني', route: '/contracts/c7' },
      { type: 'text', content: ' يتضمن ذيل رسم نجاح لمدة 18 شهراً قد التقط مشروع الخليج المشترك (تعرّض 147 ألف ريال). بقاء السرية متناقض: الاتفاقية 5 سنوات، الاستئناف 3 سنوات، وكالة التسويق سنتان.' },
    ],
    delta: 'منذ الأسبوع الماضي: +2 علامة حرجة، تعارض جديد (ملكية فكرية في BrandWave مقابل عقد العمل)',
    urgentAction: 'راجع ذيل رسم نجاح الميزان وموعد شرط إنهاء النخيل قبل 31 أغسطس.',
  },
  procurement: {
    segments: [
      { type: 'text', content: '3 عقود تتجدد هذا الربع بإجمالي 892 ألف ريال: ' },
      { type: 'link', content: 'CloudCRM خلال 47 يوماً', route: '/contracts/c3', emphasis: 'critical' },
      { type: 'text', content: '، و' },
      { type: 'link', content: 'BrandWave خلال 30 يوماً', route: '/contracts/c9', emphasis: 'critical' },
      { type: 'text', content: '، و' },
      { type: 'link', content: 'شرط إنهاء إيجار المكتب', route: '/contracts/c8', emphasis: 'warning' },
      { type: 'text', content: ' خلال 119 يوماً — مهلة الإشعار 120 يوماً تعني الحاجة للقرار خلال يوم واحد. CloudCRM به 21% من المقاعد غير مستغلة (118 من 150 مقعداً نشطاً) — نفوذ تفاوضي قوي قبل إغلاق النافذة.' },
    ],
    delta: 'موعد CloudCRM انتقل من 60 يوماً إلى 47 يوماً منذ آخر إحاطة. أُضيف BrandWave لقائمة العاجل.',
    urgentAction: 'ابدأ تفاوض تجديد CloudCRM هذا الأسبوع. قرر بشأن شرط إنهاء إيجار المكتب اليوم.',
  },
  cfo: {
    segments: [
      { type: 'text', content: 'إجمالي الالتزامات السنوية للمحفظة: ' },
      { type: 'link', content: '+8.4 مليون ريال', route: '/portfolio', emphasis: 'critical' },
      { type: 'text', content: '. ' },
      { type: 'link', content: 'إيجار المكتب', route: '/contracts/c8' },
      { type: 'text', content: ' وحده 3.6 مليون ريال (43% من الإجمالي). ' },
      { type: 'link', content: 'استئناف الميزان القانوني', route: '/contracts/c7' },
      { type: 'text', content: ' بلا سقف للمسؤولية وذيل رسم نجاح غير محدود (~147 ألف ريال لمشروع الخليج). أسهم سارة الطيبة الوهمية تُفرز ' },
      { type: 'link', content: 'التزاماً طارئاً غير ممول بقيمة 18.75 مليون ريال', route: '/contracts/c10', emphasis: 'warning' },
      { type: 'text', content: ' — غير مدرج في الميزانية.' },
    ],
    delta: '+1 التزام متأخر. عقدان يتطلبان إفصاحاً على مستوى مجلس الإدارة في اجتماع اليوم.',
    urgentAction: 'تأكد من حالة رسم نجاح مشروع الميزان. أرسِ سياسة احتياطي الأسهم الوهمية قبل تخطيط الطرح العام.',
  },
};

// ─── Metrics ─────────────────────────────────────────────────────────────────

export const metrics: Record<string, MetricCardData[]> = {
  legal: [
    { label: 'Total contracts',      value: '25',          sub: '8 vendor · 4 employment · 3 legal', variant: 'default' },
    { label: 'Critical risk',        value: '2',           sub: 'NexusCloud · Al-Mizan',                  variant: 'critical' },
    { label: 'Open contradictions',  value: '5',           sub: '2 critical · 2 high · 1 medium',        variant: 'warning' },
    { label: 'Liability uncapped',   value: '2',           sub: 'Al-Mizan · Al-Nakheel (property)',       variant: 'critical' },
  ],
  procurement: [
    { label: 'Renewing this quarter', value: '8',          sub: 'Inc. construction, JV, catering, logistics', variant: 'warning' },
    { label: 'Urgent (<60d)',         value: '10',         sub: 'Al-Mashura 14d · Construction 18d · Transport 22d', variant: 'critical' },
    { label: 'Break clause decision', value: '1 day',      sub: 'Office Lease — Act now',                 variant: 'critical' },
    { label: 'Total Q3 renewals',     value: 'SAR 892K',   sub: 'Across 3 renewing contracts',            variant: 'default' },
  ],
  cfo: [
    { label: 'Total annual obligations', value: 'SAR 26M+', sub: '25 active contracts',                   variant: 'default' },
    { label: 'Largest commitment',       value: 'SAR 3.6M', sub: 'Office Lease (43% of portfolio)',        variant: 'warning' },
    { label: 'Phantom equity exposure',  value: 'SAR 18.75M', sub: 'VP Finance — unfunded',               variant: 'critical' },
    { label: 'Uncapped contracts',       value: '2',          sub: 'Al-Mizan · Al-Nakheel property',      variant: 'critical' },
  ],
};

export const metricsAr: Record<string, MetricCardData[]> = {
  legal: [
    { label: 'إجمالي العقود',        value: '25',          sub: '8 موردون · 4 عمالة · 3 قانونية',         variant: 'default' },
    { label: 'مخاطر حرجة',           value: '2',           sub: 'NexusCloud · الميزان',                   variant: 'critical' },
    { label: 'تعارضات مفتوحة',       value: '5',           sub: '2 حرجة · 2 عالية · 1 متوسطة',           variant: 'warning' },
    { label: 'مسؤولية غير محددة',    value: '2',           sub: 'الميزان · النخيل (العقارات)',            variant: 'critical' },
  ],
  procurement: [
    { label: 'تتجدد هذا الربع',       value: '8',           sub: 'إنشاءات، JV، تموين، لوجستيات وأخرى',   variant: 'warning' },
    { label: 'عاجل (<60 يوم)',        value: '10',          sub: 'المشورة 14ي · الإنشاء 18ي · الخليج 22ي', variant: 'critical' },
    { label: 'قرار شرط الإنهاء',     value: 'يوم واحد',    sub: 'إيجار المكتب — تصرف الآن',              variant: 'critical' },
    { label: 'إجمالي تجديدات ق3',    value: 'SAR 892K',    sub: 'عبر 3 عقود متجددة',                     variant: 'default' },
  ],
  cfo: [
    { label: 'إجمالي الالتزامات السنوية', value: 'SAR 26M+',  sub: '25 عقداً نشطاً',                  variant: 'default' },
    { label: 'أكبر التزام',               value: 'SAR 3.6M',   sub: 'إيجار المكتب (43% من المحفظة)',   variant: 'warning' },
    { label: 'تعرض الأسهم الوهمية',       value: 'SAR 18.75M', sub: 'نائب الرئيس المالي — غير ممول', variant: 'critical' },
    { label: 'عقود غير محددة الحد',       value: '2',          sub: 'الميزان · النخيل العقارية',       variant: 'critical' },
  ],
};

// ─── Financial exposure ───────────────────────────────────────────────────────

export const financialExposure = [
  { name: 'Office Lease (Al-Nakheel)',  value: 3605250, display: 'SAR 3,605,250', contractId: 'c8', pct: 100 },
  { name: 'CloudCRM (USD 198K)',        value: 744288,  display: 'SAR 744,288',   contractId: 'c3', pct: 21 },
  { name: 'Sara Al-Otaibi (VP Fin.)',   value: 697200,  display: 'SAR 697,200',   contractId: 'c10', pct: 19 },
  { name: 'BrandWave Marketing',        value: 504000,  display: 'SAR 504,000',   contractId: 'c9', pct: 14 },
  { name: 'TechSolutions Vendor',       value: 582000,  display: 'SAR 582,000',   contractId: 'c1', pct: 16 },
  { name: 'Al-Mizan Legal Retainer',   value: 420000,  display: 'SAR 420,000',   contractId: 'c7', pct: 12 },
];

// ─── Renewal pipeline ─────────────────────────────────────────────────────────

export const renewalPipeline = [
  { name: 'Al-Mashura Consulting (sign)', nameAr: 'المشورة للاستشارات (توقيع)', days: 14,  notice: 90,  value: 'SAR 960K',  contractId: 'c20', pct: 100 },
  { name: 'Construction Milestone 3',     nameAr: 'الإعمار — الدفعة الثالثة',  days: 18,  notice: 90,  value: 'SAR 2.1M',  contractId: 'c14', pct: 98  },
  { name: 'Gulf Transport (dispute)',      nameAr: 'الخليج للنقل (نزاع)',        days: 22,  notice: 45,  value: 'SAR 756K',  contractId: 'c13', pct: 96  },
  { name: 'Al-Sharq JV (sign)',           nameAr: 'الشرق اللوجستي (JV)',        days: 28,  notice: 180, value: 'SAR 3.2M',  contractId: 'c24', pct: 92  },
  { name: 'BrandWave',                    nameAr: 'BrandWave',                  days: 30,  notice: 30,  value: 'SAR 504K',  contractId: 'c9',  pct: 90  },
  { name: 'Zad Catering',                 nameAr: 'زاد للتموين',                days: 33,  notice: 30,  value: 'SAR 540K',  contractId: 'c16', pct: 86  },
  { name: 'Warehouse (break clause)',      nameAr: 'المستودع (شرط الإنهاء)',    days: 38,  notice: 120, value: 'SAR 1.44M', contractId: 'c22', pct: 82  },
  { name: 'Riyadh Maintenance',           nameAr: 'الرياض للصيانة',            days: 45,  notice: 60,  value: 'SAR 420K',  contractId: 'c11', pct: 76  },
  { name: 'CloudCRM',                     nameAr: 'CloudCRM',                   days: 47,  notice: 90,  value: 'USD 198K',  contractId: 'c3',  pct: 74  },
  { name: 'Al-Maliki Probation',          nameAr: 'المالكي — نهاية التجربة',   days: 55,  notice: 60,  value: 'SAR 528K',  contractId: 'c17', pct: 68  },
];

// ─── Contradictions ───────────────────────────────────────────────────────────

export const contradictions: Contradiction[] = [
  {
    id: 'd1', severity: 'critical',
    title: 'Data residency conflict',
    titleAr: 'تعارض موقع البيانات',
    description: 'NexusCloud (US-East-1) and CloudCRM (UAE/Dubai) both govern Al-Madar operational data — a direct PDPL compliance conflict.',
    descriptionAr: 'NexusCloud (US-East-1) وCloudCRM (الإمارات/دبي) يحكمان البيانات التشغيلية ذاتها — تعارض مباشر مع PDPL.',
    contracts: ['c6', 'c3'],
    contractLabels: ['NexusCloud #6', 'CloudCRM #3'],
  },
  {
    id: 'd2', severity: 'critical',
    title: 'Absent liability cap — Legal Retainer',
    titleAr: 'غياب سقف المسؤولية — الاستئناف القانوني',
    description: 'Al-Mizan Legal Retainer has no liability cap while every other vendor contract defines an explicit ceiling — leaving downside exposure unquantified.',
    descriptionAr: 'استئناف الميزان القانوني لا يتضمن سقفاً للمسؤولية بينما تحدد جميع عقود الموردين الأخرى سقفاً صريحاً — مما يُفرز تعرضاً غير محدود.',
    contracts: ['c7'],
    contractLabels: ['Al-Mizan #7', 'vs. all others'],
  },
  {
    id: 'd3', severity: 'high',
    title: 'Non-compete asymmetry',
    titleAr: 'عدم تماثل عدم المنافسة',
    description: 'VP Finance has a 6-month non-compete vs. Senior Director\'s 12 months — the more senior role with broader financial access receives weaker post-employment protection.',
    descriptionAr: 'نائب الرئيس المالي ملزم بـ 6 أشهر عدم منافسة مقابل 12 شهراً للمدير الأول — المنصب الأعلى ذو الوصول الأوسع يحظى بحماية أضعف.',
    contracts: ['c10', 'c4'],
    contractLabels: ['VP Finance #10', 'Sr. Director #4'],
  },
  {
    id: 'd4', severity: 'high',
    title: 'Confidentiality survival gap',
    titleAr: 'فجوة بقاء السرية',
    description: 'The same category of strategic information is protected for 5 years (NDA), 3 years (Legal Retainer), and 2 years (Marketing Agency) — three inconsistent survival periods.',
    descriptionAr: 'نفس فئة المعلومات الاستراتيجية تحظى بحماية لمدد متناقضة: 5 سنوات (اتفاقية السرية)، 3 سنوات (الاستئناف القانوني)، وسنتان (وكالة التسويق).',
    contracts: ['c2', 'c7', 'c9'],
    contractLabels: ['NDA #2', 'Legal Retainer #7', 'Marketing #9'],
  },
  {
    id: 'd5', severity: 'high',
    title: 'Auto-renewal notice disparity',
    titleAr: 'تباين مهلة التجديد التلقائي',
    description: 'Notice windows range from 30 days (Marketing) to 120 days (Office Lease) with no consistent portfolio standard, making shorter windows the highest risk of being missed.',
    descriptionAr: 'مهل الإشعار تتراوح بين 30 يوماً (التسويق) و120 يوماً (إيجار المكتب) بلا معيار موحد للمحفظة، مما يجعل المهل الأقصر الأكثر عرضة للفوات.',
    contracts: ['c9', 'c3', 'c6', 'c8'],
    contractLabels: ['Marketing: 30d', 'CloudCRM: 90d', 'NexusCloud: 60d', 'Lease: 120d'],
  },
] as any[];

// ─── Risk matrix ──────────────────────────────────────────────────────────────

export const riskMatrix: RiskMatrixData = {
  vendors: ['NexusCloud', 'CloudCRM', 'Al-Nakheel', 'Al-Mizan', 'BrandWave'],
  riskTypes: ['Liability', 'Data', 'Renewal', 'Terms'],
  cells: [
    ['critical', 'critical', 'high',   'medium'],
    ['medium',   'high',     'high',   'low'],
    ['critical', 'none',     'critical', 'medium'],
    ['critical', 'none',     'medium', 'high'],
    ['high',     'none',     'high',   'medium'],
  ] as any,
  contractIds: [
    ['c6', 'c6', 'c6', 'c6'],
    ['c3', 'c3', 'c3', 'c3'],
    ['c8', 'c8', 'c8', 'c8'],
    ['c7', 'c7', 'c7', 'c7'],
    ['c9', 'c9', 'c9', 'c9'],
  ],
};
