"use client";

import { TESTIMONIALS } from "@/mocks/testimonials";

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div className="w-80 flex-shrink-0 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-300 mx-3">
      <StarRating count={t.stars} />
      <p className="mt-3 text-[12px] text-zinc-650 leading-relaxed line-clamp-4">&ldquo;{t.quote}&rdquo;</p>
      <div className="mt-4 flex items-center gap-3 border-t border-zinc-100 pt-3">
        <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white text-[10px] font-bold">{t.initials}</span>
        </div>
        <div>
          <p className="text-xs font-bold text-zinc-800 font-heading">{t.name}</p>
          <p className="text-[10px] text-zinc-500">{t.role} · {t.company}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const row1 = TESTIMONIALS.slice(0, 4);
  const row2 = TESTIMONIALS.slice(4);

  return (
    <section id="testimonials" className="border-t border-zinc-200/60 bg-zinc-50/40 py-20 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12 text-center space-y-3">
        <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest font-mono">
          What developers say
        </span>
        <h2 className="text-3xl font-bold text-zinc-900 tracking-tight font-heading">
          Trusted by teams shipping faster
        </h2>
        <p className="text-sm text-zinc-555">
          Engineers and product teams across e-commerce, SaaS, and support platforms rely on RevGAPI.
        </p>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative">
        <div
          className="flex"
          style={{
            animation: "marquee-left 35s linear infinite",
            width: "max-content",
          }}
        >
          {[...row1, ...row1, ...row1].map((t, i) => (
            <TestimonialCard key={`r1-${i}`} t={t} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative mt-4">
        <div
          className="flex"
          style={{
            animation: "marquee-right 42s linear infinite",
            width: "max-content",
          }}
        >
          {[...row2, ...row2, ...row2].map((t, i) => (
            <TestimonialCard key={`r2-${i}`} t={t} />
          ))}
        </div>
      </div>

      {/* Overall rating badge */}
      <div className="mt-12 flex justify-center">
        <div className="inline-flex items-center gap-4 bg-white border border-zinc-200 rounded-2xl px-8 py-4 shadow-sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-zinc-900 font-mono">4.9</p>
            <StarRating count={5} />
          </div>
          <div className="w-px h-10 bg-zinc-200" />
          <div>
            <p className="text-xs font-bold text-zinc-800 font-heading">Average rating</p>
            <p className="text-[11px] text-zinc-500 font-medium">from 200+ developer reviews</p>
          </div>
          <div className="w-px h-10 bg-zinc-200" />
          <div className="text-center">
            <p className="text-3xl font-bold text-zinc-900 font-mono">98%</p>
            <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">would recommend</p>
          </div>
        </div>
      </div>
    </section>
  );
}
