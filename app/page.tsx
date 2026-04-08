'use client';

import { useState, useCallback } from 'react';
import { NewsCard } from '@/components/NewsCard';
import { NewsItem, FilterSource, FilterScore, Language } from '@/types';

type ApiResponse = {
  news: NewsItem[];
  fetchedAt: string;
  isMock?: boolean;
};

function formatLastUpdated(iso: string, lang: Language): string {
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat(lang === 'ja' ? 'ja-JP' : 'en-US', opts).format(d);
}

const ui = {
  en: {
    lastUpdated: 'Last updated:',
    pipeline: 'RSS + HackerNews → gpt-4o-mini',
    summaryHeading: 'Summary',
    articles: 'Articles',
    highImpact: 'High impact',
    sourceBreakdown: 'By source',
    rss: 'RSS',
    hn: 'HN',
    filterHeading: 'Filters',
    sourceLabel: 'Source',
    scoreLabel: 'Score',
    filterAllSources: 'All',
    filterRss: 'RSS / Blog',
    filterHn: 'HackerNews',
    filterAllScores: 'All',
    filterHigh: 'High (8+)',
    filterMid: 'Mid (6–7)',
    articlesShown: (n: number) => `${n} articles shown`,
    demoBadge: 'Demo (mock data)',
    demoLines: [
      'This is a demo version using mock data.',
      'Full AI-powered analysis is available in the local environment.',
      "Please contact me if you'd like a live walkthrough or access to the full version.",
    ],
  },
  ja: {
    lastUpdated: '最終更新:',
    pipeline: 'RSS + HackerNews → gpt-4o-mini',
    summaryHeading: '概要',
    articles: '記事',
    highImpact: '高インパクト',
    sourceBreakdown: 'ソース内訳',
    rss: 'RSS',
    hn: 'HackerNews',
    filterHeading: '絞り込み',
    sourceLabel: 'ソース',
    scoreLabel: 'スコア',
    filterAllSources: 'すべて',
    filterRss: 'RSS / ブログ',
    filterHn: 'HackerNews',
    filterAllScores: 'すべて',
    filterHigh: '高 (8+)',
    filterMid: '中 (6–7)',
    articlesShown: (n: number) => `${n} 件を表示`,
    demoBadge: 'デモ版（モックデータ）',
    demoLines: [
      'これはデモ版（モックデータ）です。',
      '実際のAI分析機能はローカル環境で動作します。',
      'フル機能のデモをご希望の場合はご連絡ください。',
    ],
  },
} as const;

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-slate-900 text-white shadow-sm'
          : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200/80 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<FilterSource>('all');
  const [filterScore, setFilterScore] = useState<FilterScore>('all');
  const [lang, setLang] = useState<Language>('en');

  const fetchNews = useCallback(async (targetLang: Language) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/news?lang=${targetLang}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as ApiResponse;
      setNews(data.news);
      setFetchedAt(data.fetchedAt);
      setIsMock(data.isMock ?? false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = () => fetchNews(lang);

  const handleLangSwitch = (next: Language) => {
    setLang(next);
    // Re-fetch only if results are already displayed
    if (news.length > 0) fetchNews(next);
  };

  const filtered = news.filter((item) => {
    if (filterSource === 'rss' && item.source !== 'rss') return false;
    if (filterSource === 'hackernews' && item.source !== 'hackernews') return false;
    if (filterScore === 'high' && item.score < 8) return false;
    if (filterScore === 'mid' && (item.score < 6 || item.score >= 8)) return false;
    return true;
  });

  const highCount = news.filter((n) => n.score >= 8).length;
  const rssCount = news.filter((n) => n.source === 'rss').length;
  const hnCount = news.filter((n) => n.source === 'hackernews').length;
  const t = ui[lang];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-lg">
                  ⚡
                </div>
                <h1 className="text-lg font-bold tracking-tight">AI Intelligence Monitor</h1>
              </div>
              <p className="text-sm text-slate-400">{t.pipeline}</p>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              {fetchedAt && (
                <p className="text-sm font-semibold text-white/95 sm:text-right">
                  <span className="font-medium text-white/70">{t.lastUpdated}</span>{' '}
                  <span className="tabular-nums">{formatLastUpdated(fetchedAt, lang)}</span>
                </p>
              )}
              <div className="flex shrink-0 items-center justify-end gap-2">
                <div className="flex overflow-hidden rounded-lg text-xs font-semibold ring-1 ring-white/20">
                  {(['en', 'ja'] as Language[]).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => handleLangSwitch(l)}
                      className={`px-3 py-2 transition-colors uppercase ${
                        lang === l
                          ? 'bg-white text-slate-900'
                          : 'text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Fetching...
                    </span>
                  ) : (
                    'Refresh'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-3xl space-y-5 px-4 py-6">
        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {isMock && news.length > 0 && !loading && (
          <div
            className="rounded-xl border border-amber-300/70 bg-amber-50/90 p-4 shadow-sm"
            role="status"
          >
            <p className="text-base font-semibold text-amber-950">{t.demoBadge}</p>
            <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-amber-950/85">
              {t.demoLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {news.length === 0 && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
              ⚡
            </div>
            <h2 className="mb-1 text-base font-semibold text-slate-700">
              Collect the latest AI news
            </h2>
            <p className="text-sm text-slate-400">
              Press <strong>Refresh</strong> to pull from RSS feeds and HackerNews
            </p>
            <p className="mt-1 text-xs text-slate-300">Takes 30–60 seconds</p>
          </div>
        )}

        {/* Skeleton loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                  <div className="flex gap-1">
                    <div className="h-4 w-16 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-4 w-12 animate-pulse rounded-full bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
            <p className="text-center text-xs text-slate-400 pt-2 animate-pulse">
              Collecting and summarizing articles...
            </p>
          </div>
        )}

        {/* Results */}
        {news.length > 0 && !loading && (
          <>
            {/* Summary + filters：枠を減らしタイポで階層を付ける */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start md:gap-0">
                <div className="min-w-0 flex-1 space-y-5 md:border-r md:border-slate-100 md:pr-8">
                  <section>
                    <h2 className="mb-3 text-sm font-semibold text-slate-800">{t.summaryHeading}</h2>
                    <div className="flex gap-10 sm:gap-14">
                      <div>
                        <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-900">
                          {news.length}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-600">{t.articles}</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold tabular-nums tracking-tight text-rose-600">
                          {highCount}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-600">{t.highImpact}</p>
                      </div>
                    </div>
                  </section>

                  <section className="border-t border-slate-100 pt-5">
                    <h2 className="mb-3 text-sm font-semibold text-slate-800">{t.sourceBreakdown}</h2>
                    <dl className="flex flex-wrap gap-x-10 gap-y-2 text-sm">
                      <div className="flex items-baseline gap-3">
                        <dt className="font-medium text-slate-700">{t.rss}</dt>
                        <dd className="text-2xl font-bold tabular-nums text-blue-600">{rssCount}</dd>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <dt className="font-medium text-slate-700">{t.hn}</dt>
                        <dd className="text-2xl font-bold tabular-nums text-orange-500">{hnCount}</dd>
                      </div>
                    </dl>
                  </section>
                </div>

                <section className="min-w-0 flex-1 border-t border-slate-100 pt-6 md:border-t-0 md:pl-8 md:pt-0">
                  <h2 className="mb-4 text-sm font-semibold text-slate-800">{t.filterHeading}</h2>
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2.5 text-sm font-medium text-slate-700">{t.sourceLabel}</p>
                      <div className="flex flex-wrap gap-2">
                        <FilterBtn active={filterSource === 'all'} onClick={() => setFilterSource('all')}>
                          {t.filterAllSources}
                        </FilterBtn>
                        <FilterBtn active={filterSource === 'rss'} onClick={() => setFilterSource('rss')}>
                          {t.filterRss}
                        </FilterBtn>
                        <FilterBtn
                          active={filterSource === 'hackernews'}
                          onClick={() => setFilterSource('hackernews')}
                        >
                          {t.filterHn}
                        </FilterBtn>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2.5 text-sm font-medium text-slate-700">{t.scoreLabel}</p>
                      <div className="flex flex-wrap gap-2">
                        <FilterBtn active={filterScore === 'all'} onClick={() => setFilterScore('all')}>
                          {t.filterAllScores}
                        </FilterBtn>
                        <FilterBtn active={filterScore === 'high'} onClick={() => setFilterScore('high')}>
                          {t.filterHigh}
                        </FilterBtn>
                        <FilterBtn active={filterScore === 'mid'} onClick={() => setFilterScore('mid')}>
                          {t.filterMid}
                        </FilterBtn>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <p className="mt-6 border-t border-slate-100 pt-3 text-sm text-slate-500">
                {t.articlesShown(filtered.length)}
              </p>
            </div>

            {/* News list */}
            <div className="space-y-3">
              {filtered.map((item, i) => (
                <NewsCard key={item.id} item={item} index={i} lang={lang} />
              ))}
              {filtered.length === 0 && (
                <div className="rounded-xl border border-slate-100 bg-white py-12 text-center text-sm text-slate-400 shadow-sm">
                  No articles match the current filters
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
