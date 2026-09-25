import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Play,
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
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { features, testimonials, faqItems } from '../../data/mockData';

const iconMap = {
  wallet: Wallet,
  layout: LayoutGrid,
  sparkles: Sparkles,
  chart: BarChart3,
  lightbulb: Lightbulb,
  smartphone: Smartphone,
};

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px]">
      <div className="absolute -inset-6 bg-cc-lime/20 rounded-[3rem] blur-2xl" />
      <div className="relative bg-cc-ink rounded-[2.25rem] p-2.5 shadow-2xl border-4 border-cc-forest">
        <div className="bg-white rounded-[1.75rem] overflow-hidden">
          <div className="bg-cc-forest px-4 pt-6 pb-5 text-white">
            <p className="text-xs text-white/70">Good morning,</p>
            <p className="font-bold text-lg">Ayesha</p>
            <div className="mt-4 bg-white/10 rounded-2xl p-3 backdrop-blur">
              <p className="text-[10px] uppercase tracking-wide text-white/60">Balance</p>
              <p className="text-2xl font-extrabold">$1,240.50</p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs font-bold text-cc-muted uppercase tracking-wide">Recent</p>
            {[
              { name: 'Campus Cafe', amt: '-$12.50', color: 'bg-orange-100 text-orange-600' },
              { name: 'Allowance', amt: '+$800', color: 'bg-cc-mint text-cc-lime-dark' },
              { name: 'Bus Pass', amt: '-$12.00', color: 'bg-blue-100 text-blue-600' },
            ].map((row) => (
              <div key={row.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${row.color} flex items-center justify-center text-xs font-bold`}>
                    {row.name[0]}
                  </div>
                  <span className="font-medium text-cc-ink">{row.name}</span>
                </div>
                <span className="font-semibold text-cc-ink">{row.amt}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-around border-t border-gray-100 py-3 text-cc-muted">
            <Wallet className="w-5 h-5 text-cc-lime" />
            <BarChart3 className="w-5 h-5" />
            <Lightbulb className="w-5 h-5" />
            <Smartphone className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SpendingCard() {
  const bars = [
    { h: 40, label: 'M' },
    { h: 65, label: 'T' },
    { h: 45, label: 'W' },
    { h: 80, label: 'T' },
    { h: 55, label: 'F' },
    { h: 70, label: 'S' },
    { h: 35, label: 'S' },
  ];
  const cats = [
    { name: 'Food', pct: 42, color: 'bg-cc-lime' },
    { name: 'Transport', pct: 18, color: 'bg-cc-forest' },
    { name: 'Academics', pct: 22, color: 'bg-cc-gold' },
    { name: 'Other', pct: 18, color: 'bg-gray-300' },
  ];
  return (
    <div className="absolute -left-4 sm:-left-16 top-1/2 -translate-y-1/2 w-[200px] sm:w-[220px] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-float z-10">
      <p className="text-xs font-bold text-cc-forest mb-3">Monthly Spending</p>
      <div className="flex items-end gap-1.5 h-16 mb-3">
        {bars.map((b) => (
          <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t bg-cc-lime/80" style={{ height: `${b.h}%` }} />
            <span className="text-[9px] text-cc-muted">{b.label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        {cats.map((c) => (
          <div key={c.name} className="flex items-center gap-2 text-[10px]">
            <div className={`w-2 h-2 rounded-full ${c.color}`} />
            <span className="flex-1 text-cc-muted">{c.name}</span>
            <span className="font-semibold text-cc-ink">{c.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cc-mint-soft via-white to-cc-mint pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="absolute top-20 right-0 w-96 h-96 bg-cc-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cc-forest/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-6 text-center lg:text-left relative z-10">
            <span className="inline-flex items-center gap-2 bg-cc-mint text-cc-forest text-xs font-bold px-4 py-1.5 rounded-full border border-cc-lime/30">
              <Sparkles className="w-3.5 h-3.5 text-cc-lime" /> Smart Spending
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.15] tracking-tight">
              <span className="text-cc-forest">Smart</span>{' '}
              <span className="text-cc-lime">Spending,</span>
              <br />
              <span className="text-cc-lime">Student Style.</span>
            </h1>
            <p className="text-cc-muted text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Track allowance, expenses, and savings goals built for campus life — with AI insights that speak your language. No bank account required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Button onClick={() => navigate('/register')} className="!rounded-full !px-7 !py-3.5 w-full sm:w-auto">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="!rounded-full !px-7 !py-3.5 w-full sm:w-auto" onClick={() => navigate('/login')}>
                <Play className="w-4 h-4 fill-current" /> Watch Demo
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

          <div className="relative flex justify-center lg:justify-end min-h-[420px] items-center">
            <SpendingCard />
            <PhoneMockup />
            <div className="absolute -bottom-2 right-4 sm:right-12 text-right hidden sm:block">
              <p className="font-hand text-2xl text-cc-lime-dark leading-tight">Better habits</p>
              <p className="font-hand text-2xl text-cc-forest leading-tight">Brighter future →</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-cc-lime text-xs font-bold tracking-widest uppercase">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cc-forest mt-2">
              Everything You Need to Manage Your Money
            </h2>
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
                        <p className="font-extrabold text-cc-forest">$565</p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-cc-forest mt-2">Spending Overview</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-cc-muted uppercase">Recent</p>
                    {['Food · $45', 'Transport · $12', 'Academics · $65'].map((r) => (
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
                  Food delivery rose 40% this month. Try a $25 weekly cap to save ~$40.
                </p>
              </div>
            </div>
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

      {/* CTA Banner */}
      <section className="py-16 bg-white">
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
