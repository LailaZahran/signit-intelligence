import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { toast } from '@/hooks/use-toast';
import { ChromeBar } from '@/components/layout/ChromeBar';
import { PersonaLensToggle } from '@/components/contracts/PersonaLensToggle';
import { SignalStrip } from '@/components/contracts/SignalStrip';
import { CompareModal } from '@/components/contracts/CompareModal';
import { contracts } from '@/data/contracts';
import { usePersona } from '@/context/PersonaContext';
import { useLanguage } from '@/context/LanguageContext';
import { PersonaId } from '@/types';
import {
  ChevronRight,
  Flag,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  Pencil,
  Clock,
  Columns2,
  ShieldCheck,
  CornerUpLeft,
} from 'lucide-react';

// ─── Arabic label lookup ────────────────────────────────────────────────────

const FIELD_LABEL_AR: Record<string, string> = {
  'Monthly retainer':           'الراتب الشهري الثابت',
  'Annual value':               'القيمة السنوية',
  'Annual value (Year 1)':      'القيمة السنوية (السنة 1)',
  'Annual fee (Year 2)':        'الرسوم السنوية (السنة 2)',
  'Monthly estimate':           'التكلفة الشهرية التقديرية',
  'Annual CTC':                 'الراتب السنوي الإجمالي',
  'Annual bonus (max)':         'المكافأة السنوية (الحد الأقصى)',
  'Annual auto-escalation':     'التصاعد السنوي التلقائي',
  'Excess hours rate':          'سعر الساعات الإضافية',
  'Annual rent (Y3+)':          'الإيجار السنوي (س3+)',
  'Base rent':                  'الإيجار الأساسي',
  'Liability cap':              'سقف المسؤولية',
  'Tenant liability':           'مسؤولية المستأجر',
  'Breach liability cap':       'سقف مسؤولية الخرق',
  'Auto-renewal':               'التجديد التلقائي',
  'Auto-renewal notice':        'إشعار التجديد التلقائي',
  'Non-renewal deadline':       'موعد عدم التجديد',
  'Non-renewal notice':         'إشعار عدم التجديد',
  'Early termination fee':      'رسوم الإنهاء المبكر',
  'Early exit penalty':         'غرامة الخروج المبكر',
  'Kill fee':                   'رسوم الإلغاء',
  'Notice period':              'فترة الإشعار',
  'Notice required':            'الإشعار المطلوب',
  'Termination notice':         'إشعار الإنهاء',
  'Break clause':               'شرط الإنهاء',
  'Lease term':                 'مدة الإيجار',
  'Agreement term':             'مدة الاتفاقية',
  'Data residency':             'موقع البيانات',
  'Governing law':              'القانون الحاكم',
  'Confidentiality':            'السرية',
  'Confidentiality survival':   'بقاء السرية',
  'Trade secret protection':    'حماية الأسرار التجارية',
  'Position':                   'المنصب',
  'Contract type':              'نوع العقد',
  'Non-compete':                'عدم المنافسة',
  'Non-compete (post-term)':    'عدم المنافسة (ما بعد العقد)',
  'End-of-service gratuity':    'مكافأة نهاية الخدمة',
  'Phantom equity':             'الأسهم الوهمية',
  'Phantom equity trigger':     'شرط تفعيل الأسهم الوهمية',
  'Phantom equity cap':         'سقف الأسهم الوهمية',
  'Licensed users':             'المستخدمون المرخصون',
  'Active users (est.)':        'المستخدمون النشطون (تقديري)',
  'Price escalation':           'تصاعد الأسعار',
  'Price adjustment cap':       'حد تعديل السعر',
  'Suspension trigger':         'شرط التعليق',
  'Reserved instance penalty':  'غرامة الحجز المسبق',
  'Customer misconfiguration':  'الإعداد الخاطئ للعميل',
  'Success fee':                'رسوم النجاح',
  'Success fee tail':           'ذيل رسوم النجاح',
  'JV success fee exposure':    'تعرض رسوم نجاح المشروع',
  'Al-Madar ownership':         'حصة المدار',
  'Total JV capital':           'إجمالي رأس مال المشروع',
  'Al-Madar contribution':      'مساهمة المدار',
  'Capital call window':        'نافذة طلب رأس المال',
  'Dilution penalty':           'غرامة التخفيف',
  'Leased area':                'المساحة المؤجرة',
  'Rent escalation Y3':         'زيادة الإيجار (س3)',
  'HVAC obligation (Y2+)':      'التزام التكييف (س2+)',
  'Service charges':            'رسوم الخدمة',
  'Rent review':                'مراجعة الإيجار',
  'Deposit':                    'التأمين',
  'IP ownership':               'ملكية الملكية الفكرية',
  'Agency portfolio right':     'حق عرض أعمال الوكالة',
  'Paid media fee':             'رسوم الإعلانات المدفوعة',
  'Agreement type':             'نوع الاتفاقية',
  'Purpose':                    'الغرض',
  'Uptime SLA':                 'اتفاقية مستوى الخدمة',
};

