# AI Intelligence Monitor - 仕様書

## 概要

AI業界のニュースをRSSフィード・HackerNewsから自動収集し、
gpt-4o-miniで日本語要約・重要度スコアリングして表示するダッシュボード。

**目的**: AI業界の動きを毎日効率よくキャッチアップする個人ツール

---

## 技術スタック

- Next.js 16 (App Router)
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui
- OpenAI API (gpt-4o-mini)

---

## データソース

### RSS フィード
| ソース | URL |
|--------|-----|
| OpenAI Blog | openai.com/blog/rss.xml |
| Anthropic News | anthropic.com/news/rss |
| Google DeepMind | deepmind.google/blog/rss.xml |
| Hugging Face Blog | huggingface.co/blog/feed.xml |
| Mistral AI | mistral.ai/feed.xml |

各ソース最新5件を取得。

### HackerNews
- Top100ストーリーからAI関連キーワードでフィルタリング
- スコア50以上のみ対象
- 最大10件取得

---

## AIによる要約（gpt-4o-mini）

各記事タイトルをもとに以下を生成：
- `summary`: 日本語3行以内の要約（何が起きたか・なぜ重要か）
- `score`: 重要度 1-10（業界インパクト基準）
- `tags`: 関連タグ最大3つ

**コスト**: 1回の更新で約$0.003（0.5円未満）

Prompt Cachingを活用（システムプロンプト固定）。

---

## ファイル構成

```
app/
├── page.tsx              # メイン画面（クライアント）
└── api/
    └── news/route.ts     # 収集 + AI要約API（GET）
components/
└── NewsCard.tsx          # ニュースカードUI
lib/
├── rss.ts                # RSSフィード取得・パース
├── hackernews.ts         # HN API取得・AIフィルタ
└── summarizer.ts         # gpt-4o-mini要約
types/
└── index.ts              # 型定義
```

---

## UI フロー

1. 初期表示: 「更新する」ボタンのみ表示
2. ボタン押下 → `/api/news` を呼び出し（30〜60秒）
3. 結果表示: スコア順にニュースカード一覧
4. フィルター: ソース別（全て / RSS / HackerNews）× 重要度別（全て / 高8+ / 中6-7）

---

## 環境変数

```env
# .env.local
OPENAI_API_KEY=sk-...
```

---

## 型定義

```typescript
type NewsSource = 'rss' | 'hackernews';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: NewsSource;
  sourceName: string;     // 'OpenAI Blog', 'HackerNews' など
  publishedAt: string;    // ISO 8601
  summary: string;        // 日本語要約
  score: number;          // 1-10
  tags: string[];
}
```

---

## 今後の拡張候補（Phase 2）

- [ ] 定期自動更新（cron / Vercel Cron）
- [ ] 既読管理（localStorage）
- [ ] キーワードフィルター（自分の関心分野に絞る）
- [ ] Arxiv論文ソース追加
- [ ] お気に入り保存

---

*作成日: 2026-04-08*
*バージョン: 1.0*
