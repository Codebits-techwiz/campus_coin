import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot } from 'lucide-react';
import { Button } from '../../components/Button';
import { PageHero } from '../../components/PageHero';

const steps = [
  {
    n: '1',
    title: 'Create Your Account',
    desc: 'Sign up with your campus email and set your monthly allowance baseline in PKR.',
  },
  {
    n: '2',
    title: 'Add Your Transactions',
    desc: 'Quick-add income and expenses — AI suggests categories as you type.',
  },
  {
    n: '3',
    title: 'See Your Insights',
    desc: 'Review charts, budgets, and plain-language saving tips every month.',
  },
];

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in min-h-[70vh]">
      <PageHero
        eyebrow="How It Works"
        title="Get started in 3 simple steps"
        subtitle="From signup to your first AI tip — Campus Coin keeps the flow simple for busy students."
      />

      <section className="py-16 sm:py-20 bg-cc-mint-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {steps.map((s) => (
                  <div key={s.n} className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-cc-forest text-white font-bold flex items-center justify-center shrink-0">
                      {s.n}
                    </div>
                    <div>
                      <h2 className="font-bold text-cc-forest">{s.title}</h2>
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
                        <p className="font-extrabold text-cc-forest text-sm">Rs 28,250</p>
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
              <div className="absolute -bottom-4 -right-2 sm:-right-6 bg-white rounded-2xl shadow-lg border border-cc-lime/30 p-4 max-w-[220px]">
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
    </div>
  );
}
