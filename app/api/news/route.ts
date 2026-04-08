// ニュース収集 + AI要約 API
import { NextResponse } from 'next/server';
import { fetchRssArticles } from '@/lib/rss';
import { fetchHNArticles } from '@/lib/hackernews';
import { summarizeArticles } from '@/lib/summarizer';
import { NewsItem } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET() {
  try {
    // 並列でソース取得
    const [rssArticles, hnArticles] = await Promise.all([
      fetchRssArticles(),
      fetchHNArticles(),
    ]);

    // 並列でAI要約
    const [rssNews, hnNews] = await Promise.all([
      summarizeArticles(rssArticles, 'rss'),
      summarizeArticles(hnArticles, 'hackernews'),
    ]);

    // マージしてスコア順にソート
    const allNews: NewsItem[] = [...rssNews, ...hnNews].sort(
      (a, b) => b.score - a.score
    );

    return NextResponse.json({ news: allNews, fetchedAt: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