const CRITICAL_DATE_LABEL_AR: Record<string, string> = {
  'Non-renewal notice deadline':                        'موعد إشعار عدم التجديد',
  'Non-renewal notice deadline (60 days)':              'موعد إشعار عدم التجديد (60 يوماً)',
  'Non-renewal notice deadline (30 days)':              'موعد إشعار عدم التجديد (30 يوماً)',
  'Agreement expiry':                                   'انتهاء الاتفاقية',
  'Contract renewal decision point':                    'نقطة قرار تجديد العقد',
  'First fiscal year-end — dividend distribution decision': 'نهاية السنة المالية الأولى — قرار توزيع الأرباح',
  'Annual renewal decision':                            'قرار التجديد السنوي',
  'Break clause notice deadline':                       'موعد إشعار شرط الإنهاء',
  'Annual KPI review and bonus determination':          'مراجعة KPI السنوية وتحديد المكافأة',
  'Renewal notice deadline':                            'الموعد النهائي لإشعار التجديد',
  'Policy renewal':                                     'تجديد الوثيقة',
  'Dispute resolution deadline':                        'الموعد النهائي لتسوية النزاع',
  'Milestone 3 payment trigger':                        'شرط سداد الدفعة الثالثة',
  'Contract expiry':                                    'انتهاء العقد',
  'Probation completion — confirmation required':       'انتهاء فترة التجربة — مطلوب تأكيد',
  'Annual performance review':                          'مراجعة الأداء السنوية',
  'Contract renewal':                                   'تجديد العقد',
  'Contract signing deadline':                          'الموعد النهائي لتوقيع العقد',
  'Break clause exercise deadline':                     'الموعد النهائي لاستخدام شرط الإنهاء',
  'NDA expiry':                                         'انتهاء اتفاقية السرية',
  'JV agreement signing deadline':                      'الموعد النهائي لتوقيع اتفاقية المشروع المشترك',
  'Retainer renewal review':                            'مراجعة تجديد الاستئناف',
};

