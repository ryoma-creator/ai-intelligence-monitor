// News collection + AI summarization API
import { NextRequest, NextResponse } from 'next/server';
import { fetchRssArticles } from '@/lib/rss';
import { fetchHNArticles } from '@/lib/hackernews';
import { summarizeArticles } from '@/lib/summarizer';
import { getMockNews } from '@/lib/mockData';
import { NewsItem, Language } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const lang = (req.nextUrl.searchParams.get('lang') ?? 'en') as Language;
  const validLangs: Language[] = ['en', 'ja'];
  const resolvedLang: Language = validLangs.includes(lang) ? lang : 'en';

  try {
    // Fetch sources in parallel
    const [rssArticles, hnArticles] = await Promise.all([
      fetchRssArticles().catch(() => []),
      fetchHNArticles().catch(() => []),
    ]);

    // Fall back to mock data when no articles were fetched
    if (rssArticles.length + hnArticles.length === 0) {
      return NextResponse.json({
        news: getMockNews(resolvedLang),
        fetchedAt: new Date().toISOString(),
        isMock: true,
      });
    }

    // Summarize in parallel with the requested language
    const [rssNews, hnNews] = await Promise.all([
      rssArticles.length > 0 ? summarizeArticles(rssArticles, 'rss', resolvedLang) : [],
      hnArticles.length > 0 ? summarizeArticles(hnArticles, 'hackernews', resolvedLang) : [],
    ]);

    const allNews: NewsItem[] = [...rssNews, ...hnNews].sort((a, b) => b.score - a.score);

    // If summarization produced nothing (e.g. OpenAI API failure) use mock
    if (allNews.length === 0) {
      return NextResponse.json({
        news: getMockNews(resolvedLang),
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
    console.error('[api/news]', err instanceof Error ? err.message : err);
    return NextResponse.json({
      news: getMockNews(resolvedLang),
      fetchedAt: new Date().toISOString(),
      isMock: true,
    });
  }
}
