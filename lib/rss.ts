// AI系ブログのRSSフィードを取得するモジュール

export interface RawArticle {
  title: string;
  url: string;
  sourceName: string;
  publishedAt: string;
}

// 主要AI企業・研究機関のRSSフィード
const RSS_FEEDS = [
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml' },
  { name: 'Anthropic News', url: 'https://www.anthropic.com/news/rss' },
  { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml' },
  { name: 'Hugging Face Blog', url: 'https://huggingface.co/blog/feed.xml' },
  { name: 'Mistral AI', url: 'https://mistral.ai/feed.xml' },
];

// XMLからタグの中身を取得するユーティリティ
function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  if (!match) return '';
  return (match[1] ?? match[2] ?? '').trim();
}

// RSSのXMLをパースして記事リストを返す
function parseRss(xml: string, sourceName: string): RawArticle[] {
  const items: RawArticle[] = [];
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];

  for (const block of itemBlocks.slice(0, 5)) { // 各ソース最新5件
    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link') || extractTag(block, 'guid');
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'published');

    if (!title || !link) continue;

    items.push({
      title,
      url: link,
      sourceName,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
    });
  }

  return items;
}

// 全RSSフィードから記事を取得
export async function fetchRssArticles(): Promise<RawArticle[]> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async ({ name, url }) => {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/rss+xml, application/xml' },
        signal: AbortSignal.timeout(10000),
        next: { revalidate: 0 },
      });
      if (!res.ok) return [];
      const xml = await res.text();
      return parseRss(xml, name);
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<RawArticle[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value);
}
