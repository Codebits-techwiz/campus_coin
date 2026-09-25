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
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { features, testimonials, faqItems } from '../../data/mockData';
import { formatPkr } from '../../utils/currency';

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
  library: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5040?auto=format&fit=crop&w=1200&q=80',
  walk: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
  phone: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80',
};

function PhoneMockup() {
  const txs = [
    { name: 'Campus Cafe', amt: -450, Icon: Coffee, tone: 'bg-[#FFE8DC] text-[#C45C2A]' },
    { name: 'Allowance', amt: 40000, Icon: Gift, tone: 'bg-[#D8F0DC] text-[#2F7A45]' },
    { name: 'Bus Pass', amt: -200, Icon: Bus, tone: 'bg-[#DCE6F8] text-[#3B5B9C]' },
  ];

  return (
    <div className="relative mx-auto w-[262px] sm:w-[286px] animate-float">
      <div className="absolute -inset-12 bg-gradient-to-br from-cc-lime/30 via-cc-forest/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Phone bezel */}
      <div className="relative rounded-[2.6rem] bg-gradient-to-b from-[#243d34] via-[#0B3D2E] to-[#062820] p-[3px] shadow-[0_32px_70px_-14px_rgba(11,61,46,0.6)]">
        <div className="rounded-[2.45rem] bg-[#F7FBF8] overflow-hidden">
          {/* Status bar */}
          <div className="relative bg-gradient-to-b from-cc-forest to-[#0f4a38] px-5 pt-3.5 pb-6 text-white">
            <div className="flex items-center justify-between text-[10px] text-white/70 mb-4 px-0.5">
              <span className="font-semibold tracking-wide">9:41</span>
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[72px] h-[22px] bg-black/45 rounded-full shadow-inner" />
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
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/55">Balance · PKR</p>
                <span className="text-[9px] font-bold text-cc-lime bg-cc-lime/15 px-2 py-0.5 rounded-full">This month</span>
              </div>
              <p className="text-[1.7rem] font-extrabold tracking-tight leading-none mt-1.5">
                {formatPkr(124050)}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/15 overflow-hidden">
                  <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-cc-lime to-[#8fd98f]" />
                </div>
                <p className="text-[10px] text-cc-lime font-semibold whitespace-nowrap">+{formatPkr(4200)}</p>
              </div>
            </div>
          </div>

          {/* Recent list */}
          <div className="px-4 pt-4 pb-1 space-y-1">
            <div className="flex items-center justify-between mb-2 px-0.5">
              <p className="text-[10px] font-bold text-cc-muted uppercase tracking-[0.12em]">Recent</p>
              <span className="text-[10px] font-semibold text-cc-lime">View all</span>
            </div>
            {txs.map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between py-2.5 px-2 rounded-xl hover:bg-white/80 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl ${row.tone} flex items-center justify-center shadow-sm shrink-0`}>
                    <row.Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-cc-ink truncate">{row.name}</p>
                    <p className="text-[10px] text-cc-muted">{row.amt > 0 ? 'Income' : 'Expense'}</p>
                  </div>
                </div>
                <span
                  className={`text-[12px] font-bold tabular-nums shrink-0 ${
                    row.amt > 0 ? 'text-cc-lime-dark' : 'text-cc-ink'
                  }`}
                >
                  {formatPkr(row.amt, { signed: true })}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom nav */}
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
    <div className="absolute -left-2 sm:-left-20 lg:-left-24 top-[42%] -translate-y-1/2 w-[190px] sm:w-[210px] bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_-15px_rgba(11,61,46,0.28)] border border-white p-4 animate-float-alt z-20">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-extrabold text-cc-forest">Monthly Spending</p>
        <span className="text-[9px] font-bold text-cc-lime bg-cc-mint px-2 py-0.5 rounded-full">-12%</span>
      </div>
      <div className="flex items-end gap-1.5 h-[72px] mb-3.5 px-0.5">
        {bars.map((b, i) => (
          <div key={`${b.label}-${i}`} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <div
              className={`w-full rounded-t-md transition-all ${b.active ? 'bg-gradient-to-t from-cc-forest to-cc-lime shadow-sm' : 'bg-gradient-to-t from-cc-lime/50 to-cc-lime/85'}`}
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

function InsightChip() {
  return (
    <div className="absolute -right-1 sm:right-0 top-8 sm:top-10 z-20 animate-float-alt max-w-[168px]">
      <div className="flex items-start gap-2 bg-white rounded-2xl shadow-[0_12px_32px_-8px_rgba(11,61,46,0.22)] border border-cc-mint px-3 py-2.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-cc-mint text-cc-lime">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
        <div>
          <p className="text-[10px] font-bold text-cc-forest leading-tight">AI tip</p>
          <p className="text-[10px] text-cc-muted leading-snug mt-0.5">
            Skip 2 cafe runs → save Rs 900
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cc-mint-soft via-white to-cc-mint pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="absolute top-20 right-0 w-96 h-96 bg-cc-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cc-forest/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-6 text-center lg:text-left relative z-10">
            <span className="inline-flex items-center gap-2 bg-cc-mint text-cc-forest text-xs font-bold px-4 py-1.5 rounded-full border border-cc-lime/30">
              <Sparkles className="w-3.5 h-3.5 text-cc-lime" /> Your Money
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.15] tracking-tight">
              <span className="text-cc-forest">Your</span>{' '}
              <span className="text-cc-lime">Rules.</span>
              <br />
              <span className="text-cc-lime">Your Rules</span>
            </h1>
            <p className="text-cc-muted text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Track allowance, expenses, and savings goals built for campus life — with AI insights that speak your language. No bank account required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Button onClick={() => navigate('/register')} className="!rounded-full !px-7 !py-3.5 w-full sm:w-auto">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="!rounded-full !px-7 !py-3.5 w-full sm:w-auto"
                onClick={() => navigate('/how-it-works')}
              >
                See how it works
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-4 text-xs sm:text-sm text-cc-muted font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cc-lime" /> No Bank Account Required
              </div>
              <div className="flex items-center gap-2">
                <Tags className="w-4 h-4 text-cc-lime" /> Student Focused Categories
              </div>
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cc-lime" /> AI Powered Insights
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end min-h-[460px] sm:min-h-[480px] items-center">
            <SpendingCard />
            <PhoneMockup />
            <InsightChip />
            <div className="absolute bottom-2 right-2 sm:right-8 text-right hidden sm:block">
              <p className="font-hand text-2xl text-cc-lime-dark leading-tight">Better habits</p>
              <p className="font-hand text-2xl text-cc-forest leading-tight">Brighter future →</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-gray-100 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-cc-muted mb-6">
            Built for campus life across universities
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-cc-forest/40 font-extrabold text-lg sm:text-xl tracking-tight">
            {['Northbridge U', 'Greenfield State', 'Metro Tech', 'Riverdale College', 'Summit Institute'].map((name) => (
              <span key={name} className="hover:text-cc-forest/70 transition">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-cc-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: '12k+', label: 'Students tracking' },
            { value: 'Rs 1.2B', label: 'Expenses logged' },
            { value: '38%', label: 'Avg. spend reduced' },
            { value: '4.9★', label: 'Student rating' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-extrabold text-cc-lime">{s.value}</p>
              <p className="text-sm text-white/65 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story + image */}
      <section className="py-20 lg:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-cc-mint rounded-[2rem] -rotate-2" />
            <img
              src={IMG.study}
              alt="Students collaborating on campus"
              className="relative rounded-[1.75rem] w-full h-[360px] sm:h-[440px] object-cover shadow-xl"
            />
            <div className="absolute -bottom-5 -right-2 sm:right-6 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cc-mint flex items-center justify-center">
                <Target className="w-5 h-5 text-cc-lime" />
              </div>
              <div>
                <p className="text-xs text-cc-muted">Savings this month</p>
                <p className="font-extrabold text-cc-forest">Rs 9,300 of Rs 10,000</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-5">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">Made for students</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest leading-tight">
              Your allowance deserves a better plan than a notes app
            </h2>
            <p className="text-cc-muted leading-relaxed text-base sm:text-lg">
              Campus Coin turns messy receipts, cafe runs, and part-time pay into a clear picture of where your money goes — so midterms don’t wreck your budget.
            </p>
            <ul className="space-y-3">
              {[
                'Categories that match real campus life',
                'Budgets that warn you before you overspend',
                'Tips written like a friend, not a bank',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-cc-ink font-medium">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-cc-mint text-cc-lime flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Button className="!rounded-full mt-2" onClick={() => navigate('/register')}>
              Create free account <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-cc-mint-soft scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">
              Everything You Need to Manage Your Money
            </h2>
            <p className="text-cc-muted mt-3">
              From quick logging to AI insights — one place for the full student money loop.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = iconMap[f.icon];
              return (
                <div
                  key={f.title}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-cc-lime/30 transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cc-mint text-cc-lime flex items-center justify-center mb-4 group-hover:bg-cc-lime group-hover:text-white transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-cc-forest mb-2">{f.title}</h3>
                  <p className="text-sm text-cc-muted leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature deep dives with images */}
      <section className="py-20 lg:py-28 bg-white space-y-24 lg:space-y-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 text-cc-lime text-xs font-bold tracking-widest uppercase">
              <BarChart3 className="w-4 h-4" /> Visual reports
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest leading-tight">
              See your month in one glance
            </h2>
            <p className="text-cc-muted text-base sm:text-lg leading-relaxed">
              Charts for income vs expense, category breakdowns, and budget progress — designed so you actually understand them between lectures.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {['Monthly trends', 'Category pie', 'Budget bars'].map((t) => (
                <span key={t} className="text-xs font-semibold bg-cc-mint text-cc-forest px-3 py-1.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src={IMG.laptop}
              alt="Student reviewing finances on laptop"
              className="rounded-[1.75rem] w-full h-[320px] sm:h-[400px] object-cover shadow-xl"
            />
            <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-t from-cc-forest/50 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
              <p className="text-xs font-bold text-cc-muted uppercase tracking-wide mb-2">Income vs Expense</p>
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
              className="rounded-[1.75rem] w-full h-[320px] sm:h-[400px] object-cover shadow-xl"
            />
            <div className="absolute top-5 left-5 bg-white rounded-2xl shadow-lg px-4 py-3 max-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="w-4 h-4 text-cc-lime" />
                <span className="text-xs font-bold text-cc-forest">AI Insight</span>
              </div>
              <p className="text-xs text-cc-muted leading-relaxed">
                Food delivery rose 40%. Cap it at Rs 2,000/week to save ~Rs 3,500.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-4">
            <span className="inline-flex items-center gap-2 text-cc-lime text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4" /> AI assistant
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest leading-tight">
              Insights that sound like campus, not corporate
            </h2>
            <p className="text-cc-muted text-base sm:text-lg leading-relaxed">
              Auto-suggest categories as you type. Get plain-language tips ranked by impact — pin the useful ones, dismiss the rest.
            </p>
            <ul className="space-y-2.5 pt-1">
              {[
                'Smart category suggestions while you type',
                'Monthly summaries you can actually read',
                'Tips you can pin for exam week',
              ].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm font-medium text-cc-ink">
                  <Zap className="w-4 h-4 text-cc-lime shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-cc-mint-soft scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">How It Works</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2 mb-8">
                Get Started in 3 Simple Steps
              </h2>
              <div className="space-y-6">
                {[
                  { n: '1', title: 'Create Your Account', desc: 'Sign up with your campus email and set your allowance baseline.' },
                  { n: '2', title: 'Add Your Transactions', desc: 'Quick-add income and expenses — AI suggests categories as you type.' },
                  { n: '3', title: 'See Your Insights', desc: 'Review charts, budgets, and plain-language saving tips every month.' },
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
              <Button className="mt-8 !rounded-full" onClick={() => navigate('/register')}>
                Start Tracking Now <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-cc-lime" />
                  <span className="ml-2 text-xs text-cc-muted font-medium">Campus Coin Dashboard</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-cc-mint rounded-xl p-4 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-8 border-cc-lime border-t-cc-forest flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-[10px] text-cc-muted">Spent</p>
                        <p className="font-extrabold text-cc-forest">Rs 28,250</p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-cc-forest mt-2">Spending Overview</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-cc-muted uppercase">Recent</p>
                    {['Food · Rs 450', 'Transport · Rs 200', 'Academics · Rs 3,500'].map((r) => (
                      <div key={r} className="bg-gray-50 rounded-lg px-3 py-2 text-xs font-medium text-cc-ink">
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-2 sm:-right-6 bg-white rounded-2xl shadow-lg border border-cc-lime/30 p-4 max-w-[220px] animate-float">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-cc-lime" />
                  <span className="text-xs font-bold text-cc-forest">AI Insight</span>
                </div>
                <p className="text-xs text-cc-muted leading-relaxed">
                  Food delivery rose 40% this month. Try a Rs 2,000 weekly cap to save ~Rs 3,500.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section id="for-you" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">Who it’s for</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">
              Whatever your campus hustle looks like
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: GraduationCap, title: 'Undergrads', desc: 'Track allowance, books, and weekend plans without the stress.', img: IMG.walk },
              { icon: Coffee, title: 'Hostel life', desc: 'Rent, laundry, shared groceries — keep fixed costs in check.', img: IMG.friends },
              { icon: Bus, title: 'Commuters', desc: 'Bus passes vs ride-shares: see what actually saves money.', img: IMG.campus },
              { icon: BookOpen, title: 'Part-timers', desc: 'Log gig pay and scholarships next to everyday spending.', img: IMG.library },
            ].map((item) => (
              <div key={item.title} className="group relative overflow-hidden rounded-2xl h-[280px]">
                <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-cc-forest via-cc-forest/50 to-transparent" />
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

      {/* Campus gallery */}
      <section className="py-20 bg-cc-mint-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">Campus life</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">
                Money habits that fit your semester
              </h2>
            </div>
            <p className="text-sm text-cc-muted max-w-sm">
              From library marathons to late-night cafe runs — Campus Coin keeps up.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <img src={IMG.campus} alt="University campus" className="rounded-2xl h-40 sm:h-56 w-full object-cover col-span-2" />
            <img src={IMG.friends} alt="Friends hanging out" className="rounded-2xl h-40 sm:h-56 w-full object-cover" />
            <img src={IMG.library} alt="Library study" className="rounded-2xl h-40 sm:h-56 w-full object-cover" />
            <img src={IMG.cafe} alt="Cafe studying" className="rounded-2xl h-40 sm:h-56 w-full object-cover" />
            <img src={IMG.study} alt="Group project" className="rounded-2xl h-40 sm:h-56 w-full object-cover" />
            <img src={IMG.laptop} alt="Laptop work" className="rounded-2xl h-40 sm:h-56 w-full object-cover col-span-2" />
          </div>
        </div>
      </section>

      {/* Security / trust */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: 'No bank linking', desc: 'Manual entry and optional CSV import. Your banking stays yours.' },
              { icon: ShieldCheck, title: 'Private by design', desc: 'You control what’s logged. Insights stay in your account.' },
              { icon: Users, title: 'Built with students', desc: 'Categories, tips, and flows shaped by real campus money habits.' },
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

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-cc-mint-soft scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">Simple. Student-friendly. Free.</h2>
            <p className="text-cc-muted mt-3 max-w-xl mx-auto">
              Start tracking today — no credit card, no trial countdown.
            </p>
          </div>
          <div className="max-w-lg mx-auto bg-white rounded-3xl border-2 border-cc-lime/40 shadow-xl p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide bg-cc-lime text-white px-3 py-1 rounded-full">
              Most popular
            </div>
            <p className="text-sm font-bold text-cc-lime uppercase tracking-wide">Student Free</p>
            <p className="mt-2">
              <span className="text-5xl font-extrabold text-cc-forest">Rs 0</span>
              <span className="text-cc-muted ml-2">/ forever</span>
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Unlimited transactions',
                'Budgets & alerts',
                'AI category suggestions',
                'Reports & insights',
                'Mobile-friendly web app',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-cc-ink font-medium">
                  <Check className="w-5 h-5 text-cc-lime shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button className="w-full !rounded-full mt-8 !py-3.5" onClick={() => navigate('/register')}>
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">What Our Students Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover mb-4 ring-2 ring-cc-mint" />
                <p className="text-sm text-cc-muted italic leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <p className="font-bold text-cc-forest">{t.name}</p>
                <p className="text-xs text-cc-muted mb-2">{t.role}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-cc-lime text-cc-lime" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-bleed image CTA */}
      <section className="relative h-[380px] sm:h-[440px] overflow-hidden">
        <img src={IMG.walk} alt="Campus graduation moment" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-cc-forest/75" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold max-w-2xl leading-tight">
            This semester, know where every rupee goes
          </h2>
          <p className="mt-4 text-white/80 max-w-lg">
            Join thousands of students building calmer money habits — one tap at a time.
          </p>
          <Button variant="white" className="!rounded-full !px-8 mt-8" onClick={() => navigate('/register')}>
            Join Campus Coin <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-cc-mint-soft scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">FAQ</span>
            <h2 className="text-3xl font-extrabold text-cc-forest mt-2">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={item.q} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-cc-forest"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  {item.q}
                  <ChevronDown className={`w-5 h-5 text-cc-lime transition ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-cc-muted leading-relaxed animate-fade-in">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-cc-forest">Get student money tips in your inbox</h2>
          <p className="text-cc-muted mt-2 text-sm sm:text-base">
            Short, practical advice — no spam, unsubscribe anytime.
          </p>
          {subscribed ? (
            <p className="mt-6 text-cc-lime font-semibold flex items-center justify-center gap-2">
              <Check className="w-5 h-5" /> You’re on the list — thanks!
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
              <Button type="submit" className="!rounded-full !px-6">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-cc-mint-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-cc-forest rounded-3xl px-6 sm:px-10 py-10 flex flex-col lg:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-cc-lime/10 rounded-full blur-3xl" />
            <Logo dark size="lg" className="shrink-0" />
            <div className="flex-1 text-center lg:text-left relative z-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to take control of your finances?</h3>
              <p className="text-white/70 mt-2 text-sm sm:text-base">
                Join Campus Coin today and start building smarter money habits — one transaction at a time.
              </p>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <Button variant="white" className="!rounded-full !px-8" onClick={() => navigate('/register')}>
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="font-hand text-xl text-cc-lime hidden sm:block">Small steps · Big goals →</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
