import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Wallet,
  LayoutGrid,
  Sparkles,
  BarChart3,
  Lightbulb,
  Smartphone,
  ShieldCheck,
  Tags,
  Bot,
  Star,
  ChevronDown,
  Check,
  Target,
  Lock,
  Zap,
  Users,
  GraduationCap,
  Coffee,
  Bus,
  BookOpen,
  Gift,
  User,
  Trophy,
  Plus,
  MessageCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { features, testimonials, faqItems } from '../../data/mockData';
import { formatPkr } from '../../utils/currency';
import { useApp } from '../../context/AppContext';

const iconMap = {
  wallet: Wallet,
  layout: LayoutGrid,
  sparkles: Sparkles,
  chart: BarChart3,
  lightbulb: Lightbulb,
  smartphone: Smartphone,
};

const IMG = {
  campus: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80',
  study: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  laptop: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
  cafe: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
  friends: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  library: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
  walk: 'https://images.unsplash.com/photo-1627556704302-624286467c65?auto=format&fit=crop&w=1400&q=80',
  phone: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80',
};

/* ===== OLD: phone-only mockup (kept for reference — do not delete) =====
function PhoneMockup_OLD() {
  const txs = [
    { name: 'Campus Cafe', amt: -450, Icon: Coffee, tone: 'bg-[#FFE8DC] text-[#C45C2A]' },
    { name: 'Allowance', amt: 40000, Icon: Gift, tone: 'bg-[#D8F0DC] text-[#2F7A45]' },
    { name: 'Bus Pass', amt: -200, Icon: Bus, tone: 'bg-[#DCE6F8] text-[#3B5B9C]' },
  ];

  return (
    <div className="relative mx-auto w-65.5 sm:w-71.5 animate-float">
      <div className="absolute -inset-12 bg-linear-to-br from-cc-lime/30 via-cc-forest/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="relative rounded-[2.6rem] bg-linear-to-b from-[#243d34] via-cc-forest to-[#062820] p-0.75 shadow-[0_32px_70px_-14px_rgba(11,61,46,0.6)]">
        <div className="rounded-[2.45rem] bg-[#F7FBF8] overflow-hidden">
          <div className="relative bg-linear-to-b from-cc-forest to-[#0f4a38] px-5 pt-3.5 pb-6 text-white">
            <div className="flex items-center justify-between text-[10px] text-white/70 mb-4 px-0.5">
              <span className="font-semibold tracking-wide">9:41</span>
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-18 h-5.5 bg-black/45 rounded-full shadow-inner" />
              <span className="font-medium tracking-wide flex items-center gap-1">
                5G
                <span className="inline-flex gap-0.5 items-end h-2.5">
                  <span className="w-0.5 h-1 bg-white/80 rounded-sm" />
                  <span className="w-0.5 h-1.5 bg-white/80 rounded-sm" />
                  <span className="w-0.5 h-2 bg-white/80 rounded-sm" />
                  <span className="w-0.5 h-2.5 bg-white rounded-sm" />
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <p className="text-[12px] text-white/65">Good morning</p>
                <p className="text-[15px] font-bold tracking-tight">Ayesha</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                <User className="w-4 h-4 text-white/90" />
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 shadow-inner">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/55">Balance (PKR)</p>
                <span className="text-[9px] font-bold text-cc-lime bg-cc-lime/15 px-2 py-0.5 rounded-full">This month</span>
              </div>
              <p className="text-[1.7rem] font-extrabold tracking-tight leading-none mt-1.5">{formatPkr(124050)}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/15 overflow-hidden">
                  <div className="h-full w-[62%] rounded-full bg-linear-to-r from-cc-lime to-[#8fd98f]" />
                </div>
                <p className="text-[10px] text-cc-lime font-semibold whitespace-nowrap">+{formatPkr(4200)}</p>
              </div>
            </div>
          </div>
          <div className="px-4 pt-4 pb-1 space-y-1">
            <div className="flex items-center justify-between mb-2 px-0.5">
              <p className="text-[10px] font-bold text-cc-muted uppercase tracking-[0.12em]">Recent</p>
              <span className="text-[10px] font-semibold text-cc-lime">View all</span>
            </div>
            {txs.map((row) => (
              <div key={row.name} className="flex items-center justify-between py-2.5 px-2 rounded-xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl ${row.tone} flex items-center justify-center shadow-sm shrink-0`}>
                    <row.Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-cc-ink truncate">{row.name}</p>
                    <p className="text-[10px] text-cc-muted">{row.amt > 0 ? 'Income' : 'Expense'}</p>
                  </div>
                </div>
                <span className={`text-[12px] font-bold tabular-nums shrink-0 ${row.amt > 0 ? 'text-cc-lime-dark' : 'text-cc-ink'}`}>
                  {formatPkr(row.amt, { signed: true })}
                </span>
              </div>
            ))}
          </div>
          <div className="mx-3 mt-2 mb-3.5 flex justify-around items-center rounded-2xl bg-white border border-cc-mint shadow-sm py-2 px-1">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-cc-forest text-white shadow-md">
              <Wallet className="w-4 h-4" />
            </span>
            <BarChart3 className="w-4 h-4 text-cc-muted" />
            <Lightbulb className="w-4 h-4 text-cc-muted" />
            <Smartphone className="w-4 h-4 text-cc-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
===== END OLD PhoneMockup ===== */

