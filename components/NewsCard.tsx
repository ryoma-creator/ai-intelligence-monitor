'use client';

// ニュースカードコンポーネント
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { NewsItem } from '@/types';

interface Props {
  item: NewsItem;
  index: number;
}

// スコアに応じた色クラス
function scoreStyle(score: number): { bg: string; text: string; ring: string } {
  if (score >= 9) return { bg: 'bg-rose-500', text: 'text-white', ring: 'ring-rose-200' };
  if (score >= 8) return { bg: 'bg-orange-500', text: 'text-white', ring: 'ring-orange-200' };
  if (score >= 6) return { bg: 'bg-amber-400', text: 'text-amber-900', ring: 'ring-amber-200' };
  return { bg: 'bg-slate-200', text: 'text-slate-600', ring: 'ring-slate-200' };
}

// ソースごとのアクセントカラー
function sourceAccent(sourceName: string): string {
  if (sourceName.includes('OpenAI')) return 'text-emerald-600';
  if (sourceName.includes('Anthropic')) return 'text-orange-500';
  if (sourceName.includes('DeepMind') || sourceName.includes('Google')) return 'text-blue-500';
  if (sourceName.includes('Hugging')) return 'text-yellow-600';
  if (sourceName.includes('Mistral')) return 'text-purple-500';
  if (sourceName.includes('HackerNews')) return 'text-orange-600';
  return 'text-slate-500';
}

function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return '1時間以内';
  if (hours < 24) return `${hours}時間前`;
  return `${Math.floor(hours / 24)}日前`;
}

export function NewsCard({ item, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const style = scoreStyle(item.score);

  return (
    <div
      className="group flex gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-200 hover:shadow-md"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* スコアバッジ */}
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ring-2 ${style.bg} ${style.text} ${style.ring}`}
        >
          {item.score}
        </div>
        <span className="text-[10px] font-medium text-slate-400">/ 10</span>
      </div>

      {/* コンテンツ */}
      <div className="min-w-0 flex-1">
        {/* ソース + 時刻 */}
        <div className="mb-1.5 flex items-center gap-1.5 text-xs">
          <span className={`font-semibold ${sourceAccent(item.sourceName)}`}>
            {item.sourceName}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">{relativeTime(item.publishedAt)}</span>
        </div>

        {/* タイトル */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 block text-sm font-semibold leading-snug text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors"
        >
          {item.title}
        </a>

        {/* 要約 */}
        <p
          className={`mb-3 text-xs leading-relaxed text-slate-600 ${expanded ? '' : 'line-clamp-2'}`}
        >
          {item.summary}
        </p>

        {/* 展開ボタン（要約が長い場合） */}
        {item.summary.length > 80 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mb-2 text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
          >
            {expanded ? '閉じる ▲' : '続きを読む ▼'}
          </button>
        )}

        {/* タグ */}
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="h-auto rounded-full px-2 py-0.5 text-[11px] text-slate-500">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* 外部リンクアイコン */}
      <div className="shrink-0 pt-0.5">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-600"
          aria-label="記事を開く"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
