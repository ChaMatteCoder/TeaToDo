import { useEffect, useState } from 'react';

const FALLBACK_QUOTE = 'Assim como o chá, a produtividade é feita de presença e intenção.';
const STORAGE_KEY = 'teatodo.daily-quote.v3';
const QUOTE_API_URL = 'https://api.allorigins.win/raw?url=https%3A%2F%2Fquotes-db.vercel.app%2Fapi%2Frandom';
const PT_BR_QUOTES = [
  'Uma tarefa pequena também muda o rumo do dia.',
  'Calma não é lentidão; é direção sem ruído.',
  'Escolha o próximo passo, não a semana inteira.',
  'Consistência nasce quando o plano cabe na vida.',
  'Respire, organize, comece pelo essencial.',
  'Pausas bem cuidadas também fazem parte do trabalho.',
  'Hoje só precisa de um começo honesto.',
  'O melhor plano é aquele que você consegue continuar amanhã.',
  'Produtividade com presença também é cuidado.',
  'Comece pequeno, mas comece de verdade.',
  'Organizar o dia é abrir espaço para respirar.',
  'Uma escolha clara vale mais que dez urgências confusas.',
];

const EN_QUOTES = [
  'A small task can still change the direction of the day.',
  'Choose the next step, not the whole week.',
  'Consistency begins when the plan fits your life.',
];

export type DailyQuoteValue = {
  text: string;
  author?: string;
  source?: 'api' | 'local';
};

interface StoredQuote {
  date: string;
  language: string;
  quote: DailyQuoteValue;
}

type QuotesDbResponse = {
  quote?: string;
  author?: string;
  category?: string;
};

function fallbackForDate(dateKey: string, fallbackQuote: string, language: string): DailyQuoteValue {
  const daySeed = Number(dateKey.replaceAll('-', ''));
  const quotes = language === 'pt-BR' ? PT_BR_QUOTES : EN_QUOTES;
  return {
    text: quotes[daySeed % quotes.length] ?? fallbackQuote,
    source: 'local',
  };
}

function normalizeApiQuote(value: QuotesDbResponse): DailyQuoteValue | null {
  const text = value.quote?.trim();
  if (!text) return null;
  return {
    text,
    author: value.author?.trim() || undefined,
    source: 'api',
  };
}

export function useDailyQuote(fallbackQuote = FALLBACK_QUOTE, storageKey = STORAGE_KEY, language = 'pt-BR') {
  const [quote, setQuote] = useState<DailyQuoteValue>(() => ({ text: fallbackQuote, source: 'local' }));

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const normalizedLanguage = language === 'en-US' ? 'en-US' : 'pt-BR';
    const stored = window.localStorage.getItem(storageKey);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredQuote;
        if (parsed.date === today && parsed.language === normalizedLanguage && parsed.quote?.text) {
          setQuote(parsed.quote);
          return;
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    if (normalizedLanguage === 'pt-BR') {
      const nextQuote = fallbackForDate(today, fallbackQuote, normalizedLanguage);
      setQuote(nextQuote);
      window.localStorage.setItem(storageKey, JSON.stringify({ date: today, language: normalizedLanguage, quote: nextQuote }));
      return;
    }

    const controller = new AbortController();

    async function loadQuote() {
      try {
        const response = await fetch(QUOTE_API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error('Quote request failed');
        const data = (await response.json()) as QuotesDbResponse;
        const nextQuote = normalizeApiQuote(data) ?? fallbackForDate(today, fallbackQuote, normalizedLanguage);
        setQuote(nextQuote);
        window.localStorage.setItem(storageKey, JSON.stringify({ date: today, language: normalizedLanguage, quote: nextQuote }));
      } catch {
        const nextQuote = fallbackForDate(today, fallbackQuote, normalizedLanguage);
        setQuote(nextQuote);
        window.localStorage.setItem(storageKey, JSON.stringify({ date: today, language: normalizedLanguage, quote: nextQuote }));
      }
    }

    void loadQuote();
    return () => controller.abort();
  }, [fallbackQuote, language, storageKey]);

  return quote;
}
