// HackerNews API からAI関連記事を取得するモジュール

import { RawArticle } from './rss';

const HN_API = 'https://hacker-news.firebaseio.com/v0';

// AI関連のキーワード
const AI_KEYWORDS = [
  'gpt', 'llm', 'claude', 'gemini', 'openai', 'anthropic',
  'mistral', 'ai ', 'artificial intelligence', 'machine learning',
  'deep learning', 'neural', 'transformer', 'diffusion',
  'llama', 'hugging face', 'stable diffusion', 'midjourney',
];

interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  time: number;
}

// タイトルがAI関連かチェック
function isAIRelated(title: string): boolean {
  const lower = title.toLowerCase();
  return AI_KEYWORDS.some((kw) => lower.includes(kw));
}

// HNのトップストーリーからAI関連を抽出
export async function fetchHNArticles(): Promise<RawArticle[]> {
  // Top500からAI関連を探す
  const topRes = await fetch(`${HN_API}/topstories.json`, {
    signal: AbortSignal.timeout(10000),
    next: { revalidate: 0 },
  });
  if (!topRes.ok) return [];

  const ids: number[] = await topRes.json();
  const top100 = ids.slice(0, 100);

  // 並列で記事情報を取得
  const stories = await Promise.allSettled(
    top100.map(async (id) => {
      const res = await fetch(`${HN_API}/item/${id}.json`, {
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 0 },
      });
      if (!res.ok) return null;
      return res.json() as Promise<HNStory>;
    })
  );

  const aiStories = stories
    .filter((r): r is PromiseFulfilledResult<HNStory | null> => r.status === 'fulfilled')
    .map((r) => r.value)
    .filter((s): s is HNStory => s !== null && s.score >= 50 && isAIRelated(s.title));

  // 最新10件
  return aiStories.slice(0, 10).map((s) => ({
    title: s.title,
    url: s.url ?? `https://news.ycombinator.com/item?id=${s.id}`,
    sourceName: 'HackerNews',
    publishedAt: new Date(s.time * 1000).toISOString(),
  }));
}
