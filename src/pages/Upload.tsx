import { useState, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { ChromeBar } from '@/components/layout/ChromeBar';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from '@/hooks/use-toast';
import {
  Upload as UploadIcon,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  FileText,
  Circle,
  Loader2,
  X,
  ArrowRight,
  Pencil,
  Sparkles,
  FileSearch,
  ScrollText,
} from 'lucide-react';

type UploadPhase = 'drop' | 'processing' | 'preview' | 'success';

const STEPS = [
  { id: 'reading',     label: 'Reading document',         labelAr: 'قراءة المستند' },
  { id: 'identifying', label: 'Identifying contract type', labelAr: 'تحديد نوع العقد' },
  { id: 'extracting',  label: 'Extracting key fields',    labelAr: 'استخراج البيانات الرئيسية' },
  { id: 'scoring',     label: 'Scoring risk signals',     labelAr: 'تقييم إشارات المخاطر' },
  { id: 'building',    label: 'Building contract story',  labelAr: 'بناء قصة العقد' },
];

// Matches Khaled Al-Rashidi employment contract (c4)
type FieldConf = 'high' | 'amber' | 'red';
const MOCK_FIELDS: {
  label: string; labelAr: string; value: string; confidence: number; conf: FieldConf;
}[] = [
  { label: 'Counterparty',     labelAr: 'الطرف المقابل',      value: 'Khaled Ibrahim Al-Rashidi', confidence: 99, conf: 'high' },
  { label: 'Contract type',    labelAr: 'نوع العقد',           value: 'Employment — Fixed term',   confidence: 99, conf: 'high' },
  { label: 'Annual value',     labelAr: 'القيمة السنوية',     value: 'SAR 466,800',               confidence: 95, conf: 'high' },
  { label: 'End date',         labelAr: 'تاريخ الانتهاء',     value: 'January 31, 2026',          confidence: 99, conf: 'high' },
  { label: 'Notice period',    labelAr: 'مدة الإشعار',        value: '60 days (or pay in lieu)',  confidence: 98, conf: 'high' },
  { label: 'Non-compete',      labelAr: 'عدم المنافسة',       value: '12 months — KSA logistics', confidence: 82, conf: 'amber' },
  { label: 'End-of-service',   labelAr: 'مكافأة نهاية الخدمة', value: '~SAR 38,900 (estimated)',  confidence: 72, conf: 'red' },
];

const RISK_FLAGS = [
  { severity: 'high',   titleAr: 'نافذة التجديد التلقائي — 90 يوم', title: 'Auto-renewal window — 90 days' },
  { severity: 'medium', titleAr: 'لا توجد أرصدة مستوى الخدمة',      title: 'No SLA credits defined' },
];

export default function Upload() {
  const [, navigate] = useLocation();
  const { ar } = useLanguage();
  const [phase, setPhase] = useState<UploadPhase>('drop');
  const [fileName, setFileName] = useState('');
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [editingField, setEditingField] = useState<number | null>(null);
  const [fieldValues, setFieldValues] = useState<string[]>(MOCK_FIELDS.map((f) => f.value));
  const fileRef = useRef<HTMLInputElement>(null);

  const t = (en: string, a: string) => (ar ? a : en);

  function startProcessing(name: string) {
    setFileName(name);
    setPhase('processing');
    setCompletedSteps(0);
    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setCompletedSteps(i + 1);
        if (i === STEPS.length - 1) setTimeout(() => setPhase('preview'), 600);
      }, (i + 1) * 900);
    });
  }

  function handleFile(file: File) {
    if (!file) return;
    if (!file.name.match(/\.(pdf|docx?|txt)$/i)) return;
    startProcessing(file.name);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface-2)' }}>
      <ChromeBar />
      <div className="flex-1 flex items-start justify-center pt-16 px-4 pb-12">
        <div className="w-full max-w-lg">

          {/* ── STEP 1: Drop zone ─────────────────────────────────────── */}
          {phase === 'drop' && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-xl font-bold text-[var(--brand-navy)] mb-1">
                  {t('Upload a contract', 'رفع عقد جديد')}
                </h1>
                <p className="text-[12px] text-gray-400">
                  {t('AI extracts, scores, and stories your contract in seconds', 'يستخرج الذكاء الاصطناعي البيانات ويقيّم المخاطر في ثوانٍ')}
                </p>
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileRef.current?.click()}
                className="rounded-2xl border-2 border-dashed cursor-pointer transition-all py-16 flex flex-col items-center gap-4 text-center"
                style={{
                  borderColor: isDragging ? 'var(--brand-indigo)' : '#CBD5E1',
                  background: isDragging ? 'var(--brand-indigo-pale)' : 'white',
                }}
                data-testid="upload-dropzone"
              >
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center"
                  style={{ background: isDragging ? 'var(--brand-indigo)' : 'var(--brand-indigo-pale)' }}
                >
                  <UploadIcon size={26} style={{ color: isDragging ? 'white' : 'var(--brand-indigo)' }} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--brand-navy)]">
                    {t('Drop your contract here', 'اسحب العقد وأفلته هنا')}
                  </p>
                  <p className="text-[12px] text-gray-400 mt-1">
                    {t('or click to browse — PDF, Word, or text', 'أو انقر للاستعراض — PDF أو Word أو نص')}
                  </p>
                </div>
                <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">
                  {t('Max 50 MB', 'الحد الأقصى 50 ميجابايت')}
                </span>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                data-testid="upload-file-input"
              />

              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => startProcessing('Employment_Contract_Senior_Director.pdf')}
                  className="flex items-center gap-2 text-[12px] font-semibold px-4 py-2.5 rounded-xl border-2 border-[var(--brand-indigo)] text-[var(--brand-indigo)] bg-[var(--brand-indigo-pale)] hover:bg-white transition-colors"
                  data-testid="upload-demo-btn"
                >
                  <Sparkles size={13} />
                  {t('Try a demo contract', 'جرّب عقداً تجريبياً')}
                </button>
              </div>

              {/* What you'll get */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  {
                    Icon: FileSearch,
                    title: t('Field extraction', 'استخراج البيانات'),
                    desc: t('7+ key fields identified automatically', '7+ حقول تُكتشف تلقائياً'),
                  },
                  {
                    Icon: AlertTriangle,
                    title: t('Risk scoring', 'تقييم المخاطر'),
                    desc: t('Critical / High / Medium flags', 'حرج / عالٍ / متوسط'),
                  },
                  {
                    Icon: ScrollText,
                    title: t('Contract story', 'قصة العقد'),
                    desc: t('Plain-language clause narrative', 'سرد واضح لكل بند'),
                  },
                ].map(({ Icon, title, desc }, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-white border border-gray-100">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--brand-indigo-pale)', color: 'var(--brand-indigo)' }}
                    >
                      <Icon size={16} />
                    </div>
                    <p className="text-[11px] font-semibold text-[var(--brand-navy)]">{title}</p>
                    <p className="text-[10px] text-gray-400 leading-snug">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Processing ────────────────────────────────────── */}
          {phase === 'processing' && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-xl font-bold text-[var(--brand-navy)] mb-1">
                  {t('Analysing contract', 'جارٍ تحليل العقد')}
                </h1>
                <p className="text-[12px] text-gray-400 font-mono" dir="ltr">{fileName}</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex flex-col gap-4">
                  {STEPS.map((step, i) => {
                    const done = completedSteps > i;
                    const active = completedSteps === i;
                    return (
                      <div key={step.id} className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center">
                          {done ? (
                            <CheckCircle size={20} style={{ color: 'var(--brand-indigo)' }} />
                          ) : active ? (
                            <Loader2 size={20} className="animate-spin" style={{ color: 'var(--brand-indigo)' }} />
                          ) : (
                            <Circle size={20} className="text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className="text-[13px] font-medium"
                            style={{ color: done ? 'var(--brand-navy)' : active ? 'var(--brand-indigo)' : '#CBD5E1' }}
                          >
                            {ar ? step.labelAr : step.label}
                          </p>
                          {done && i === 0 && (
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {t('Employment contract · 18 pages', 'عقد عمل · 18 صفحة')}
                            </p>
                          )}
                          {done && i === 2 && (
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {t('7 fields extracted · 2 need review', '7 حقول مستخرجة · 2 تتطلب مراجعة')}
                            </p>
                          )}
                          {done && i === 3 && (
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {t('2 risk flags · 1 portfolio contradiction', 'إشارتا مخاطرة · تعارض محفظة واحد')}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 h-1 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(completedSteps / STEPS.length) * 100}%`, background: 'var(--gradient-cta)' }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                  {Math.round((completedSteps / STEPS.length) * 100)}%
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 3: Preview ───────────────────────────────────────── */}
          {phase === 'preview' && (
            <div>
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-[var(--brand-navy)] mb-1">
                  {t('Review extraction', 'مراجعة الاستخراج')}
                </h1>
                <p className="text-[12px] text-gray-400">
                  {t('Verify key fields before adding to portfolio', 'تحقق من البيانات قبل الإضافة للمحفظة')}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">

                {/* File header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand-indigo-pale)' }}>
                    <FileText size={16} style={{ color: 'var(--brand-indigo)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[var(--brand-navy)] truncate" dir="ltr">{fileName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: '#FFF7ED', color: '#C2410C' }}>
                        {t('Employment', 'عمل')}
                      </span>
                      <span className="text-[10px] text-gray-400" dir="ltr">
                        {t('18 pages · 93% avg confidence', '18 صفحة · 93% ثقة متوسطة')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── CONTRADICTION BANNER — TOP, most important ── */}
                <div className="mx-4 mt-4 mb-3 px-3 py-3 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-red-500" />
                    <div>
                      <p className="text-[12px] font-semibold text-red-800">
                        {t('Potential new contradiction detected', 'تعارض جديد محتمل')}
                      </p>
                      <p className="text-[11px] text-red-600 mt-1 leading-relaxed">
                        {t(
                          'Renewal notice period (90 days) differs from BrandWave Marketing (30 days). Adding this contract creates a portfolio notice-period inconsistency.',
                          'مدة إشعار التجديد (90 يوم) تختلف عن BrandWave Marketing (30 يوم). إضافة هذا العقد ستخلق تعارضاً في مدد الإشعار بالمحفظة.'
                        )}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: '#FEE2E2', color: '#991B1B', border: '0.5px solid #FECACA' }}>
                          {t('This contract — 90 days', 'هذا العقد — 90 يوم')}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: '#FEE2E2', color: '#991B1B', border: '0.5px solid #FECACA' }}>
                          {t('BrandWave — 30 days', 'BrandWave — 30 يوم')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── EXTRACTED FIELDS grouped by confidence ── */}
                <div className="px-4 pb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    {t('Extracted fields — review before adding', 'البيانات المستخرجة — راجع قبل الإضافة')}
                  </p>
                </div>
                <div>
                  {MOCK_FIELDS.map((f, i) => {
                    const isAmber = f.conf === 'amber';
                    const isRed = f.conf === 'red';
                    const isEditing = editingField === i;
                    const confColor = f.confidence >= 90 ? '#6366F1' : f.confidence >= 70 ? '#B45309' : '#B91C1C';
                    const prevConf = MOCK_FIELDS[i - 1]?.conf;
                    const showGroupHeader = i === 0 || (prevConf && f.conf !== prevConf);

                    return (
                      <div key={i}>
                        {showGroupHeader && (
                          <div
                            className="flex items-center gap-2 px-4 py-1.5 border-b"
                            style={{
                              background: isRed ? '#FEF2F2' : isAmber ? '#FFFBEB' : '#F0FDF4',
                              borderColor: isRed ? '#FECACA' : isAmber ? '#FDE68A' : '#BBF7D0',
                              borderTop: i > 0 ? '1px solid' : undefined,
                              borderTopColor: isRed ? '#FECACA' : isAmber ? '#FDE68A' : undefined,
                            }}
                          >
                            <div
                              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                              style={{ background: isRed ? '#B91C1C' : isAmber ? '#D97706' : '#15803D' }}
                            />
                            <p className="text-[10px] font-semibold" style={{ color: isRed ? '#B91C1C' : isAmber ? '#92400E' : '#15803D' }}>
                              {isRed
                                ? t('Low confidence — verify before adding', 'ثقة منخفضة — تحقق قبل الإضافة')
                                : isAmber
                                ? t('Review needed', 'تتطلب مراجعة')
                                : t('Extracted cleanly', 'تم الاستخراج بنجاح')}
                            </p>
                          </div>
                        )}
                        <div
                          className="flex items-center gap-3 px-4 py-2.5"
                          style={{
                            borderLeft: isRed ? '3px solid #B91C1C' : isAmber ? '3px solid #D97706' : undefined,
                            background: isRed ? '#FEF9F9' : isAmber ? '#FFFDF5' : undefined,
                            borderBottom: '0.5px solid #F3F4F6',
                          }}
                        >
                          <span
                            className="text-[11px] flex-shrink-0"
                            style={{
                              color: isRed ? '#B91C1C' : isAmber ? '#92400E' : '#9CA3AF',
                              minWidth: 110,
                            }}
                          >
                            {ar ? f.labelAr : f.label}
                          </span>
                          <span
                            className="text-[13px] font-semibold flex-1"
                            style={{ color: isRed ? '#B91C1C' : isAmber ? '#B45309' : 'var(--brand-navy)' }}
                            dir="ltr"
                          >
                            {isEditing ? fieldValues[i] : fieldValues[i]}
                          </span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {f.conf === 'high' ? (
                              <CheckCircle size={13} style={{ color: '#15803D' }} />
                            ) : (
                              <button
                                onClick={() => setEditingField(isEditing ? null : i)}
                                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border transition-colors"
                                style={{
                                  color: isRed ? '#B91C1C' : '#B45309',
                                  borderColor: isRed ? '#FECACA' : '#FDE68A',
                                  background: isRed ? '#FEF2F2' : '#FFFBEB',
                                }}
                              >
                                <Pencil size={9} />
                                {t('Edit', 'تعديل')}
                              </button>
                            )}
                            <div className="flex items-center gap-1">
                              <div className="w-7 h-0.5 rounded-full bg-gray-200 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${f.confidence}%`, background: confColor }} />
                              </div>
                              <span className="text-[9px]" style={{ color: confColor }}>{f.confidence}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Inline edit form */}
                        {isEditing && (
                          <div className="px-4 py-3 border-b border-gray-100" style={{ background: '#FFFBEB' }}>
                            <p className="text-[10px] font-semibold text-amber-700 mb-2">
                              {t('Correct this extraction before adding', 'صحّح هذا الاستخراج قبل الإضافة')}
                            </p>
                            <input
                              className="w-full px-3 py-2 rounded-lg border border-amber-300 text-[12px] text-[var(--brand-navy)] bg-white outline-none focus:border-[var(--brand-indigo)] transition-colors"
                              dir="ltr"
                              value={fieldValues[i]}
                              onChange={(e) => {
                                const next = [...fieldValues];
                                next[i] = e.target.value;
                                setFieldValues(next);
                              }}
                            />
                            <p className="text-[10px] text-gray-400 mt-1 italic">
                              {t(`AI confidence: ${f.confidence}% — review source clause to verify`, `دقة الذكاء الاصطناعي: ${f.confidence}% — راجع البند المصدر للتحقق`)}
                            </p>
                            <button
                              onClick={() => setEditingField(null)}
                              className="mt-2 w-full py-1.5 rounded-lg text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                              style={{ background: 'var(--brand-indigo)' }}
                            >
                              {t('Confirm correction', 'تأكيد التصحيح')}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Risk signals */}
                <div className="px-4 pt-3 pb-4 border-t border-gray-100">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    {t('Risk signals', 'إشارات المخاطر')}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {RISK_FLAGS.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{ background: f.severity === 'high' ? '#FFFBEB' : '#EFF6FF' }}
                      >
                        <AlertTriangle size={11} style={{ color: f.severity === 'high' ? '#B45309' : '#3B82F6' }} />
                        <span className="text-[11px] font-medium text-[var(--brand-navy)]">
                          {ar ? f.titleAr : f.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── 3 action buttons ── */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setPhase('success');
                    toast({
                      title: ar ? 'تمت إضافة العقد إلى المحفظة' : 'Contract added to portfolio',
                      description: ar ? `${fileName} · جاهز للمراجعة` : `${fileName} is now indexed and ready`,
                    });
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--gradient-cta)' }}
                  data-testid="upload-confirm-btn"
                >
                  {t('Add to portfolio', 'إضافة إلى المحفظة')}
                  <ArrowRight size={14} />
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingField(MOCK_FIELDS.findIndex((f) => f.conf !== 'high'))}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-semibold border transition-colors"
                    style={{ color: '#B45309', borderColor: '#FDE68A', background: '#FFFBEB' }}
                  >
                    <Pencil size={12} />
                    {t('Correct fields first', 'تصحيح الحقول أولاً')}
                  </button>
                  <button
                    onClick={() => setPhase('drop')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-medium border border-gray-200 text-gray-500 hover:border-gray-300 transition-colors"
                    data-testid="upload-discard-btn"
                  >
                    <X size={12} />
                    {t('Discard', 'تجاهل')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Success ───────────────────────────────────────── */}
          {phase === 'success' && (
            <div className="text-center">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: '#F0FDF4' }}
              >
                <CheckCircle size={32} style={{ color: '#15803D' }} />
              </div>
              <h1 className="text-xl font-bold text-[var(--brand-navy)] mb-2">
                {t('Contract added', 'تمت إضافة العقد')}
              </h1>
              <p className="text-[12px] text-gray-400 mb-1">
                <span className="font-mono font-medium text-[var(--brand-navy)]" dir="ltr">{fileName}</span>
              </p>
              <p className="text-[12px] text-gray-400 mb-6">
                {t('Khaled Ibrahim Al-Rashidi · Employment · 7 fields extracted', 'خالد إبراهيم الراشدي · عقد عمل · 7 حقول مستخرجة')}
              </p>

              {/* Contradiction reminder */}
              <div className="mb-6 px-4 py-3 rounded-xl text-start" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
                <div className="flex items-start gap-2">
                  <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <p className="text-[12px] font-semibold text-amber-800">
                      {t('1 new contradiction flagged in portfolio', 'تم رصد تعارض جديد في المحفظة')}
                    </p>
                    <p className="text-[11px] text-amber-600 mt-0.5">
                      {t('Renewal notice period differs from BrandWave (30 days). Review in Portfolio Intelligence.', 'فترة إشعار التجديد تختلف عن BrandWave (30 يوم). راجع في ذكاء المحفظة.')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate('/contracts')}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--gradient-cta)' }}
                  data-testid="upload-success-view-btn"
                >
                  {t('View in contract library', 'عرض في مكتبة العقود')}
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate('/portfolio')}
                  className="py-2.5 rounded-xl text-[13px] font-medium border border-gray-200 text-gray-500 hover:border-gray-300 transition-colors"
                >
                  {t('View portfolio intelligence', 'عرض ذكاء المحفظة')}
                </button>
                <button
                  onClick={() => { setPhase('drop'); setFileName(''); setCompletedSteps(0); setFieldValues(MOCK_FIELDS.map((f) => f.value)); }}
                  className="py-2 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {t('Upload another contract', 'رفع عقد آخر')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
