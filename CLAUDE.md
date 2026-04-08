@AGENTS.md
# AI Intelligence Monitor - Project Rules

## プロジェクト概要
AI業界ニュースを自動収集・AI要約するダッシュボード。
詳細は SPEC.md を参照。

## スタック
- Next.js 16 (App Router、srcディレクトリなし)
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui
- OpenAI API (gpt-4o-mini)

## ファイル配置
```
app/           # ページ・APIルート
components/    # UIコンポーネント
lib/           # ロジック（rss, hackernews, summarizer）
types/         # 型定義
```

## コードルール
- `any` 禁止
- コンポーネントは小さく分割（100行以内を目安）
- 日本語でコメントを書く

## デザインルール
- モバイルファースト・レスポンシブ必須
- shadcn/ui のコンポーネントを優先
- Tailwindのデフォルトカラーを使用

## APIコスト管理（重要）
- AIはgpt-4o-miniのみ使用（コスト最適化）
- システムプロンプトは固定（Prompt Cachingを活用）
- 自動更新はしない（手動「更新する」ボタンのみ）
- 環境変数: `OPENAI_API_KEY`

## 環境変数
`.env.local` に設定：
- `OPENAI_API_KEY`

## Git Rules
- 1機能完成ごとにコミット
- コミットメッセージは英語