/* ===== OLD: Monthly Spending floating card (kept — do not delete) =====
function SpendingCard() {
  const bars = [
    { h: 38, label: 'M' },
    { h: 62, label: 'T' },
    { h: 48, label: 'W' },
    { h: 86, label: 'T', active: true },
    { h: 54, label: 'F' },
    { h: 72, label: 'S' },
    { h: 34, label: 'S' },
  ];
  const cats = [
    { name: 'Food', pct: 42, color: 'bg-cc-lime' },
    { name: 'Transport', pct: 18, color: 'bg-cc-forest' },
    { name: 'Academics', pct: 22, color: 'bg-cc-gold' },
    { name: 'Other', pct: 18, color: 'bg-gray-300' },
  ];

  return (
    <div className="absolute -left-2 sm:-left-20 lg:-left-24 top-[42%] -translate-y-1/2 w-47.5 sm:w-52.5 bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_-15px_rgba(11,61,46,0.28)] border border-white p-4 animate-float-alt z-20">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-extrabold text-cc-forest">Monthly Spending</p>
        <span className="text-[9px] font-bold text-cc-lime bg-cc-mint px-2 py-0.5 rounded-full">-12%</span>
      </div>
      <div className="flex items-end gap-1.5 h-18 mb-3.5 px-0.5">
        {bars.map((b, i) => (
          <div key={`${b.label}-${i}`} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <div
              className={`w-full rounded-t-md transition-all ${b.active ? 'bg-linear-to-t from-cc-forest to-cc-lime shadow-sm' : 'bg-linear-to-t from-cc-lime/50 to-cc-lime/85'}`}
              style={{ height: `${b.h}%` }}
            />
            <span className={`text-[9px] font-medium ${b.active ? 'text-cc-forest' : 'text-cc-muted'}`}>{b.label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {cats.map((c) => (
          <div key={c.name} className="flex items-center gap-2 text-[11px]">
            <div className={`w-2 h-2 rounded-full shrink-0 ${c.color}`} />
            <span className="flex-1 text-cc-muted font-medium">{c.name}</span>
            <span className="font-bold text-cc-ink tabular-nums">{c.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
===== END OLD SpendingCard ===== */

/* ===== OLD: AI tip chip (kept — do not delete) =====
function InsightChip() {
  return (
    <div className="absolute -right-1 sm:right-0 top-8 sm:top-10 z-20 animate-float-alt max-w-42">
      <div className="flex items-start gap-2 bg-white rounded-2xl shadow-[0_12px_32px_-8px_rgba(11,61,46,0.22)] border border-cc-mint px-3 py-2.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-cc-mint text-cc-lime">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
        <div>
          <p className="text-[10px] font-bold text-cc-forest leading-tight">AI tip</p>
          <p className="text-[10px] text-cc-muted leading-snug mt-0.5">
            Skip 2 cafe runs, save Rs 900
          </p>
        </div>
      </div>
    </div>
  );
}
===== END OLD InsightChip ===== */