// ─── Confidence bar ────────────────────────────────────────────────────────
function ConfBar({ value }: { value: number }) {
  const color = value >= 90 ? '#6366F1' : value >= 70 ? '#B45309' : '#B91C1C';
  return (
    <div className="flex items-center gap-1">
      <div className="flex-1 h-0.5 rounded-full bg-gray-200 overflow-hidden" style={{ minWidth: 32 }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[9px] font-medium flex-shrink-0" style={{ color }}>{value}%</span>
    </div>
  );
}

// ─── Accordion section (controlled) ────────────────────────────────────────
function StorySection({
  section,
  onViewSource,
  isOpen,
  onToggle,
  isPulsed,
}: {
  section: { id: string; title: string; content: string; confidence: number; sourceClause: string; titleAr?: string; contentAr?: string };
  onViewSource: (id: string) => void;
  isOpen: boolean;
  onToggle: (id: string) => void;
  isPulsed: boolean;
}) {
  const { ar } = useLanguage();
  const isLow = section.confidence < 70;
  const isWarn = section.confidence >= 70 && section.confidence < 90;
  const confColor = section.confidence >= 90 ? '#6366F1' : section.confidence >= 70 ? '#B45309' : '#B91C1C';

  return (
    <div
      className={`rounded-xl border transition-all duration-300 ${
        isPulsed
          ? 'border-[var(--brand-indigo)] shadow-md ring-2 ring-[var(--brand-indigo-pale)]'
          : isOpen
          ? 'border-[var(--brand-indigo)] shadow-sm'
          : 'border-gray-200'
      }`}
      data-testid={`story-section-${section.id}`}
    >
      <button
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-start"
        onClick={() => onToggle(section.id)}
      >
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[var(--brand-navy)] truncate" dir={ar && section.titleAr ? 'rtl' : 'ltr'}>{ar && section.titleAr ? section.titleAr : section.title}</span>
          {isLow && (
            <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600">
              {ar ? 'ثقة منخفضة' : 'Low confidence'}
            </span>
          )}
          {isWarn && <AlertTriangle size={12} className="flex-shrink-0 text-amber-500" />}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-gray-400 font-mono" dir="ltr">{section.sourceClause}</span>
          <div className="flex items-center gap-1">
            <div className="w-8 h-0.5 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${section.confidence}%`, background: confColor }} />
            </div>
            <span className="text-[9px]" style={{ color: confColor }}>{section.confidence}%</span>
          </div>
          {isOpen ? <ChevronUp size={13} className="text-gray-400" /> : <ChevronDown size={13} className="text-gray-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100">
          {isLow && (
            <div className="mb-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-blue-50 border-l-2 border-[var(--brand-indigo)]">
              <Info size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-indigo)' }} />
              <p className="text-[11px] text-blue-700 leading-relaxed">
                {ar ? 'ثقة منخفضة — يُنصح بالمراجعة اليدوية.' : 'Low confidence — manual review recommended.'}
              </p>
            </div>
          )}
          <p className="text-[12px] leading-relaxed text-gray-700 mb-3 mt-3" dir={ar && section.contentAr ? 'rtl' : 'ltr'}>{ar && section.contentAr ? section.contentAr : section.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <button className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">
                {ar ? 'الاستخراج خاطئ؟' : 'Extraction wrong?'}
              </button>
              <button className="text-[10px] text-gray-400 hover:text-amber-500 transition-colors">
                {ar ? 'الإبلاغ عن غموض' : 'Flag ambiguity'}
              </button>
            </div>
            <button
              onClick={() => onViewSource(section.id)}
              className="text-[11px] font-semibold flex items-center gap-1 hover:underline transition-colors"
              style={{ color: 'var(--brand-indigo)' }}
              data-testid={`view-source-${section.id}`}
            >
              {ar ? 'عرض المصدر' : 'view source'} <ExternalLink size={10} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Source document block ─────────────────────────────────────────────────
function SourceBlock({
  section,
  isHighlighted,
  id,
  onGoToStory,
}: {
  section: { id: string; title: string; content: string; confidence: number; sourceClause: string };
  isHighlighted: boolean;
  id: string;
  onGoToStory: (id: string) => void;
}) {
  const { ar } = useLanguage();
  const isLow = section.confidence < 70;
  const confColor = section.confidence >= 90 ? '#6366F1' : section.confidence >= 70 ? '#B45309' : '#B91C1C';
  return (
    <div
      id={`source-${id}`}
      className={`rounded-xl border px-4 py-3 transition-all duration-500 ${
        isHighlighted
          ? 'border-[var(--brand-indigo)] shadow-md ring-2 ring-[var(--brand-indigo-pale)] bg-white'
          : 'border-gray-200 bg-white'
      }`}
      data-testid={`source-block-${id}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5" dir="ltr">{section.sourceClause}</p>
          <p className="text-[12px] font-semibold text-[var(--brand-navy)]" dir="ltr">{section.title}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="w-8 h-0.5 rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${section.confidence}%`, background: confColor }} />
          </div>
          <span className="text-[9px]" style={{ color: confColor }}>{section.confidence}%</span>
        </div>
      </div>
      <p className="text-[11px] leading-relaxed text-gray-600" dir="ltr">{section.content}</p>
      {isLow && (
        <p className="text-[10px] text-gray-400 mt-2 italic">
          {ar ? 'غير مكتشف — قد يوجد ضمنياً.' : 'Not detected — may exist implicitly.'}
        </p>
      )}

      {/* Back-link to story panel */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <button className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">
            {ar ? 'الاستخراج خاطئ؟' : 'Extraction wrong?'}
          </button>
          <button className="text-[10px] text-gray-400 hover:text-amber-500 transition-colors">
            {ar ? 'الإبلاغ عن غموض' : 'Flag ambiguity'}
          </button>
        </div>
        <button
          onClick={() => onGoToStory(id)}
          className="flex items-center gap-1 text-[10px] font-semibold transition-colors hover:underline"
          style={{ color: 'var(--brand-indigo)', opacity: isHighlighted ? 1 : 0.65 }}
          title={ar ? 'الانتقال إلى القصة' : 'Go to story'}
        >
          <CornerUpLeft size={10} />
          {isHighlighted
            ? (ar ? 'مشار إليه من القصة' : 'Referenced from story')
            : (ar ? 'عرض في القصة' : 'view in story')}
        </button>
      </div>
    </div>
  );
}

// ─── Constants ─────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  saas: 'SaaS', vendor: 'Vendor', nda: 'NDA', employment: 'Employment',
  lease: 'Lease', jv: 'JV', legal: 'Legal', cloud: 'Cloud', marketing: 'Marketing',
};

const RISK_STYLE: Record<string, { bg: string; text: string }> = {
  critical: { bg: '#FEF2F2', text: '#B91C1C' },
  high:     { bg: '#FFFBEB', text: '#B45309' },
  medium:   { bg: '#EFF6FF', text: '#3B82F6' },
  low:      { bg: '#F0FDF4', text: '#15803D' },
};

const FLAG_STYLE: Record<string, { bg: string; border: string; titleColor: string; descColor: string }> = {
  critical: { bg: '#FEF2F2', border: '#FECACA', titleColor: '#991B1B', descColor: '#B91C1C' },
  high:     { bg: '#FFFBEB', border: '#FDE68A', titleColor: '#92400E', descColor: '#B45309' },
  medium:   { bg: '#EFF6FF', border: '#BFDBFE', titleColor: '#1D4ED8', descColor: '#3B82F6' },
};

const SEVERITY_ICON: Record<string, React.ReactNode> = {
  critical: <AlertCircle size={13} style={{ color: '#B91C1C' }} className="flex-shrink-0 mt-0.5" />,
  high:     <AlertTriangle size={13} style={{ color: '#B45309' }} className="flex-shrink-0 mt-0.5" />,
  medium:   <Info size={13} style={{ color: '#3B82F6' }} className="flex-shrink-0 mt-0.5" />,
};

const LENS_COLOR: Record<PersonaId, string> = {
  legal: '#6366F1', procurement: '#0D9488', cfo: '#D97706',
};

// ─── Main page ─────────────────────────────────────────────────────────────
export default function ContractDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { activePersonaId, setPersona } = usePersona();
  const { ar } = useLanguage();

  const [lens, setLens] = useState<PersonaId>(activePersonaId);

  // Keep local lens in sync when user switches persona via ChromeBar
  useEffect(() => {
    setLens(activePersonaId);
  }, [activePersonaId]);

  // Controlled open state for all story sections (keyed by section id)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  // Source panel: which section is highlighted (via "view source" click)
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  // Story panel: which section is briefly pulsed (via "view in story" click from source)
  const [pulsedSection, setPulsedSection] = useState<string | null>(null);
  // Export gate state
  const [exportState, setExportState] = useState<'idle' | 'confirming'>('idle');
  const [showCompare, setShowCompare] = useState(false);

  const storyPanelRef = useRef<HTMLDivElement>(null);
  const sourcePanelRef = useRef<HTMLDivElement>(null);

  const contract = contracts.find((c) => c.id === params.id);

  // ── Scroll helpers ──────────────────────────────────────────────────────
  const scrollSourceTo = useCallback((id: string) => {
    const el = document.getElementById(`source-${id}`);
    const panel = sourcePanelRef.current;
    if (!el || !panel) return;
    const elRect = el.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    panel.scrollTo({ top: panel.scrollTop + elRect.top - panelRect.top - 64, behavior: 'smooth' });
  }, []);

  const scrollStoryTo = useCallback((id: string) => {
    const panel = storyPanelRef.current;
    const el = panel?.querySelector(`[data-testid="story-section-${id}"]`) as HTMLElement | null;
    if (!el || !panel) return;
    const elRect = el.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    panel.scrollTo({ top: panel.scrollTop + elRect.top - panelRect.top - 20, behavior: 'smooth' });
  }, []);

  if (!contract) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface-2)' }}>
        <ChromeBar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-lg font-semibold text-[var(--brand-navy)]">Contract not found</p>
          <button onClick={() => navigate('/contracts')} className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300">
            Back to contracts
          </button>
        </div>
      </div>
    );
  }

  // ── Confidence analytics ────────────────────────────────────────────────
  const allConf = [
    ...contract.extractedFields.map((f) => f.confidence),
    ...contract.sections.map((s) => s.confidence),
  ];
  const avgConf = Math.round(allConf.reduce((s, v) => s + v, 0) / allConf.length);
  const highConfCount = allConf.filter((v) => v >= 90).length;
  const lowConfFields = contract.extractedFields.filter((f) => f.confidence < 90);
  const criticalConfFields = contract.extractedFields.filter((f) => f.confidence < 70);
  const confLabel =
    avgConf >= 95 ? 'High' :
    avgConf >= 85 ? 'Good' :
    avgConf >= 70 ? 'Moderate' : 'Low';
  const confChipColor =
    avgConf >= 95 ? { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' } :
    avgConf >= 85 ? { bg: '#EEF2FF', text: '#4338CA', border: '#C7D2FE' } :
    { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' };

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleToggleSection(id: string) {
    const nowOpen = !openSections[id];
    setOpenSections((prev) => ({ ...prev, [id]: nowOpen }));
    // Passive scroll sync: when a section opens, scroll source panel to its block
    if (nowOpen) {
      requestAnimationFrame(() => scrollSourceTo(id));
    }
  }

  function handleViewSource(id: string) {
    // Ensure the section stays open
    setOpenSections((prev) => ({ ...prev, [id]: true }));
    setHighlightedSection(id);
    requestAnimationFrame(() => scrollSourceTo(id));
    setTimeout(() => setHighlightedSection(null), 3000);
  }

  function handleGoToStory(id: string) {
    // Open the section and scroll story panel to it; briefly pulse it
    setOpenSections((prev) => ({ ...prev, [id]: true }));
    setPulsedSection(id);
    requestAnimationFrame(() => scrollStoryTo(id));
    setTimeout(() => setPulsedSection(null), 2200);
  }

  function handleLensChange(id: PersonaId) {
    setLens(id);
    setPersona(id);
  }

  function handleFlag() {
    toast({
      title: ar ? 'تم تعليم العقد للمراجعة' : 'Flagged for review',
      description: contract!.title,
    });
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    toast({
      title: ar ? 'تم نسخ الرابط' : 'Link copied to clipboard',
      description: ar ? 'شارك العقد مع زملائك' : 'Share this contract with your team',
    });
  }

  function handleExport() {
    if (criticalConfFields.length > 0 && exportState === 'idle') {
      setExportState('confirming');
      return;
    }
    setExportState('idle');
    const title = contract!.title;
    toast({
      title: ar ? 'تم تصدير العقد' : 'Contract exported',
      description: ar ? `${title} · PDF` : `${title} downloaded as PDF`,
    });
  }

  const riskStyle = RISK_STYLE[contract.riskLevel];
  const lensColor = LENS_COLOR[lens];
  const visibleFlags = contract.riskFlags.filter((f) => f.persona.includes(lens));
  const t = (en: string, arStr: string) => (ar ? arStr : en);
  const isProcurementUrgent = lens === 'procurement' && contract.daysToNextCritical <= 120;
  const urgentColor = contract.daysToNextCritical < 60 ? '#B91C1C' : '#B45309';
  const urgentBg = contract.daysToNextCritical < 60 ? '#FEF2F2' : '#FFFBEB';
  const urgentBorder = contract.daysToNextCritical < 60 ? '#FECACA' : '#FDE68A';

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--surface-2)' }}>
      <ChromeBar />
      {showCompare && contract && (
        <CompareModal
          contractA={contract}
          activeLens={lens}
          onClose={() => setShowCompare(false)}
        />
      )}

      <div className="flex-1 overflow-hidden flex flex-col pt-11">

        {/* Header strip */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-2" dir={ar ? 'rtl' : 'ltr'}>
            <button onClick={() => navigate('/contracts')} className="hover:text-[var(--brand-indigo)] transition-colors flex items-center gap-1">
              <ArrowLeft size={11} />
              {t('Contracts', 'العقود')}
            </button>
            <ChevronRight size={10} />
            <span className="text-[var(--brand-navy)] font-medium truncate max-w-xs" dir="ltr">{contract.counterparty}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[15px] font-bold text-[var(--brand-navy)] leading-tight" dir="ltr">{contract.title}</h1>
              <div className="flex items-center flex-wrap gap-2 mt-1.5">
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border border-gray-200 text-gray-500 bg-gray-50">
                  {TYPE_LABELS[contract.type] ?? contract.type}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: riskStyle.bg, color: riskStyle.text }} dir="ltr">
                  {contract.riskLevel.toUpperCase()} RISK
                </span>
                <span className="text-[11px] text-gray-400 font-mono" dir="ltr">{contract.contractNumber}</span>
                <span className="text-[11px] text-gray-500" dir="ltr">{contract.counterparty}</span>
                <span className="text-[11px] text-gray-400">·</span>
                <span className="text-[11px] text-gray-400" dir="ltr">{contract.governingLaw}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Confidence gate warning — shown when any field is unverified */}
              {lowConfFields.length > 0 && (
                <span
                  className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg border"
                  style={{ background: '#FFFBEB', color: '#B45309', borderColor: '#FDE68A' }}
                  title={`${lowConfFields.length} field${lowConfFields.length > 1 ? 's' : ''} below 90% confidence`}
                  dir="ltr"
                >
                  <AlertTriangle size={10} />
                  {lowConfFields.length} {t('unverified', 'غير مُتحقق')}
                </span>
              )}
              <button
                onClick={() => setShowCompare(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] font-medium text-gray-500 hover:border-[var(--brand-indigo)] hover:text-[var(--brand-indigo)] transition-colors"
              >
                <Columns2 size={11} /> {t('Compare', 'مقارنة')}
              </button>
              <button
                onClick={handleFlag}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] font-medium text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
              >
                <Flag size={11} /> {t('Flag', 'تعليم')}
              </button>
              {/* Export button with confidence gate */}
              {exportState === 'idle' ? (
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors"
                  style={
                    criticalConfFields.length > 0
                      ? { borderColor: '#FECACA', color: '#B91C1C', background: '#FEF2F2' }
                      : { borderColor: '#E5E7EB', color: '#64748B' }
                  }
                >
                  <Download size={11} /> {t('Export', 'تصدير')}
                </button>
              ) : (
                <div className="flex items-center gap-1 rounded-lg border border-amber-300 px-3 py-1.5 bg-amber-50">
                  <AlertTriangle size={10} className="text-amber-500 flex-shrink-0" />
                  <span className="text-[10px] font-semibold text-amber-700" dir="ltr">
                    {criticalConfFields.length} {t('low confidence —', 'ثقة منخفضة —')}
                  </span>
                  <button onClick={handleExport} className="text-[10px] font-bold text-amber-700 hover:underline">
                    {t('export anyway', 'تصدير على أي حال')}
                  </button>
                  <span className="text-amber-400 mx-0.5">·</span>
                  <button onClick={() => setExportState('idle')} className="text-[10px] text-gray-400 hover:text-gray-600">
                    {t('cancel', 'إلغاء')}
                  </button>
                </div>
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] font-medium text-gray-500 hover:border-gray-300 transition-colors"
              >
                <Share2 size={11} /> {t('Share', 'مشاركة')}
              </button>
            </div>
          </div>

          <div className="mt-2.5">
            <SignalStrip signals={contract.signals} size="md" />
          </div>
        </div>

        {/* Persona lens toggle */}
        <div className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-0">
            <PersonaLensToggle active={lens} onChange={handleLensChange} fullWidth />
          </div>
        </div>

        {/* Panel orientation label */}
        <div
          className="flex-shrink-0 grid border-b border-gray-100"
          style={{ gridTemplateColumns: '60% 40%', background: '#FAFBFF' }}
        >
          <div className="border-e border-gray-200 px-6 py-1.5 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: lensColor }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: lensColor }}>
              {t('AI Analysis', 'تحليل الذكاء الاصطناعي')}
            </span>
            <span className="text-[9px] text-gray-300">
              {t('risk · data · story', 'مخاطر · بيانات · سرد')}
            </span>
          </div>
          <div className="px-5 py-1.5 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-gray-300 flex-shrink-0" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              {t('Source Document', 'المستند الأصلي')}
            </span>
            <span className="text-[9px] text-gray-300">
              {t('clause-level extraction', 'استخراج على مستوى البند')}
            </span>
          </div>
        </div>

        {/* Two-panel content */}
        <div className="flex-1 overflow-hidden grid" style={{ gridTemplateColumns: '60% 40%' }}>

          {/* LEFT — Story panel */}
          <div ref={storyPanelRef} className="overflow-y-auto border-e border-gray-200 bg-white">
            <div className="px-6 py-5">

              {/* Procurement urgency countdown */}
              {isProcurementUrgent && (
                <div className="mb-5 rounded-xl border px-4 py-4 flex items-center gap-5" style={{ background: urgentBg, borderColor: urgentBorder }}>
                  <div className="text-center flex-shrink-0">
                    <p className="text-[44px] font-bold leading-none" style={{ color: urgentColor }} dir="ltr">{contract.daysToNextCritical}</p>
                    <p className="text-[11px] font-semibold mt-0.5" style={{ color: urgentColor }}>{ar ? 'يوم' : 'days'}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock size={12} style={{ color: urgentColor }} />
                      <p className="text-[12px] font-bold" style={{ color: urgentColor }}>{t('Critical renewal window', 'نافذة التجديد الحرجة')}</p>
                    </div>
                    <p className="text-[12px] text-gray-600 leading-snug" dir={ar ? 'rtl' : 'ltr'}>
                      {ar ? (CRITICAL_DATE_LABEL_AR[contract.nextCriticalDateLabel] ?? contract.nextCriticalDateLabel) : contract.nextCriticalDateLabel}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1" dir="ltr">{contract.nextCriticalDate}</p>
                  </div>
                </div>
              )}

              {/* 1. AI Summary */}
              <div className="mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: lensColor }}>
                  {t('AI Summary', 'الملخص الذكي')}
                </p>
                <div className="rounded-xl px-4 py-3 text-[12px] leading-relaxed text-[var(--brand-navy)]"
                  dir={ar && contract.aiSummaryAr ? 'rtl' : 'ltr'}
                  style={{ borderLeft: `3px solid ${lensColor}`, background: '#F8F9FA' }}>
                  {ar && contract.aiSummaryAr ? contract.aiSummaryAr[lens] : contract.aiSummary[lens]}
                </div>
              </div>

              {/* 2. Risk flags */}
              {visibleFlags.length > 0 && (
                <div className="mb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-2 text-gray-400">
                    {t('Risk flags', 'مؤشرات المخاطر')}
                  </p>
                  <div className="flex flex-col gap-2">
                    {visibleFlags.map((flag, i) => {
                      const fs = FLAG_STYLE[flag.severity] ?? FLAG_STYLE.medium;
                      return (
                        <div key={i} className="rounded-xl px-3 py-2.5" style={{ background: fs.bg, border: `1px solid ${fs.border}` }}>
                          <div className="flex items-start gap-2" dir={ar && flag.titleAr ? 'rtl' : 'ltr'}>
                            {SEVERITY_ICON[flag.severity]}
                            <div>
                              <p className="text-[12px] font-semibold leading-tight" style={{ color: fs.titleColor }}>
                                {ar && flag.titleAr ? flag.titleAr : flag.title}
                              </p>
                              <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: fs.descColor }}>
                                {ar && flag.descriptionAr ? flag.descriptionAr : flag.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Extracted fields */}
              <div className="mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-2 text-gray-400">
                  {t('Key extracted fields', 'البيانات المستخرجة')}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {contract.extractedFields.map((f, i) => {
                    const isCritical = f.riskLevel === 'critical';
                    const isHigh = f.riskLevel === 'high';
                    const isUnverified = f.confidence < 90;
                    const valColor = isCritical ? '#B91C1C' : isHigh ? '#B45309' : 'var(--brand-navy)';
                    return (
                      <div
                        key={i}
                        className="rounded-lg px-3 py-2.5"
                        style={{
                          background: isUnverified ? '#FFFBEB' : 'var(--surface-2)',
                          border: isUnverified ? '1px solid #FDE68A' : '1px solid transparent',
                        }}
                      >
                        <p className="text-[10px] text-gray-400 mb-1">
                          {ar ? (f.labelAr ?? FIELD_LABEL_AR[f.label] ?? f.label) : f.label}
                        </p>
                        <p className="text-[13px] font-semibold leading-tight" style={{ color: valColor }} dir="ltr">
                          {ar && f.valueAr ? f.valueAr : f.value}
                        </p>
                        <div className="mt-1.5">
                          <ConfBar value={f.confidence} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Negotiation angles */}
              {contract.negotiationAngles.length > 0 && (lens === 'legal' || lens === 'procurement') && (
                <div className="mb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-2 text-gray-400">
                    {t('Possible terms to negotiate', 'نقاط التفاوض')}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {(ar && contract.negotiationAnglesAr ? contract.negotiationAnglesAr : contract.negotiationAngles).map((angle, i) => (
                      <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-[var(--brand-indigo-pale)]">
                        <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--brand-indigo)' }} />
                        <p className="text-[12px] text-[var(--brand-navy)] leading-relaxed" dir={ar && contract.negotiationAnglesAr ? 'rtl' : 'ltr'}>{angle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CFO financial note in place of negotiation angles */}
              {lens === 'cfo' && contract.negotiationAngles.length > 0 && (
                <div className="mb-5 px-3 py-2.5 rounded-xl border border-amber-200 bg-amber-50">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-600 mb-1">
                    {t('CFO note', 'ملاحظة CFO')}
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {t(
                      'Negotiation angles are available in the Legal and Procurement views.',
                      'نقاط التفاوض متاحة في عرض القانوني والمشتريات.'
                    )}
                  </p>
                </div>
              )}

              {/* 5. Accordion contract sections */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-2 text-gray-400">
                  {t('Contract sections', 'بنود العقد')}
                </p>
                <div className="flex flex-col gap-2">
                  {contract.sections.map((s) => (
                    <StorySection
                      key={s.id}
                      section={s}
                      onViewSource={handleViewSource}
                      isOpen={!!openSections[s.id]}
                      onToggle={handleToggleSection}
                      isPulsed={pulsedSection === s.id}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom actions */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-2">
                <button onClick={() => navigate('/contracts')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium border border-gray-200 text-gray-500 hover:border-gray-300 transition-colors">
                  <ArrowLeft size={12} />
                  {t('Back', 'رجوع')}
                </button>
                <button
                  onClick={handleFlag}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Flag size={12} />
                  {t('Flag for review', 'تعليم للمراجعة')}
                </button>
                <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium border border-gray-200 text-gray-500 hover:border-gray-300 transition-colors">
                  <Download size={12} />
                  {t('Export', 'تصدير')}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium border border-gray-200 text-gray-500 hover:border-gray-300 transition-colors">
                  <Pencil size={12} />
                  {t('Correct extraction', 'تصحيح الاستخراج')}
                </button>
              </div>
              <div className="h-8" />
            </div>
          </div>

          {/* RIGHT — Source document panel */}
          <div ref={sourcePanelRef} className="overflow-y-auto" style={{ background: '#F8F9FA' }}>
            <div className="px-5 py-4">

              {/* Source panel header with confidence summary */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {t('Source document', 'المستند الأصلي')}
                </p>
                {/* Document confidence chip */}
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-semibold"
                  style={{ background: confChipColor.bg, color: confChipColor.text, borderColor: confChipColor.border }}
                  title={`${highConfCount} of ${allConf.length} clauses extracted with ≥90% confidence`}
                  dir="ltr"
                >
                  <ShieldCheck size={10} />
                  {confLabel} · {avgConf}%
                </div>
              </div>

              {/* Confidence breakdown bar */}
              <div className="mb-4 rounded-xl border border-gray-200 bg-white px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-gray-400">{t('Extraction confidence', 'ثقة الاستخراج')}</p>
                  <p className="text-[10px] font-semibold" style={{ color: confChipColor.text }} dir="ltr">
                    {highConfCount}/{allConf.length} {t('fields ≥90%', 'حقل ≥90%')}
                  </p>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(highConfCount / allConf.length) * 100}%`, background: confChipColor.text }}
                  />
                </div>
                {lowConfFields.length > 0 && (
                  <p className="text-[9px] text-amber-600 mt-1.5">
                    ⚠ {lowConfFields.map(f => ar ? (f.labelAr ?? FIELD_LABEL_AR[f.label] ?? f.label) : f.label).join(', ')} {t('— verify before export', '— تحقق قبل التصدير')}
                  </p>
                )}
              </div>

              {/* Document metadata */}
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 mb-4">
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <div>
                    <p className="text-[10px] text-gray-400">{t('Start date', 'تاريخ البداية')}</p>
                    <p className="text-[12px] font-semibold text-[var(--brand-navy)]" dir="ltr">{contract.startDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">{t('End date', 'تاريخ الانتهاء')}</p>
                    <p className="text-[12px] font-semibold text-[var(--brand-navy)]" dir="ltr">
                      {contract.endDate === '9999-12-31' ? t('Open-ended', 'غير محدد') : contract.endDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">{t('Critical date', 'الموعد الحرج')}</p>
                    <p className="text-[12px] font-semibold text-[var(--brand-navy)]" dir="ltr">{contract.nextCriticalDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400">{t('Value', 'القيمة')}</p>
                    <p className="text-[12px] font-semibold text-[var(--brand-navy)]" dir="ltr">{contract.annualValueDisplay}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-[11px] font-medium text-[var(--brand-navy)] mt-0.5" dir={ar ? 'rtl' : 'ltr'}>
                    {ar ? (CRITICAL_DATE_LABEL_AR[contract.nextCriticalDateLabel] ?? contract.nextCriticalDateLabel) : contract.nextCriticalDateLabel}
                  </p>
                </div>
              </div>

              {/* Source blocks */}
              <div className="flex flex-col gap-3">
                {contract.sections.map((s) => (
                  <SourceBlock
                    key={s.id}
                    section={s}
                    isHighlighted={highlightedSection === s.id}
                    id={s.id}
                    onGoToStory={handleGoToStory}
                  />
                ))}
              </div>
              <div className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
