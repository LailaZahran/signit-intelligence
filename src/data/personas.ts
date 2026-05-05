import { Persona } from '../types';

export const personas: Persona[] = [
  {
    id: 'legal',
    name: 'Layla Al-Rashidi',
    role: 'Legal Counsel',
    initials: 'LR',
    color: '#6366F1',
    bgColor: '#EEF2FF',
    borderColor: 'border-indigo-400',
    briefingLines: [
      {
        text: '5 cross-contract contradictions detected — 2 at critical severity',
        navigateTo: '/portfolio?view=contradictions',
        delta: '+2 new',
      },
      {
        text: 'NexusCloud liability cap USD 50K is below annual spend of USD 104K',
        navigateTo: '/contracts/c6',
      },
      {
        text: 'BrandWave joint IP ownership conflicts with Senior Director employment contract',
        navigateTo: '/contracts/c9',
        delta: 'new',
      },
    ],
    bubbles: [
      { label: 'Contradictions', icon: 'GitMerge', navigateTo: '/portfolio?view=contradictions', isPrimary: true },
      { label: 'Liability gaps', icon: 'ShieldAlert', navigateTo: '/contracts?filter=liability', isPrimary: true },
      { label: 'PDPL exposure', icon: 'Lock', navigateTo: '/contracts?filter=pdpl', isPrimary: false },
      { label: 'Compare clauses', icon: 'Columns2', navigateTo: '/contracts?mode=compare', isPrimary: false },
      { label: 'Export brief', icon: 'FileDown', navigateTo: '/portfolio?export=board', isPrimary: false },
      { label: 'Flag contract', icon: 'Flag', navigateTo: '/contracts', isPrimary: false },
    ],
    cmdPlaceholder: 'Ask anything — e.g. "Which contracts have liability caps below SAR 200K?"',
    footerNote: 'AI-extracted · Review all flagged clauses before relying on them',
    footerStat: '3 critical · 5 high · 2 medium',
  },
  {
    id: 'procurement',
    name: 'Omar Al-Ghamdi',
    role: 'Procurement Manager',
    initials: 'OG',
    color: '#0EA5E9',
    bgColor: '#F0F9FF',
    borderColor: 'border-sky-400',
    briefingLines: [
      {
        text: 'BrandWave auto-renewal in 30 days — SAR 252K committed if missed',
        navigateTo: '/contracts/c9',
        delta: 'most urgent',
      },
      {
        text: 'Office Lease break clause window: 119 days — SAR 18M+ exposure if missed',
        navigateTo: '/contracts/c8',
        delta: 'was 180d',
      },
      {
        text: 'CloudCRM: 21% seat underutilization — strong leverage before April 1 deadline',
        navigateTo: '/contracts/c3',
      },
    ],
    bubbles: [
      { label: 'Renewals due', icon: 'RefreshCw', navigateTo: '/contracts?filter=renewing', isPrimary: true },
      { label: 'Urgent deadlines', icon: 'Clock', navigateTo: '/contracts?filter=urgent', isPrimary: true },
      { label: 'Break clauses', icon: 'DoorOpen', navigateTo: '/contracts?filter=break', isPrimary: false },
      { label: 'Compare terms', icon: 'Columns2', navigateTo: '/contracts?mode=compare', isPrimary: false },
      { label: 'Upload contract', icon: 'Upload', navigateTo: '/upload', isPrimary: false },
      { label: 'Export brief', icon: 'FileDown', navigateTo: '/portfolio?export=board', isPrimary: false },
    ],
    cmdPlaceholder: 'Ask anything — e.g. "Which contracts renew in the next 90 days?"',
    footerNote: 'Deadlines are AI-extracted — verify against signed originals',
    footerStat: '4 renewing · 47 days to most urgent',
  },
  {
    id: 'cfo',
    name: 'Ahmad Al-Otaibi',
    role: 'CFO / COO',
    initials: 'AA',
    color: '#10B981',
    bgColor: '#ECFDF5',
    borderColor: 'border-emerald-400',
    briefingLines: [
      {
        text: 'SAR 742K in hidden costs identified above headline contract values',
        navigateTo: '/portfolio?view=exposure',
        delta: 'new analysis',
      },
      {
        text: 'Al-Mizan success fee: ~SAR 147K potentially owed — JV transaction risk',
        navigateTo: '/contracts/c7',
        delta: 'new',
      },
      {
        text: 'SAR 835K under-capped liability across 3 contracts below SAR 200K ceiling',
        navigateTo: '/portfolio?view=metrics',
      },
    ],
    bubbles: [
      { label: 'Financial exposure', icon: 'TrendingUp', navigateTo: '/portfolio?view=exposure', isPrimary: true },
      { label: 'Board brief', icon: 'Presentation', navigateTo: '/portfolio?export=board', isPrimary: true },
      { label: 'Hidden costs', icon: 'EyeOff', navigateTo: '/portfolio?view=hidden', isPrimary: false },
      { label: 'Liability gaps', icon: 'ShieldAlert', navigateTo: '/contracts?filter=liability', isPrimary: false },
      { label: 'Upload contract', icon: 'Upload', navigateTo: '/upload', isPrimary: false },
      { label: 'Compare terms', icon: 'Columns2', navigateTo: '/contracts?mode=compare', isPrimary: false },
    ],
    cmdPlaceholder: 'Ask anything — e.g. "What is our total liability exposure across all active contracts?"',
    footerNote: 'Values in SAR · USD converted at 3.75 · AI-computed — verify before board reporting',
    footerStat: 'SAR 8.4M obligations · SAR 742K hidden costs',
  },
];

export const getPersona = (id: string): Persona =>
  personas.find((p) => p.id === id) ?? personas[0];
