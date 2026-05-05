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
    { label: 'Open contradictions',  value: '8',           sub: '3 critical · 4 high · 1 medium',        variant: 'warning' },
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
    { label: 'تعارضات مفتوحة',       value: '8',           sub: '3 حرجة · 4 عالية · 1 متوسطة',           variant: 'warning' },
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
    title: 'Data residency conflict — PDPL violation',
    titleAr: 'تعارض موقع البيانات — انتهاك PDPL',
    description: 'NexusCloud (US-East-1) and CloudCRM (UAE/Dubai) store Al-Madar operational data outside KSA while Bianat HR Software correctly stores data in-Kingdom — three vendors, three different residency standards, two of which breach PDPL.',
    descriptionAr: 'NexusCloud (أمريكا) وCloudCRM (الإمارات) يحكمان البيانات التشغيلية خارج المملكة بينما تتوافق بيانات المملكة مع PDPL — ثلاثة موردين وثلاثة معايير مختلفة.',
    contracts: ['c6', 'c3', 'c21'],
    contractLabels: ['NexusCloud: US-East-1', 'CloudCRM: UAE', 'Bianat: KSA ✓'],
  },
  {
    id: 'd2', severity: 'critical',
    title: 'Absent liability protection across legal and security vendors',
    titleAr: 'غياب حماية المسؤولية في العقود القانونية والأمنية',
    description: 'Al-Mizan has no liability cap, Al-Dara Security has no indemnity for breach incidents, and Al-Ra\'id Legal has uncapped court disbursements — three service contracts with unquantified downside exposure while all technology vendors define explicit ceilings.',
    descriptionAr: 'الميزان بلا سقف مسؤولية، الدرع للأمن بلا تعويض عن حوادث الاختراق، والرائد القانوني بمصروفات محاكم غير محدودة — ثلاثة عقود خدمات بتعرض مالي غير محدد.',
    contracts: ['c7', 'c19', 'c25'],
    contractLabels: ['Al-Mizan #7', 'Al-Dara Security #19', 'Al-Ra\'id Legal #25'],
  },
  {
    id: 'd3', severity: 'high',
    title: 'Non-compete asymmetry across all employment contracts',
    titleAr: 'عدم تماثل عدم المنافسة في جميع عقود التوظيف',
    description: 'Non-compete periods range from 12 months (Senior Director with narrowest data access) down to 6 months (VP Finance and Digital Head with the broadest financial and technology access) — four employees, no consistent risk-based framework.',
    descriptionAr: 'مدد عدم المنافسة تتراوح من 12 شهراً (المدير الأول) إلى 6 أشهر (نائب الرئيس المالي ورئيسة التحول الرقمي) — أربعة موظفين بلا إطار موحد قائم على المخاطر.',
    contracts: ['c4', 'c17', 'c10', 'c18'],
    contractLabels: ['Sr. Director: 12m', 'Ops Director: 9m', 'VP Finance: 6m', 'Digital Head: 6m'],
  },
  {
    id: 'd4', severity: 'high',
    title: 'Confidentiality survival gap — 5 contracts, 3 different periods',
    titleAr: 'فجوة بقاء السرية — 5 عقود و3 مدد مختلفة',
    description: 'Strategic information shared with legal and commercial advisors is protected for 5 years (NDA), 3 years (Al-Mizan and Al-Ra\'id Legal), and 2 years (AI NDA and Marketing Agency) — the most sensitive AI partnership data expires soonest.',
    descriptionAr: 'المعلومات الاستراتيجية محمية لمدد متباينة: 5 سنوات (السرية الرئيسية)، 3 سنوات (الميزان والرائد)، وسنتان (سرية الذكاء الاصطناعي والتسويق) — بيانات الذكاء الاصطناعي الأكثر حساسية تنتهي حمايتها أولاً.',
    contracts: ['c2', 'c7', 'c25', 'c23', 'c9'],
    contractLabels: ['NDA: 5y', 'Al-Mizan: 3y', 'Al-Ra\'id: 3y', 'AI NDA: 2y', 'Marketing: 2y'],
  },
  {
    id: 'd5', severity: 'high',
    title: 'Notice period disparity — 30 days to 180 days across portfolio',
    titleAr: 'تباين مهلة الإشعار — من 30 يوماً إلى 180 يوماً',
    description: 'Notice requirements span from 30 days (Catering and Marketing) to 180 days (JV Agreement) with no portfolio standard — the SAR 3.2M JV requires 6x longer notice than the SAR 540K catering contract, creating risk that shorter windows are missed first.',
    descriptionAr: 'مهل الإشعار تتراوح من 30 يوماً (التموين والتسويق) إلى 180 يوماً (المشروع المشترك) بلا معيار موحد — المشروع المشترك يتطلب 6 أضعاف مهلة عقد التموين.',
    contracts: ['c24', 'c8', 'c22', 'c3', 'c9', 'c16'],
    contractLabels: ['JV: 180d', 'Office Lease: 120d', 'Warehouse: 120d', 'CloudCRM: 90d', 'Marketing: 30d', 'Catering: 30d'],
  },
  {
    id: 'd6', severity: 'critical',
    title: 'No performance security on highest-value commitments',
    titleAr: 'غياب ضمان الأداء في أعلى الالتزامات قيمةً',
    description: 'The SAR 8.4M construction contract has no performance bond and the SAR 3.2M JV has no exit mechanism or capital protection — the two largest new commitments have the least contractual security while all smaller vendor contracts carry liability caps.',
    descriptionAr: 'عقد الإنشاء بـ 8.4 مليون ريال يفتقر لضمان الأداء والمشروع المشترك بـ 3.2 مليون ريال لا يتضمن آلية خروج — أكبر التزامين جديدين يحملان أدنى ضمانات تعاقدية.',
    contracts: ['c14', 'c24'],
    contractLabels: ['Construction SAR 8.4M #14', 'JV SAR 3.2M #24'],
  },
  {
    id: 'd7', severity: 'high',
    title: 'Uncapped disbursements and expenses across advisory contracts',
    titleAr: 'مصروفات غير محدودة في عقود الاستشارات',
    description: 'Al-Mashura Consulting (SAR 960K) has no expense cap, Al-Ra\'id Legal has uncapped court filing fees, and Al-Mizan has no liability ceiling — three advisory relationships where Al-Madar has no contractual ceiling on total spend beyond the base retainer.',
    descriptionAr: 'المشورة للاستشارات (960 ألف ريال) بلا سقف مصروفات، والرائد القانوني برسوم محاكم غير محدودة، والميزان بلا سقف مسؤولية — ثلاث علاقات استشارية بلا سقف إجمالي للإنفاق.',
    contracts: ['c20', 'c25', 'c7'],
    contractLabels: ['Al-Mashura #20', 'Al-Ra\'id #25', 'Al-Mizan #7'],
  },
  {
    id: 'd8', severity: 'medium',
    title: 'Exit mechanism inconsistency across long-term agreements',
    titleAr: 'تناقض آليات الخروج في الاتفاقيات طويلة الأمد',
    description: 'Both office and warehouse leases include a break clause at year 3, but the 5-year JV with Al-Sharq has no exit right whatsoever — Al-Madar applies exit protection inconsistently, with SAR 3.2M locked in the JV and SAR 1.44M/year locked in the warehouse with a closing break window.',
    descriptionAr: 'إيجارا المكتب والمستودع يتضمنان شرط إنهاء في السنة الثالثة، لكن المشروع المشترك لمدة 5 سنوات يفتقر لأي حق خروج — تطبيق غير متسق لحماية الخروج عبر الالتزامات طويلة الأمد.',
    contracts: ['c8', 'c22', 'c24'],
    contractLabels: ['Office Lease: break yr3', 'Warehouse: break yr3', 'JV: no exit right'],
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
