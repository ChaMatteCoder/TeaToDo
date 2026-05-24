import { Leaf, Quote } from 'lucide-react';
import type { DailyQuoteValue } from '../hooks/useDailyQuote';

interface DailyQuoteProps {
  quote: string | DailyQuoteValue;
}

export function DailyQuote({ quote }: DailyQuoteProps) {
  const quoteValue: DailyQuoteValue = typeof quote === 'string' ? { text: quote, source: 'local' } : quote;

  return (
    <section className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-[22px] border border-tea-900/10 bg-gradient-to-r from-oat/70 via-white/84 to-tea-100/55 px-6 py-5 text-center shadow-card">
      <Quote className="hidden text-clay/70 sm:block" size={24} />
      <p className="font-display text-lg italic leading-7 text-tea-900">
        {quoteValue.text}
        {quoteValue.author ? <span className="ml-2 text-base not-italic text-stone-500">— {quoteValue.author}</span> : null}
      </p>
      <Leaf className="hidden text-tea-500 sm:block" size={24} />
      {quoteValue.source === 'api' ? <span className="basis-full text-[11px] font-semibold text-stone-400">via QuotesDB</span> : null}
    </section>
  );
}
