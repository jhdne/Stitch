import { useState } from 'react';
import { ArrowRight, Check, X, Eye, Code2 } from 'lucide-react';

interface Example {
  category: string;
  before: string;
  after: string;
  improvements: string[];
}

const examples: Example[] = [
  {
    category: '电商产品页',
    before: 'Product page for a tea store',
    after: 'Product detail page for a Japandi-styled tea store. Sells herbal teas, ceramics. Neutral, minimal colors, black buttons. Soft, elegant font.',
    improvements: ['添加具体风格 (Japandi)', '指定产品类型', '定义颜色和字体']
  },
  {
    category: '健身追踪应用',
    before: 'An app for marathon runners',
    after: 'An app for marathon runners to engage with a community, find partners, get training advice, and find races near them. Use a vibrant and encouraging design style.',
    improvements: ['添加核心功能描述', '使用形容词定义氛围', '明确目标用户']
  },
  {
    category: '仪表板界面',
    before: 'Make the dashboard better',
    after: 'On the dashboard, add a search bar to the header and increase the size of the primary call-to-action button. Use the brand\'s primary blue color for the button.',
    improvements: ['指定具体位置', '明确修改内容', '定义颜色规范']
  }
];

export default function Examples() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDiff, setShowDiff] = useState(true);

  const activeExample = examples[activeIndex];

  return (
    <section id="examples" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-[#f2f047]/30 bg-[#f2f047]/5">
            <Code2 className="w-4 h-4 text-[#f2f047]" />
            <span className="text-sm text-[#f2f047] font-medium">优化案例</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            前后对比
          </h2>
          <p className="text-lg text-[#a0a0a0] max-w-2xl mx-auto">
            看看普通提示词如何进化为专业级 AI 指令
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-[#f2f047] text-[#212121]'
                  : 'bg-[#2a2a2a] text-[#a0a0a0] border border-[#3a3a3a] hover:border-[#f2f047] hover:text-[#f2f047]'
              }`}
            >
              {example.category}
            </button>
          ))}
        </div>

        {/* Comparison Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Before Card */}
          <div className="bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#3a3a3a] bg-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="font-semibold text-white">优化前</span>
              </div>
              <span className="text-xs text-red-500 font-medium">BEFORE</span>
            </div>
            <div className="p-6">
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-red-500/20">
                <p className="font-mono text-sm text-[#a0a0a0] leading-relaxed">
                  {activeExample.before}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-[#666]">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                过于简单，缺乏细节
              </div>
            </div>
          </div>

          {/* After Card */}
          <div className="bg-[#2a2a2a] rounded-2xl border border-[#f2f047]/30 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f2f047]/20 bg-[#f2f047]/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f2f047]/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#f2f047]" />
                </div>
                <span className="font-semibold text-white">优化后</span>
              </div>
              <span className="text-xs text-[#f2f047] font-medium">AFTER</span>
            </div>
            <div className="p-6">
              <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#f2f047]/20">
                <p className="font-mono text-sm text-white leading-relaxed">
                  {activeExample.after}
                </p>
              </div>
              <div className="mt-4 space-y-2">
                {activeExample.improvements.map((improvement, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-[#f2f047]">
                    <ArrowRight className="w-4 h-4" />
                    {improvement}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Diff View */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2a2a2a] text-[#a0a0a0] rounded-full border border-[#3a3a3a] hover:border-[#f2f047] hover:text-[#f2f047] transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            {showDiff ? '隐藏差异分析' : '显示差异分析'}
          </button>
        </div>

        {/* Diff Analysis */}
        {showDiff && (
          <div className="mt-8 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] p-6 animate-fade-in-up">
            <h4 className="text-lg font-semibold text-white mb-4">优化要点分析</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#f2f047]/10 flex items-center justify-center">
                  <span className="text-[#f2f047] font-bold">1</span>
                </div>
                <h5 className="font-medium text-white">具体化描述</h5>
                <p className="text-sm text-[#a0a0a0]">从模糊概念到具体功能、风格和元素的详细描述</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#f2f047]/10 flex items-center justify-center">
                  <span className="text-[#f2f047] font-bold">2</span>
                </div>
                <h5 className="font-medium text-white">添加风格定义</h5>
                <p className="text-sm text-[#a0a0a0]">使用形容词定义应用氛围，影响颜色、字体和整体感觉</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#f2f047]/10 flex items-center justify-center">
                  <span className="text-[#f2f047] font-bold">3</span>
                </div>
                <h5 className="font-medium text-white">明确目标位置</h5>
                <p className="text-sm text-[#a0a0a0]">指定具体屏幕、组件或区域，避免歧义</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
