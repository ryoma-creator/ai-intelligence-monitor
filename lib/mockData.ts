// Demo / fallback mock data
import { NewsItem, Language } from '@/types';

const MOCK_EN: NewsItem[] = [
  {
    id: 'mock-1',
    title: 'Anthropic Releases Claude 4 with Extended Thinking and 1M Token Context',
    url: 'https://www.anthropic.com/news/claude-4',
    source: 'rss',
    sourceName: 'Anthropic News',
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    summary:
      'Anthropic launched Claude 4 featuring a 1M token context window and an extended thinking mode. Benchmarks show a 40% improvement over Claude 3 on complex reasoning tasks. Enterprise API access opens the same day.',
    score: 10,
    tags: ['Anthropic', 'Claude 4', 'Model Release'],
  },
  {
    id: 'mock-2',
    title: 'OpenAI Launches GPT-5 with Real-Time Multimodal Reasoning',
    url: 'https://openai.com/blog/gpt-5',
    source: 'rss',
    sourceName: 'OpenAI Blog',
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    summary:
      'OpenAI officially released GPT-5, enabling real-time processing of text, images, audio, and video in a unified multimodal pipeline. Rollout begins for ChatGPT Plus subscribers.',
    score: 10,
    tags: ['OpenAI', 'GPT-5', 'Multimodal'],
  },
  {
    id: 'mock-3',
    title: 'Google DeepMind Gemini Ultra 3 Achieves Human-Level Performance on MMLU Pro',
    url: 'https://deepmind.google/blog/gemini-ultra-3',
    source: 'rss',
    sourceName: 'Google DeepMind',
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    summary:
      'Gemini Ultra 3 scores 95.2% on MMLU Pro, reaching human-level performance. Google simultaneously announced integrations across Search and Workspace, accelerating enterprise deployment.',
    score: 9,
    tags: ['Google', 'Gemini', 'Benchmark'],
  },
  {
    id: 'mock-4',
    title: 'EU AI Act Enforcement Begins: Major US AI Companies Face Compliance Deadline',
    url: 'https://news.ycombinator.com/item?id=40123456',
    source: 'hackernews',
    sourceName: 'HackerNews',
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    summary:
      'Full enforcement of the EU AI Act has started. OpenAI, Anthropic, and Google must meet risk-management and transparency requirements by Q2 2026 or face fines up to 3% of global revenue.',
    score: 9,
    tags: ['EU AI Act', 'Regulation', 'Compliance'],
  },
  {
    id: 'mock-5',
    title: 'Mistral AI Releases Mistral Large 3: Open Weights, 128K Context',
    url: 'https://mistral.ai/news/mistral-large-3',
    source: 'rss',
    sourceName: 'Mistral AI',
    publishedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    summary:
      'Mistral AI open-sourced Mistral Large 3 under Apache 2.0 with a 128K context window. On coding and math benchmarks it matches or exceeds GPT-4o while remaining fully open.',
    score: 8,
    tags: ['Mistral', 'Open Source', 'Model Release'],
  },
  {
    id: 'mock-6',
    title: 'Hugging Face Launches SmolLM3: Efficient On-Device AI for Mobile',
    url: 'https://huggingface.co/blog/smollm3',
    source: 'rss',
    sourceName: 'Hugging Face Blog',
    publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    summary:
      'SmolLM3 (1.7B parameters) runs offline on iOS and Android, marking a practical milestone for on-device AI. Hugging Face positions it as a privacy-first alternative to cloud inference.',
    score: 7,
    tags: ['Hugging Face', 'Edge AI', 'Mobile'],
  },
  {
    id: 'mock-7',
    title: 'Microsoft and OpenAI Extend Partnership with $10B Investment in AGI Safety',
    url: 'https://news.ycombinator.com/item?id=40234567',
    source: 'hackernews',
    sourceName: 'HackerNews',
    publishedAt: new Date(Date.now() - 30 * 3600000).toISOString(),
    summary:
      'Microsoft and OpenAI extended their strategic partnership with an additional $10B earmarked for AGI safety research. Exclusive Azure deployment of OpenAI models continues, strengthening enterprise market dominance.',
    score: 8,
    tags: ['Microsoft', 'OpenAI', 'Enterprise'],
  },
  {
    id: 'mock-8',
    title: 'Stanford HAI Report: AI Adoption in Fortune 500 Reaches 87% in 2025',
    url: 'https://news.ycombinator.com/item?id=40345678',
    source: 'hackernews',
    sourceName: 'HackerNews',
    publishedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    summary:
      'Stanford HAI\'s annual index shows 87% of Fortune 500 companies deployed AI in 2025. Cost reduction and productivity gains drive adoption, but talent shortages remain the primary barrier.',
    score: 7,
    tags: ['Enterprise Adoption', 'Stanford', 'Report'],
  },
  {
    id: 'mock-9',
    title: 'Anthropic Research: Constitutional AI 2.0 Shows 60% Reduction in Harmful Outputs',
    url: 'https://www.anthropic.com/research/constitutional-ai-2',
    source: 'rss',
    sourceName: 'Anthropic News',
    publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    summary:
      'Constitutional AI 2.0 cuts harmful outputs by 60% with no measurable drop in helpfulness. The technique will be integrated into the next Claude generation and may become a new safety standard.',
    score: 8,
    tags: ['Anthropic', 'AI Safety', 'Research'],
  },
  {
    id: 'mock-10',
    title: 'Show HN: I built a local LLM orchestration tool using llama.cpp and Go',
    url: 'https://news.ycombinator.com/item?id=40456789',
    source: 'hackernews',
    sourceName: 'HackerNews',
    publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    summary:
      'An open-source tool built with llama.cpp and Go enables parallel local LLM execution, model routing, and cost tracking. The project gained 1.2k upvotes on HN within hours of launch.',
    score: 6,
    tags: ['Open Source', 'Local LLM', 'Go'],
  },
];

