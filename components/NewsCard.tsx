// ニュースカードコンポーネント
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsItem } from '@/types';

interface Props {
  item: NewsItem;
}

function scoreColor(score: number): string {
  if (score >= 8) return 'text-green-600 bg-green-50';
  if (score >= 6) return 'text-yellow-700 bg-yellow-50';
  return 'text-gray-500 bg-gray-50';
}

function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return '1時間以内';
  if (hours < 24) return `${hours}時間前`;
  return `${Math.floor(hours / 24)}日前`;
}

export function NewsCard({ item }: Props) {
  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
      <CardContent className="pt-4 pb-4">
        <div className="flex gap-3">
          {/* スコア */}
          <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${scoreColor(item.score)}`}>
            {item.score}
          </div>

          {/* 本文 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-400">{item.sourceName}</span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">{relativeTime(item.publishedAt)}</span>
            </div>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2 block mb-2"
            >
              {item.title}
            </a>

            <p className="text-xs text-gray-600 leading-relaxed mb-2">{item.summary}</p>

            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
