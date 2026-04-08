// デモ・フォールバック用モックデータ
import { NewsItem } from '@/types';

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'mock-1',
    title: 'Anthropic Releases Claude 4 with Extended Thinking and 1M Token Context',
    url: 'https://www.anthropic.com/news/claude-4',
    source: 'rss',
    sourceName: 'Anthropic News',
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    summary:
      'AnthropicがClaude 4を発表。最大100万トークンのコンテキストと拡張思考モードを搭載し、複雑な推論タスクで従来比40%の性能向上を達成。エンタープライズ向けAPIも同日公開。',
    score: 10,
    tags: ['Anthropic', 'Claude 4', 'モデルリリース'],
  },
  {
    id: 'mock-2',
    title: 'OpenAI Launches GPT-5 with Real-Time Multimodal Reasoning',
    url: 'https://openai.com/blog/gpt-5',
    source: 'rss',
    sourceName: 'OpenAI Blog',
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    summary:
      'OpenAIがGPT-5を正式リリース。テキスト・画像・音声・動画をリアルタイムで統合処理するマルチモーダル推論を実現。ChatGPT Plusユーザーから順次提供開始。',
    score: 10,
    tags: ['OpenAI', 'GPT-5', 'マルチモーダル'],
  },
  {
    id: 'mock-3',
    title: 'Google DeepMind Gemini Ultra 3 Achieves Human-Level Performance on MMLU Pro',
    url: 'https://deepmind.google/blog/gemini-ultra-3',
    source: 'rss',
    sourceName: 'Google DeepMind',
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    summary:
      'Google DeepMindがGemini Ultra 3を発表。MMLU Proベンチマークで人間レベル（95.2%）を達成。Google検索・Workspaceへの統合も発表され、エンタープライズ展開が加速。',
    score: 9,
    tags: ['Google', 'Gemini', 'ベンチマーク'],
  },
  {
    id: 'mock-4',
    title: 'EU AI Act Enforcement Begins: Major US AI Companies Face Compliance Deadline',
    url: 'https://news.ycombinator.com/item?id=40123456',
    source: 'hackernews',
    sourceName: 'HackerNews',
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    summary:
      'EU AI法の強制適用が開始。OpenAI・Anthropic・Google等の主要AI企業は2026年Q2までにリスク管理・透明性報告の義務を負う。非準拠の場合、年間売上の3%相当の罰金。',
    score: 9,
    tags: ['EU AI Act', '規制', 'コンプライアンス'],
  },
  {
    id: 'mock-5',
    title: 'Mistral AI Releases Mistral Large 3: Open Weights, 128K Context',
    url: 'https://mistral.ai/news/mistral-large-3',
    source: 'rss',
    sourceName: 'Mistral AI',
    publishedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    summary:
      'Mistral AIがMistral Large 3をオープンウェイトで公開。128Kトークンのコンテキスト、Apache 2.0ライセンス。コーディング・数学タスクでGPT-4oと同等以上の性能を示した。',
    score: 8,
    tags: ['Mistral', 'オープンソース', 'モデルリリース'],
  },
  {
    id: 'mock-6',
    title: 'Hugging Face Launches SmolLM3: Efficient On-Device AI for Mobile',
    url: 'https://huggingface.co/blog/smollm3',
    source: 'rss',
    sourceName: 'Hugging Face Blog',
    publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    summary:
      'Hugging FaceがSmolLM3を発表。1.7BパラメータながらiPhone/Androidでオフライン動作可能。エッジAIの実用化に向けた重要マイルストーンとして注目を集めている。',
    score: 7,
    tags: ['Hugging Face', 'エッジAI', 'モバイル'],
  },
  {
    id: 'mock-7',
    title: 'Microsoft and OpenAI Extend Partnership with $10B Investment in AGI Safety',
    url: 'https://news.ycombinator.com/item?id=40234567',
    source: 'hackernews',
    sourceName: 'HackerNews',
    publishedAt: new Date(Date.now() - 30 * 3600000).toISOString(),
    summary:
      'MicrosoftとOpenAIが戦略的提携を延長。AGI安全性研究に100億ドルを追加投資。Azure上でのOpenAIモデル独占展開も継続し、エンタープライズAI市場での優位性を強化する方針。',
    score: 8,
    tags: ['Microsoft', 'OpenAI', 'エンタープライズ'],
  },
  {
    id: 'mock-8',
    title: 'Stanford HAI Report: AI Adoption in Fortune 500 Reaches 87% in 2025',
    url: 'https://news.ycombinator.com/item?id=40345678',
    source: 'hackernews',
    sourceName: 'HackerNews',
    publishedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    summary:
      'Stanford HAIの年次報告書によると、Fortune 500企業の87%が2025年にAIを業務導入済み。コスト削減・生産性向上が主な動機だが、AI人材不足が普及の障壁として浮上。',
    score: 7,
    tags: ['エンタープライズ導入', 'Stanford', 'レポート'],
  },
  {
    id: 'mock-9',
    title: 'Anthropic Research: Constitutional AI 2.0 Shows 60% Reduction in Harmful Outputs',
    url: 'https://www.anthropic.com/research/constitutional-ai-2',
    source: 'rss',
    sourceName: 'Anthropic News',
    publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    summary:
      'AnthropicがConstitutional AI 2.0の研究を発表。有害出力を60%削減しつつ、有用性は維持。次世代Claudeモデルへの組み込みが予定されており、AI安全性研究の新標準となる可能性。',
    score: 8,
    tags: ['Anthropic', 'AI安全性', '研究'],
  },
  {
    id: 'mock-10',
    title: 'Show HN: I built a local LLM orchestration tool using llama.cpp and Go',
    url: 'https://news.ycombinator.com/item?id=40456789',
    source: 'hackernews',
    sourceName: 'HackerNews',
    publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    summary:
      '開発者がllama.cppとGoを使ったローカルLLMオーケストレーションツールをOSSで公開。複数モデルの並列実行・ルーティング・コスト管理が可能。HN上で1.2k以上のアップボートを獲得。',
    score: 6,
    tags: ['OSS', 'ローカルLLM', 'Go'],
  },
];
