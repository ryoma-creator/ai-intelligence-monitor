// ニュース収集 + AI要約 API
import { NextResponse } from 'next/server';
import { fetchRssArticles } from '@/lib/rss';
import { fetchHNArticles } from '@/lib/hackernews';
import { summarizeArticles } from '@/lib/summarizer';
import { MOCK_NEWS } from '@/lib/mockData';
import { NewsItem } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET() {
  try {
    // 並列でソース取得
    const [rssArticles, hnArticles] = await Promise.all([
      fetchRssArticles().catch(() => []),
      fetchHNArticles().catch(() => []),
    ]);

    const totalArticles = rssArticles.length + hnArticles.length;

    // 記事が1件も取得できなかった場合はモックデータを返す
    if (totalArticles === 0) {
      const sorted = [...MOCK_NEWS].sort((a, b) => b.score - a.score);
      return NextResponse.json({
        news: sorted,
        fetchedAt: new Date().toISOString(),
        isMock: true,
      });
    }

    // 並列でAI要約
    const [rssNews, hnNews] = await Promise.all([
      rssArticles.length > 0 ? summarizeArticles(rssArticles, 'rss') : [],
      hnArticles.length > 0 ? summarizeArticles(hnArticles, 'hackernews') : [],
    ]);

    // マージしてスコア順にソート
    const allNews: NewsItem[] = [...rssNews, ...hnNews].sort(
      (a, b) => b.score - a.score
    );

    // 要約結果が空なら（OpenAI API失敗等）モックにフォールバック
    if (allNews.length === 0) {
      const sorted = [...MOCK_NEWS].sort((a, b) => b.score - a.score);
      return NextResponse.json({
        news: sorted,
        fetchedAt: new Date().toISOString(),
        isMock: true,
      });
    }

    return NextResponse.json({
      news: allNews,
      fetchedAt: new Date().toISOString(),
      isMock: false,
    });
  } catch (err) {
    // 予期しないエラー時もモックで返す
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api/news]', message);

    const sorted = [...MOCK_NEWS].sort((a, b) => b.score - a.score);
    return NextResponse.json({
      news: sorted,
      fetchedAt: new Date().toISOString(),
      isMock: true,
    });
  }
}