/* ===== OLD: DeviceShowcase (kept for reference — do not delete) =====
const HERO_TXS = [
  { name: 'Campus Cafe', amt: -450, Icon: Coffee, tone: 'bg-[#FFE8DC] text-[#C45C2A]' },
  { name: 'Allowance', amt: 40000, Icon: Gift, tone: 'bg-[#D8F0DC] text-[#2F7A45]' },
  { name: 'Bus Pass', amt: -200, Icon: Bus, tone: 'bg-[#DCE6F8] text-[#3B5B9C]' },
];


function PhoneScreen() {
  return (
    <div className="bg-[#F7FBF8] h-full overflow-hidden flex flex-col">
      <div className="relative bg-linear-to-b from-cc-forest to-[#0f4a38] px-2.5 pt-2 pb-3 text-white shrink-0">
        <div className="flex items-center justify-between text-[7px] text-white/70 mb-2">
          <span className="font-semibold">9:41</span>
          <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-10 h-3 bg-black/45 rounded-full" />
          <span className="font-medium">5G</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[8px] text-white/65 leading-none">Good morning</p>
            <p className="text-[11px] font-bold tracking-tight mt-0.5">Ayesha</p>
          </div>
          <div className="w-6 h-6 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
            <User className="w-3 h-3 text-white/90" />
          </div>
        </div>
        <div className="rounded-lg bg-white/10 border border-white/15 p-2">
          <p className="text-[6px] font-semibold uppercase tracking-wider text-white/55">Balance (PKR)</p>
          <p className="text-[15px] font-extrabold tracking-tight leading-none mt-0.5">{formatPkr(124050)}</p>
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex-1 h-0.5 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full w-[62%] rounded-full bg-cc-lime" />
            </div>
            <p className="text-[7px] text-cc-lime font-semibold">+{formatPkr(4200)}</p>
          </div>
        </div>
      </div>
      <div className="px-2 pt-2 flex-1 min-h-0 space-y-0.5 overflow-hidden">
        <div className="flex items-center justify-between mb-1 px-0.5">
          <p className="text-[7px] font-bold text-cc-muted uppercase tracking-wider">Recent</p>
          <span className="text-[7px] font-semibold text-cc-lime">View all</span>
        </div>
        {HERO_TXS.map((row) => (
          <div key={`phone-${row.name}`} className="flex items-center justify-between py-1 px-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className={`w-6 h-6 rounded-md ${row.tone} flex items-center justify-center shrink-0`}>
                <row.Icon className="w-2.5 h-2.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-semibold text-cc-ink truncate leading-tight">{row.name}</p>
                <p className="text-[6px] text-cc-muted">{row.amt > 0 ? 'Income' : 'Expense'}</p>
              </div>
            </div>
            <span className={`text-[8px] font-bold tabular-nums shrink-0 ${row.amt > 0 ? 'text-cc-lime-dark' : 'text-cc-ink'}`}>
              {formatPkr(row.amt, { signed: true })}
            </span>
          </div>
        ))}
      </div>
      <div className="mx-1.5 mb-1.5 mt-auto flex justify-around items-center rounded-lg bg-white border border-cc-mint py-1 shrink-0">
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-cc-forest text-white">
          <Wallet className="w-2.5 h-2.5" />
        </span>
        <BarChart3 className="w-2.5 h-2.5 text-cc-muted" />
        <Lightbulb className="w-2.5 h-2.5 text-cc-muted" />
        <Smartphone className="w-2.5 h-2.5 text-cc-muted" />
      </div>
    </div>
  );
}


function DesktopScreen() {
  return (
    <div className="bg-[#F0FAF2] h-full w-full overflow-hidden flex flex-col text-left">
      
      <div className="flex items-center gap-2 px-3.5 py-2 bg-white border-b border-cc-mint shrink-0">
        <Logo size="sm" className="scale-75 origin-left -mr-1" />
        <span className="text-[10px] font-semibold text-cc-muted ml-auto">Dashboard</span>
        <div className="w-6 h-6 rounded-full bg-cc-mint flex items-center justify-center">
          <User className="w-3 h-3 text-cc-forest" />
        </div>
      </div>

      <div className="flex-1 p-3 grid grid-cols-[1.1fr_1fr] gap-2.5 min-h-0">
        
        <div className="rounded-xl bg-linear-to-br from-cc-forest to-[#0f4a38] text-white p-3 flex flex-col justify-between min-h-0">
          <div>
            <p className="text-[9px] text-white/60">Good morning</p>
            <p className="text-[13px] font-bold">Ayesha</p>
          </div>
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-wider text-white/50 mb-0.5">Balance (PKR)</p>
            <p className="text-[1.35rem] font-extrabold tracking-tight leading-none">{formatPkr(124050)}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex-1 h-1 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full w-[62%] rounded-full bg-cc-lime" />
              </div>
              <span className="text-[8px] text-cc-lime font-semibold">+{formatPkr(4200)}</span>
            </div>
          </div>
        </div>

        
        <div className="rounded-xl bg-white border border-cc-mint p-2.5 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[8px] font-bold text-cc-muted uppercase tracking-wider">Recent</p>
            <span className="text-[8px] font-semibold text-cc-lime">View all</span>
          </div>
          <div className="space-y-1 flex-1 overflow-hidden">
            {HERO_TXS.map((row) => (
              <div key={`desk-${row.name}`} className="flex items-center justify-between gap-1 py-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`w-6 h-6 rounded-lg ${row.tone} flex items-center justify-center shrink-0`}>
                    <row.Icon className="w-3 h-3" />
                  </div>
                  <p className="text-[9px] font-semibold text-cc-ink truncate">{row.name}</p>
                </div>
                <span className={`text-[9px] font-bold tabular-nums shrink-0 ${row.amt > 0 ? 'text-cc-lime-dark' : 'text-cc-ink'}`}>
                  {formatPkr(row.amt, { signed: true })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MonitorMockup() {
  return (
    <div className="relative w-[280px] sm:w-[360px] lg:w-[400px]">
      
      <div className="rounded-lg sm:rounded-xl bg-[#1a2e28] p-1.5 sm:p-2 shadow-[0_28px_60px_-16px_rgba(11,61,46,0.55)]">
        <div className="rounded-md sm:rounded-lg overflow-hidden bg-[#F0FAF2] aspect-video w-full">
          <DesktopScreen />
        </div>
      </div>
      
      <div className="mx-auto w-3 sm:w-3.5 h-4 sm:h-5 bg-[#1a2e28]" />
      <div className="mx-auto w-24 sm:w-28 h-1.5 bg-[#243d34] rounded-full shadow-sm" />
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative w-[92px] sm:w-[108px]">
      <div className="relative rounded-[1.25rem] sm:rounded-[1.4rem] bg-linear-to-b from-[#243d34] via-cc-forest to-[#062820] p-[2.5px] shadow-[0_18px_40px_-8px_rgba(11,61,46,0.55)]">
        <div className="rounded-[1.1rem] sm:rounded-[1.25rem] overflow-hidden aspect-9/19 bg-[#F7FBF8]">
          <PhoneScreen />
        </div>
      </div>
    </div>
  );
}

function DeviceShowcase() {
  return (
    <div className="relative mx-auto inline-flex items-end">
      <div className="absolute -inset-10 bg-linear-to-br from-cc-lime/20 via-cc-forest/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-0 animate-float">
        <MonitorMockup />
      </div>
      
      <div className="absolute -right-5 sm:-right-7 bottom-0 z-10 animate-float-alt">
        <PhoneMockup />
      </div>
    </div>
  );
}

===== END OLD DeviceShowcase ===== */

