'use client';

import { useState, useCallback } from 'react';
import { NewsCard } from '@/components/NewsCard';
import { NewsItem, FilterSource, FilterScore, Language } from '@/types';

type ApiResponse = {
  news: NewsItem[];
  fetchedAt: string;
  isMock?: boolean;
};

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
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
        active
          ? 'bg-slate-900 text-white shadow-sm'
          : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-slate-400'
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-lg">
                  ⚡
                </div>
                <h1 className="text-lg font-bold tracking-tight">AI Intelligence Monitor</h1>
              </div>
              <p className="text-sm text-slate-400">
                RSS + HackerNews → gpt-4o-mini
              </p>
              {fetchedAt && (
                <p className="mt-1 text-xs text-slate-500">
                  Updated: {new Date(fetchedAt).toLocaleString()}
                  {isMock && (
                    <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-300 text-[10px] font-medium">
                      demo data
                    </span>
                  )}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {/* Language switcher */}
              <div className="flex rounded-lg overflow-hidden ring-1 ring-white/20 text-xs font-semibold">
                {(['en', 'ja'] as Language[]).map((l) => (
                  <button
                    key={l}
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

              {/* Refresh button */}
              <button
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
      </header>

      {/* Main */}
      <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
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
            {/* Stats + filters */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-4">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-xl font-bold text-slate-900">{news.length}</p>
                  <p className="text-[11px] text-slate-400">Total</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-rose-500">{highCount}</p>
                  <p className="text-[11px] text-slate-400">High impact</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-blue-500">{rssCount}</p>
                  <p className="text-[11px] text-slate-400">RSS</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-orange-500">{hnCount}</p>
                  <p className="text-[11px] text-slate-400">HackerNews</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <FilterBtn active={filterSource === 'all'} onClick={() => setFilterSource('all')}>All sources</FilterBtn>
                <FilterBtn active={filterSource === 'rss'} onClick={() => setFilterSource('rss')}>RSS / Blog</FilterBtn>
                <FilterBtn active={filterSource === 'hackernews'} onClick={() => setFilterSource('hackernews')}>HackerNews</FilterBtn>
                <span className="self-center w-px h-4 bg-slate-200" />
                <FilterBtn active={filterScore === 'all'} onClick={() => setFilterScore('all')}>All scores</FilterBtn>
                <FilterBtn active={filterScore === 'high'} onClick={() => setFilterScore('high')}>High (8+)</FilterBtn>
                <FilterBtn active={filterScore === 'mid'} onClick={() => setFilterScore('mid')}>Mid (6–7)</FilterBtn>
              </div>

              <p className="text-xs text-slate-400">{filtered.length} articles shown</p>
            </div>

            {/* News list */}
            <div className="space-y-3">
              {filtered.map((item, i) => (
                <NewsCard key={item.id} item={item} index={i} />
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
