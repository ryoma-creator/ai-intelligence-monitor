'use client';

import { useState, useCallback } from 'react';
import { NewsCard } from '@/components/NewsCard';
import { NewsItem, FilterSource, FilterScore } from '@/types';

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<FilterSource>('all');
  const [filterScore, setFilterScore] = useState<FilterScore>('all');

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { news: NewsItem[]; fetchedAt: string };
      setNews(data.news);
      setFetchedAt(data.fetchedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // フィルタリング
  const filtered = news.filter((item) => {
    if (filterSource === 'rss' && item.source !== 'rss') return false;
    if (filterSource === 'hackernews' && item.source !== 'hackernews') return false;
    if (filterScore === 'high' && item.score < 8) return false;
    if (filterScore === 'mid' && (item.score < 6 || item.score >= 8)) return false;
    return true;
  });

  const highCount = news.filter((n) => n.score >= 8).length;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ヘッダー */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Intelligence Monitor</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {fetchedAt
                ? `最終更新: ${new Date(fetchedAt).toLocaleString('ja-JP')}`
                : 'AI業界ニュースをリアルタイム収集・要約'}
            </p>
          </div>
          <button
            onClick={fetchNews}
            disabled={loading}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {loading ? '取得中...' : '更新する'}
          </button>
        </div>

        {/* エラー */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        {/* 初期状態 */}
        {news.length === 0 && !loading && !error && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">⚡</p>
            <p className="text-sm">「更新する」でAIニュースを収集</p>
            <p className="text-xs mt-1">RSS + HackerNews → gpt-4o-mini で日本語要約</p>
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xs animate-pulse">ニュースを収集・要約中...</p>
            <p className="text-xs mt-1">30〜60秒かかります</p>
          </div>
        )}

        {/* 結果 */}
        {news.length > 0 && !loading && (
          <>
            {/* サマリー + フィルター */}
            <div className="space-y-3">
              <div className="flex gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-gray-900">{news.length}</p>
                  <p className="text-xs text-gray-400">合計記事</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-green-600">{highCount}</p>
                  <p className="text-xs text-gray-400">重要度高 (8+)</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{filtered.length}</p>
                  <p className="text-xs text-gray-400">表示中</p>
                </div>
              </div>

              {/* ソースフィルター */}
              <div className="flex gap-2 flex-wrap">
                {(['all', 'rss', 'hackernews'] as FilterSource[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterSource(f)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      filterSource === f
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {f === 'all' ? '全ソース' : f === 'rss' ? 'RSS / Blog' : 'HackerNews'}
                  </button>
                ))}
                <span className="w-px bg-gray-200 mx-1" />
                {(['all', 'high', 'mid'] as FilterScore[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterScore(f)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      filterScore === f
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {f === 'all' ? '全重要度' : f === 'high' ? '高 (8+)' : '中 (6-7)'}
                  </button>
                ))}
              </div>
            </div>

            {/* ニュースリスト */}
            <div className="space-y-3">
              {filtered.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-8">
                  該当する記事がありません
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