function HeroDashboard() {
  const { t } = useTranslation();
  return (
    <div className="relative w-full max-w-[420px] mx-auto lg:ml-auto pt-10 pb-8 sm:pt-12 sm:pb-10">
      <div className="absolute -inset-8 bg-linear-to-br from-cc-lime/20 via-cc-forest/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -top-1 left-0 sm:-left-6 z-20 max-w-[230px] animate-float-alt">
        <div className="bg-white rounded-xl shadow-[0_12px_30px_-8px_rgba(11,61,46,0.22)] border border-cc-mint px-3.5 py-3 border-t-[3px] border-t-cc-lime">
          <div className="flex items-center gap-1.5 mb-1">
            <Bot className="w-3.5 h-3.5 text-cc-lime" />
            <p className="text-[11px] font-bold text-cc-lime">{t('home.aiInsightLabel')}</p>
          </div>
          <p className="text-[11px] text-cc-muted leading-snug" dir="auto">
            {t('home.aiInsightBody')}
          </p>
        </div>
      </div>

      <div className="relative z-10 bg-white rounded-[1.75rem] border border-gray-100 shadow-[0_28px_60px_-18px_rgba(11,61,46,0.35)] p-4 sm:p-5 animate-float">
        <div className="flex justify-end mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wide bg-cc-mint text-cc-forest px-2.5 py-1 rounded-full">
            {t('home.activeMonth')}
          </span>
        </div>

        <div className="rounded-2xl bg-linear-to-br from-cc-forest to-[#0f4a38] text-white p-4 sm:p-5 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] text-white/65">{t('home.currentBalance')}</p>
              <p className="text-[1.85rem] sm:text-[2rem] font-extrabold tracking-tight leading-none mt-1">
                {formatPkr(34250)}
              </p>
            </div>
            <Wallet className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
          </div>
          <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-white/55">{t('home.monthlyIncome')}</p>
              <p className="text-sm font-bold text-cc-lime mt-0.5">{formatPkr(65000, { signed: true })}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/55">{t('home.totalSpent')}</p>
              <p className="text-sm font-bold mt-0.5">{formatPkr(-30750, { signed: true })}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3.5 mb-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <p className="text-[12px] font-semibold text-cc-ink">{t('home.foodCanteen')}</p>
              <p className="text-[11px] font-bold text-[#C45C2A] tabular-nums">{t('home.foodCap')}</p>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-[72%] rounded-full bg-linear-to-r from-[#F5A623] to-[#E85D4C]" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <p className="text-[12px] font-semibold text-cc-ink">{t('home.academicsBooks')}</p>
              <p className="text-[11px] font-bold text-cc-lime-dark tabular-nums">{t('home.academicsCap')}</p>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-[35%] rounded-full bg-linear-to-r from-cc-lime to-cc-forest" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-cc-muted">{t('home.recentLogs')}</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cc-lime">
            <Plus className="w-3.5 h-3.5" /> {t('home.addNew')}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2.5 rounded-xl bg-[#F4F7F5] px-3 py-2.5">
            <div className="w-9 h-9 rounded-full bg-[#D8F0DC] text-[#2F7A45] flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-cc-ink truncate">{t('home.monthlyAllowance')}</p>
              <p className="text-[10px] text-cc-muted">{t('home.incomeParent')}</p>
            </div>
            <span className="text-[13px] font-bold text-cc-lime-dark tabular-nums shrink-0">
              {formatPkr(40000, { signed: true })}
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-[#F4F7F5] px-3 py-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FFE8DC] text-[#C45C2A] flex items-center justify-center shrink-0">
              <Coffee className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-cc-ink truncate">{t('home.campusCafe')}</p>
              <p className="text-[10px] text-cc-muted">{t('home.foodAiTagged')}</p>
            </div>
            <span className="text-[13px] font-bold text-[#C45C2A] tabular-nums shrink-0">
              {formatPkr(-450, { signed: true })}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-1 right-0 sm:-right-4 z-20 animate-float-alt">
        <div className="flex items-center gap-2.5 bg-white rounded-xl shadow-[0_12px_30px_-8px_rgba(11,61,46,0.22)] border border-cc-mint pl-3 pr-4 py-2.5 border-r-[3px] border-r-cc-lime">
          <div className="w-9 h-9 rounded-full bg-cc-mint text-cc-lime flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-cc-muted">{t('home.monthlyGoal')}</p>
            <p className="text-[12px] font-bold text-cc-ink mt-0.5">{t('home.goalMet')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { openChat } = useApp();
  const [openFaq, setOpenFaq] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="animate-fade-in">
      
      <section className="relative overflow-hidden bg-linear-to-br from-cc-mint-soft via-cc-cream to-cc-mint pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="absolute top-20 right-0 w-96 h-96 bg-cc-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cc-forest/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-6 text-center lg:text-left relative z-10">
            <span className="inline-flex items-center gap-2 bg-cc-mint text-cc-forest text-xs font-bold px-4 py-1.5 rounded-full border border-cc-lime/30">
              <Sparkles className="w-3.5 h-3.5 text-cc-lime" /> {t('home.badge')}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.15] tracking-tight">
              <span className="text-cc-forest">{t('home.headline1')}</span>{' '}
              <span className="text-cc-lime">{t('home.headline2')}</span>
              <br />
              <span className="text-cc-lime">{t('home.headline3')}</span>
            </h1>
            <p className="text-cc-muted text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {t('home.sub')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Button onClick={() => navigate('/register')} className="rounded-full! px-7! py-3.5! w-full sm:w-auto">
                {t('common.getStartedFree')} <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full! px-7! py-3.5! w-full sm:w-auto"
                onClick={() => navigate('/how-it-works')}
              >
                {t('common.seeHowItWorks')}
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-4 text-xs sm:text-sm text-cc-muted font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cc-lime" /> {t('home.noBank')}
              </div>
              <div className="flex items-center gap-2">
                <Tags className="w-4 h-4 text-cc-lime" /> {t('home.studentCats')}
              </div>
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cc-lime" /> {t('home.aiInsights')}
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end items-center overflow-visible px-2 sm:px-4">
            {/* OLD DeviceShowcase — kept, not removed
            <DeviceShowcase />
            <p className="absolute -bottom-1 right-4 sm:right-10 hidden sm:block font-hand text-[1.75rem] leading-none text-cc-forest/70 -rotate-2 select-none pointer-events-none">
              Better habits, brighter future
            </p>
            */}
            <HeroDashboard />
          </div>
        </div>
      </section>

      
      <section className="border-y border-gray-100 bg-white py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-cc-muted">
            {t('home.trust')}
          </p>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max animate-marquee gap-x-12 sm:gap-x-16 text-cc-forest/40 font-extrabold text-lg sm:text-xl tracking-tight whitespace-nowrap hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, loop) => (
              <div key={loop} className="flex items-center gap-x-12 sm:gap-x-16 shrink-0 px-6">
                {['Northbridge U', 'Greenfield State', 'Metro Tech', 'Riverdale College', 'Summit Institute'].map((name) => (
                  <span key={`${loop}-${name}`} className="hover:text-cc-forest/70 transition">
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-14 bg-cc-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: '12k+', labelKey: 'home.statStudents' },
            { value: 'Rs 1.2B', labelKey: 'home.statExpenses' },
            { value: '38%', labelKey: 'home.statReduced' },
            { value: '4.9★', labelKey: 'home.statRating' },
          ].map((s) => (
            <div key={s.labelKey}>
              <p className="text-3xl sm:text-4xl font-extrabold text-cc-lime">{s.value}</p>
              <p className="text-sm text-white/65 mt-1">{t(s.labelKey)}</p>
            </div>
          ))}
        </div>
      </section>

      
      <section className="py-20 lg:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-cc-mint rounded-4xl -rotate-2" />
            <img
              src={IMG.study}
              alt="Students collaborating on campus"
              className="relative rounded-[1.75rem] w-full h-90 sm:h-110 object-cover shadow-xl"
            />
            <div className="absolute -bottom-5 -right-2 sm:right-6 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cc-mint flex items-center justify-center">
                <Target className="w-5 h-5 text-cc-lime" />
              </div>
              <div>
                <p className="text-xs text-cc-muted">{t('home.savingsMonth')}</p>
                <p className="font-extrabold text-cc-forest">Rs 9,300 of Rs 10,000</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-5">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">{t('home.madeFor')}</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest leading-tight">
              {t('home.allowanceTitle')}
            </h2>
            <p className="text-cc-muted leading-relaxed text-base sm:text-lg">
              {t('home.allowanceBody')}
            </p>
            <ul className="space-y-3">
              {[
                t('home.bullet1'),
                t('home.bullet2'),
                t('home.bullet3'),
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-cc-ink font-medium">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-cc-mint text-cc-lime flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Button className="rounded-full! mt-2" onClick={() => navigate('/register')}>
              {t('common.createFreeAccount')} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      
      <section id="features" className="py-20 bg-cc-mint-soft scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">{t('home.featuresEyebrow')}</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">
              {t('home.featuresTitle')}
            </h2>
            <p className="text-cc-muted mt-3">
              {t('home.featuresSub')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = iconMap[f.icon];
              return (
                <div
                  key={f.id}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-cc-lime/30 transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cc-mint text-cc-lime flex items-center justify-center mb-4 group-hover:bg-cc-lime group-hover:text-white transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-cc-forest mb-2">{t(f.titleKey)}</h3>
                  <p className="text-sm text-cc-muted leading-relaxed">{t(f.descKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      
      <section className="py-20 lg:py-28 bg-white space-y-24 lg:space-y-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 text-cc-lime text-xs font-bold tracking-widest uppercase">
              <BarChart3 className="w-4 h-4" /> {t('home.visualEyebrow')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest leading-tight">
              {t('home.visualTitle')}
            </h2>
            <p className="text-cc-muted text-base sm:text-lg leading-relaxed">
              {t('home.visualBody')}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {[t('home.tagTrends'), t('home.tagPie'), t('home.tagBars')].map((tag) => (
                <span key={tag} className="text-xs font-semibold bg-cc-mint text-cc-forest px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src={IMG.laptop}
              alt="Student reviewing finances on laptop"
              className="rounded-[1.75rem] w-full h-80 sm:h-100 object-cover shadow-xl"
            />
            <div className="absolute inset-0 rounded-[1.75rem] bg-linear-to-t from-cc-forest/50 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
              <p className="text-xs font-bold text-cc-muted uppercase tracking-wide mb-2">{t('home.incomeVsExpense')}</p>
              <div className="flex items-end gap-2 h-16">
                {[40, 55, 48, 70, 62, 45].map((h, i) => (
                  <div key={i} className="flex-1 flex gap-0.5 items-end h-full">
                    <div className="flex-1 bg-cc-lime/70 rounded-t" style={{ height: `${h}%` }} />
                    <div className="flex-1 bg-cc-forest/40 rounded-t" style={{ height: `${h * 0.75}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <img
              src={IMG.cafe}
              alt="Student studying with coffee"
              className="rounded-[1.75rem] w-full h-80 sm:h-100 object-cover shadow-xl"
            />
            <div className="absolute top-5 left-5 bg-white rounded-2xl shadow-lg px-4 py-3 max-w-50">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="w-4 h-4 text-cc-lime" />
                <span className="text-xs font-bold text-cc-forest">{t('home.aiInsightShort')}</span>
              </div>
              <p className="text-xs text-cc-muted leading-relaxed" dir="auto">
                {t('home.aiInsightCafe')}
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-4">
            <span className="inline-flex items-center gap-2 text-cc-lime text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4" /> {t('home.aiEyebrow')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest leading-tight">
              {t('home.aiTitle')}
            </h2>
            <p className="text-cc-muted text-base sm:text-lg leading-relaxed">
              {t('home.aiBody')}
            </p>
            <ul className="space-y-2.5 pt-1">
              {[
                t('home.aiBullet1'),
                t('home.aiBullet2'),
                t('home.aiBullet3'),
              ].map((tip) => (
                <li key={tip} className="flex items-center gap-2 text-sm font-medium text-cc-ink">
                  <Zap className="w-4 h-4 text-cc-lime shrink-0" /> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      
      <section id="how-it-works" className="py-20 bg-cc-mint-soft scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">{t('home.howEyebrow')}</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2 mb-8">
                {t('home.howTitle')}
              </h2>
              <div className="space-y-6">
                {[
                  { n: '1', title: t('howItWorks.steps.1.title'), desc: t('howItWorks.steps.1.desc') },
                  { n: '2', title: t('howItWorks.steps.2.title'), desc: t('howItWorks.steps.2.desc') },
                  { n: '3', title: t('howItWorks.steps.3.title'), desc: t('howItWorks.steps.3.desc') },
                ].map((s) => (
                  <div key={s.n} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-cc-forest text-white font-bold flex items-center justify-center shrink-0">
                      {s.n}
                    </div>
                    <div>
                      <h3 className="font-bold text-cc-forest">{s.title}</h3>
                      <p className="text-sm text-cc-muted mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-8 rounded-full!" onClick={() => navigate('/register')}>
                {t('common.startTracking')} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-cc-lime" />
                  <span className="ml-2 text-xs text-cc-muted font-medium">{t('home.dashboardTitle')}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-cc-mint rounded-xl p-4 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-8 border-cc-lime border-t-cc-forest flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-[10px] text-cc-muted">{t('home.spent')}</p>
                        <p className="font-extrabold text-cc-forest">Rs 28,250</p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-cc-forest mt-2">{t('home.spendingOverview')}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-cc-muted uppercase">{t('home.recent')}</p>
                    {[t('home.txFood'), t('home.txTransport'), t('home.txAcademics')].map((r) => (
                      <div key={r} className="bg-gray-50 rounded-lg px-3 py-2 text-xs font-medium text-cc-ink">
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-2 sm:-right-6 bg-white rounded-2xl shadow-lg border border-cc-lime/30 p-4 max-w-55 animate-float">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-cc-lime" />
                  <span className="text-xs font-bold text-cc-forest">{t('home.aiInsightShort')}</span>
                </div>
                <p className="text-xs text-cc-muted leading-relaxed" dir="auto">
                  {t('home.aiInsightWeek')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section id="for-you" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">{t('home.forYouEyebrow')}</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">
              {t('home.forYouTitle')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: GraduationCap, title: t('home.undergrads'), desc: t('home.undergradsDesc'), img: IMG.walk },
              { icon: Coffee, title: t('home.hostel'), desc: t('home.hostelDesc'), img: IMG.friends },
              { icon: Bus, title: t('home.commuters'), desc: t('home.commutersDesc'), img: IMG.campus },
              { icon: BookOpen, title: t('home.partTimers'), desc: t('home.partTimersDesc'), img: IMG.library },
            ].map((item) => (
              <div key={item.title} className="group relative overflow-hidden rounded-2xl h-70">
                <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-cc-forest via-cc-forest/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <item.icon className="w-6 h-6 text-cc-lime mb-2" />
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-white/75 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-cc-mint-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">{t('home.campusEyebrow')}</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">
                {t('home.campusTitle')}
              </h2>
            </div>
            <p className="text-sm text-cc-muted max-w-sm">
              {t('home.campusSub')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { src: IMG.campus, alt: 'University campus', pos: 'object-center' },
              { src: IMG.friends, alt: 'Friends hanging out', pos: 'object-center' },
              { src: IMG.library, alt: 'Library study', pos: 'object-center' },
              { src: IMG.cafe, alt: 'Cafe studying', pos: 'object-[center_30%]' },
              { src: IMG.study, alt: 'Group project', pos: 'object-center' },
              { src: IMG.laptop, alt: 'Laptop work', pos: 'object-center' },
            ].map((img) => (
              <div key={img.alt} className="rounded-2xl overflow-hidden aspect-[4/3] bg-cc-mint">
                <img
                  src={img.src}
                  alt={img.alt}
                  className={`w-full h-full object-cover ${img.pos}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: t('home.trustNoBank'), desc: t('home.trustNoBankDesc') },
              { icon: ShieldCheck, title: t('home.trustPrivate'), desc: t('home.trustPrivateDesc') },
              { icon: Users, title: t('home.trustStudents'), desc: t('home.trustStudentsDesc') },
            ].map((item) => (
              <div key={item.title} className="text-center px-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-cc-mint text-cc-lime flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-cc-forest text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-cc-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section id="pricing" className="py-20 bg-cc-mint-soft scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">{t('home.pricingEyebrow')}</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">{t('home.pricingTitle')}</h2>
            <p className="text-cc-muted mt-3 max-w-xl mx-auto">
              {t('home.pricingSub')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {[
              { id: 'starter', price: 'Rs 0', highlight: false },
              { id: 'student', price: 'Rs 499', highlight: true },
              { id: 'pro', price: 'Rs 999', highlight: false },
            ].map((plan) => {
              const badge = t(`pricing.plans.${plan.id}.badge`);
              const perks = t(`pricing.plans.${plan.id}.perks`, { returnObjects: true });
              return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-7 sm:p-8 flex flex-col ${
                  plan.highlight
                    ? 'border-2 border-cc-lime/50 shadow-xl md:-translate-y-1'
                    : 'border border-gray-100 shadow-sm'
                }`}
              >
                {badge ? (
                  <div
                    className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
                      plan.highlight ? 'bg-cc-lime text-white' : 'bg-cc-mint text-cc-forest'
                    }`}
                  >
                    {badge}
                  </div>
                ) : null}
                <p className="text-sm font-bold text-cc-lime uppercase tracking-wide pr-20">{t(`pricing.plans.${plan.id}.name`)}</p>
                <p className="mt-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-cc-forest">{plan.price}</span>
                  <span className="text-cc-muted ml-2 text-sm">{t(`pricing.plans.${plan.id}.period`)}</span>
                </p>
                <ul className="mt-7 space-y-3 flex-1">
                  {(Array.isArray(perks) ? perks : []).map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-cc-ink font-medium">
                      <Check className="w-5 h-5 text-cc-lime shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlight ? 'primary' : 'outline'}
                  className="w-full rounded-full! mt-8 py-3.5!"
                  onClick={() => navigate('/register')}
                >
                  {t(`pricing.plans.${plan.id}.cta`)} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      
      <section id="testimonials" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">{t('home.testimonialsEyebrow')}</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">{t('home.testimonialsTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <img src={item.avatar} alt={item.name} className="w-14 h-14 rounded-full object-cover mb-4 ring-2 ring-cc-mint" />
                <p className="text-sm text-cc-muted italic leading-relaxed mb-4">&ldquo;{t(item.quoteKey)}&rdquo;</p>
                <p className="font-bold text-cc-forest">{item.name}</p>
                <p className="text-xs text-cc-muted mb-2">{t(item.roleKey)}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-cc-lime text-cc-lime" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="relative h-95 sm:h-110 overflow-hidden">
        <img src={IMG.walk} alt="Campus graduation moment" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-cc-forest/75" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold max-w-2xl leading-tight">
            {t('home.ctaTitle')}
          </h2>
          <p className="mt-4 text-white/80 max-w-lg">
            {t('home.ctaSub')}
          </p>
          <Button variant="white" className="rounded-full! px-8! mt-8" onClick={() => navigate('/register')}>
            {t('home.joinCampus')} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      
      <section id="faq" className="py-20 bg-cc-mint-soft scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">{t('home.faqEyebrow')}</span>
            <h2 className="text-3xl font-extrabold text-cc-forest mt-2">{t('home.faqTitle')}</h2>
            <button
              type="button"
              onClick={openChat}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cc-forest hover:text-cc-lime transition"
            >
              <MessageCircle className="w-4 h-4" />
              {t('home.faqChatCta')}
            </button>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-cc-forest"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  {t(item.qKey)}
                  <ChevronDown className={`w-5 h-5 text-cc-lime transition ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-cc-muted leading-relaxed animate-fade-in">{t(item.aKey)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-cc-forest">{t('home.newsletterTitle')}</h2>
          <p className="text-cc-muted mt-2 text-sm sm:text-base">
            {t('home.newsletterSub')}
          </p>
          {subscribed ? (
            <p className="mt-6 text-cc-lime font-semibold flex items-center justify-center gap-2">
              <Check className="w-5 h-5" /> {t('common.subscribedThanks')}
            </p>
          ) : (
            <form
              className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubscribed(true);
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@campus.edu"
                className="flex-1 px-4 py-3 rounded-full border border-gray-200 text-sm outline-none focus:border-cc-lime"
              />
              <Button type="submit" className="rounded-full! px-6!">
                {t('home.subscribe')}
              </Button>
            </form>
          )}
        </div>
      </section>

      
      <section className="py-16 bg-cc-mint-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-cc-forest rounded-3xl px-6 sm:px-10 py-10 flex flex-col lg:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-cc-lime/10 rounded-full blur-3xl" />
            <Logo dark size="lg" className="shrink-0" />
            <div className="flex-1 text-center lg:text-left relative z-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{t('home.readyTitle')}</h3>
              <p className="text-white/70 mt-2 text-sm sm:text-base">
                {t('home.readySub')}
              </p>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <Button variant="white" className="rounded-full! px-8!" onClick={() => navigate('/register')}>
                {t('common.getStartedFree')} <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="font-hand text-xl text-cc-lime hidden sm:block">{t('home.smallSteps')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
