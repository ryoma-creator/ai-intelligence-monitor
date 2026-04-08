// AI Intelligence Monitor の型定義

export type NewsSource = 'rss' | 'hackernews';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: NewsSource;
  sourceName: string;
  publishedAt: string;
  summary: string;       // gpt-4o-mini による日本語要約
  score: number;         // 重要度 1-10
  tags: string[];
}

export type FilterSource = 'all' | 'rss' | 'hackernews';
export type FilterScore = 'all' | 'high' | 'mid';
