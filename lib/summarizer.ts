// gpt-4o-mini でAIニュースを日本語要約・スコアリングするモジュール
import OpenAI from 'openai';
import { RawArticle } from './rss';
import { NewsItem, NewsSource } from '@/types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// システムプロンプト（固定 → prompt caching が効く）
const SYSTEM_PROMPT = `あなたはAI業界のニュースアナリストです。
記事タイトルをもとに以下をJSONで返してください。

- summary: 日本語で3行以内の要約（何が起きたか、なぜ重要か）
- score: 重要度 1-10（業界インパクトが大きいほど高い）
- tags: 関連タグ（例: ["OpenAI", "GPT-4o", "モデルリリース"]）、最大3つ

JSONのみ返す。説明文不要。`;

interface SummaryResult {
  summary: string;
  score: number;
  tags: string[];
}

async function summarizeOne(title: string): Promise<SummaryResult> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `記事タイトル: ${title}` },
    ],
    temperature: 0.3,
    max_tokens: 200,
    response_format: { type: 'json_object' },
  });

  const content = res.choices[0]?.message?.content ?? '{}';
  try {
    const parsed = JSON.parse(content) as Partial<SummaryResult>;
    return {
      summary: parsed.summary ?? title,
      score: Math.min(10, Math.max(1, parsed.score ?? 5)),
      tags: parsed.tags ?? [],
    };
  } catch {
    return { summary: title, score: 5, tags: [] };
  }
}

// 複数記事をまとめて要約（並列実行）
export async function summarizeArticles(
  articles: RawArticle[],
  source: NewsSource
): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    articles.map(async (article, i) => {
      const result = await summarizeOne(article.title);
      return {
        id: `${source}-${Date.now()}-${i}`,
        title: article.title,
        url: article.url,
        source,
        sourceName: article.sourceName,
        publishedAt: article.publishedAt,
        summary: result.summary,
        score: result.score,
        tags: result.tags,
      } satisfies NewsItem;
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<NewsItem> => r.status === 'fulfilled')
    .map((r) => r.value);
}
