import { Star } from 'lucide-react';
import { PageHero } from '../../components/PageHero';
import { testimonials } from '../../data/mockData';

export default function Testimonials() {
  return (
    <div className="animate-fade-in min-h-[70vh]">
      <PageHero
        eyebrow="Testimonials"
        title="What our students say"
        subtitle="Real feedback from students tracking campus life spending with Campus Coin in PKR."
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-cc-mint-soft/60 border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-cc-lime/30 transition"
              >
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover mb-4 ring-2 ring-cc-mint"
                />
                <p className="text-sm text-cc-muted italic leading-relaxed mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
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
    </div>
  );
}
