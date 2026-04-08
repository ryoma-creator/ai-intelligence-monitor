export type NewsSource = 'rss' | 'hackernews';

export type Language = 'en' | 'ja';

export type FilterSource = 'all' | 'rss' | 'hackernews';
export type FilterScore = 'all' | 'high' | 'mid';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: NewsSource;
  sourceName: string;
  publishedAt: string;
  summary: string;
  score: number;
  tags: string[];
}