const MOCK_JA: NewsItem[] = MOCK_EN.map((item) => ({
  ...item,
  summary: {
    'mock-1': 'AnthropicがClaude 4を発表。最大100万トークンのコンテキストと拡張思考モードを搭載し、複雑な推論タスクで従来比40%の性能向上を達成。エンタープライズ向けAPIも同日公開。',
    'mock-2': 'OpenAIがGPT-5を正式リリース。テキスト・画像・音声・動画をリアルタイムで統合処理するマルチモーダル推論を実現。ChatGPT Plusユーザーから順次提供開始。',
    'mock-3': 'Google DeepMindがGemini Ultra 3を発表。MMLU Proベンチマークで人間レベル（95.2%）を達成。Google検索・Workspaceへの統合も発表され、エンタープライズ展開が加速。',
    'mock-4': 'EU AI法の強制適用が開始。OpenAI・Anthropic・Google等は2026年Q2までにリスク管理・透明性報告の義務を負う。非準拠の場合、年間売上の3%相当の罰金。',
    'mock-5': 'Mistral AIがMistral Large 3をオープンウェイトで公開。128Kトークンのコンテキスト、Apache 2.0ライセンス。コーディング・数学タスクでGPT-4oと同等以上の性能。',
    'mock-6': 'Hugging FaceがSmolLM3を発表。1.7BパラメータながらiPhone/Androidでオフライン動作可能。エッジAIの実用化に向けた重要マイルストーン。',
    'mock-7': 'MicrosoftとOpenAIが戦略的提携を延長。AGI安全性研究に100億ドルを追加投資。Azure上でのOpenAIモデル独占展開も継続。',
    'mock-8': 'Stanford HAIの年次報告書によると、Fortune 500企業の87%が2025年にAIを業務導入済み。AI人材不足が普及の障壁として浮上。',
    'mock-9': 'AnthropicがConstitutional AI 2.0の研究を発表。有害出力を60%削減しつつ有用性は維持。次世代Claudeモデルへの組み込みが予定。',
    'mock-10': '開発者がllama.cppとGoを使ったローカルLLMオーケストレーションツールをOSSで公開。複数モデルの並列実行・ルーティング・コスト管理が可能。HNで1.2k以上のアップボート。',
  }[item.id] ?? item.summary,
}));

export function getMockNews(lang: Language): NewsItem[] {
  const data = lang === 'ja' ? MOCK_JA : MOCK_EN;
  return [...data].sort((a, b) => b.score - a.score);
}
