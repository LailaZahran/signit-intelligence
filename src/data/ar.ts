import { PersonaId } from '../types';

export interface ArBriefingLine {
  text: string;
  delta?: string;
}

export interface ArPersona {
  role: string;
  briefingLines: ArBriefingLine[];
  bubbleLabels: string[];
  cmdPlaceholder: string;
  footerNote: string;
  footerStat: string;
}

export const AR_PERSONAS: Record<PersonaId, ArPersona> = {
  legal: {
    role: 'المستشار القانوني',
    briefingLines: [
      { text: 'تم اكتشاف ٥ تعارضات بين العقود — ٢ منها بمستوى حرج', delta: '+٢ جديد' },
      { text: 'حد مسؤولية NexusCloud بـ ٥٠ ألف دولار أقل من الإنفاق السنوي البالغ ١٠٤ ألف دولار' },
      { text: 'ملكية IP المشتركة مع BrandWave تتعارض مع عقد توظيف المدير الأول', delta: 'جديد' },
    ],
    bubbleLabels: ['التعارضات', 'فجوات المسؤولية', 'مخاطر PDPL', 'مقارنة البنود', 'تصدير التقرير', 'تعليم العقد'],
    cmdPlaceholder: 'اسأل أي شيء — مثال: "ما هي العقود التي تحتوي على حد مسؤولية أقل من ٢٠٠ ألف ريال؟"',
    footerNote: 'مستخرج بالذكاء الاصطناعي — راجع البنود المُعلَّمة قبل الاعتماد عليها',
    footerStat: '٣ حرج · ٥ عالي · ٢ متوسط',
  },
  procurement: {
    role: 'مدير المشتريات',
    briefingLines: [
      { text: 'تجديد BrandWave تلقائياً خلال ٣٠ يوماً — التزام بـ ٢٥٢ ألف ريال إذا فات الموعد', delta: 'الأكثر إلحاحاً' },
      { text: 'نافذة فسخ عقد المكتب: ١١٩ يوماً — مخاطرة بـ ١٨ مليون ريال+ إذا فات الموعد', delta: 'كانت ١٨٠ي' },
      { text: 'CloudCRM: استخدام أقل بنسبة ٢١٪ — ورقة ضغط قبل موعد ١ أبريل' },
    ],
    bubbleLabels: ['التجديدات القادمة', 'المواعيد العاجلة', 'بنود الفسخ', 'مقارنة الشروط', 'رفع عقد', 'تصدير التقرير'],
    cmdPlaceholder: 'اسأل أي شيء — مثال: "ما هي العقود التي تجدد خلال ٩٠ يوماً؟"',
    footerNote: 'المواعيد مستخرجة بالذكاء الاصطناعي — تحقق من النسخ الأصلية الموقّعة',
    footerStat: '٤ تجديدات · ٤٧ يوماً للموعد الأقرب',
  },
  cfo: {
    role: 'المدير المالي / المدير التنفيذي',
    briefingLines: [
      { text: 'تم تحديد ٧٤٢ ألف ريال من التكاليف الخفية فوق قيم العقود الرئيسية', delta: 'تحليل جديد' },
      { text: 'رسوم نجاح المِيزان: ~١٤٧ ألف ريال محتملة — مخاطر صفقة المشروع المشترك', delta: 'جديد' },
      { text: '٨٣٥ ألف ريال من المسؤولية المحدودة في ٣ عقود أدنى من سقف ٢٠٠ ألف ريال' },
    ],
    bubbleLabels: ['الانكشاف المالي', 'تقرير مجلس الإدارة', 'التكاليف الخفية', 'فجوات المسؤولية', 'رفع عقد', 'مقارنة الشروط'],
    cmdPlaceholder: 'اسأل أي شيء — مثال: "ما إجمالي مخاطر المسؤولية في جميع العقود النشطة؟"',
    footerNote: 'القيم بالريال السعودي · الدولار محوّل بسعر ٣.٧٥ · محسوب بالذكاء الاصطناعي',
    footerStat: '٨.٤ مليون ريال التزامات · ٧٤٢ ألف ريال تكاليف خفية',
  },
};

export const AR_UI = {
  beta: 'تجريبي',
  briefLabel: 'الملخص الذكي',
  timelineLabel: 'المواعيد الحرجة القادمة',
  greetingMorning: 'صباح الخير',
  greetingAfternoon: 'مساء الخير',
  greetingEvening: 'مساء الخير',
  cmdKbd: '⌘K',
  langToggle: 'EN',
  navContracts: 'العقود',
  navPortfolio: 'المحفظة',
  navUpload: 'رفع',
  switchPersona: 'تبديل الشخصية',
};

export const EN_UI = {
  beta: 'BETA',
  briefLabel: 'Intelligence brief',
  timelineLabel: 'Upcoming critical dates',
  greetingMorning: 'Good morning',
  greetingAfternoon: 'Good afternoon',
  greetingEvening: 'Good evening',
  cmdKbd: '⌘K',
  langToggle: 'عربي',
  navContracts: 'Contracts',
  navPortfolio: 'Portfolio',
  navUpload: 'Upload',
  switchPersona: 'Switch Persona',
};
