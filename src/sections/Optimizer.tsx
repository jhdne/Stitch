import { useState, useRef } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  ArrowRight,
  Wand2,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { optimizePrompt, type OptimizationResult } from '@/lib/promptOptimizer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function Optimizer() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const optimizeWithApi = async (prompt: string): Promise<OptimizationResult> => {
    const resp = await fetch('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => null);
      const msg = typeof err?.error === 'string' ? err.error : `HTTP ${resp.status}`;
      throw new Error(msg);
    }

    const data = await resp.json();
    return {
      original: typeof data?.original === 'string' ? data.original : prompt,
      optimized: typeof data?.optimized === 'string' ? data.optimized : '',
      improvements: Array.isArray(data?.improvements) ? data.improvements : [],
      category: data?.category ?? 'general',
    } as OptimizationResult;
  };

  const handleOptimize = async () => {
    if (!input.trim()) {
      toast.error('请输入提示词');
      return;
    }

    setIsOptimizing(true);
    setShowComparison(false);

    // Simulate processing delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const optimizationResult = await optimizeWithApi(input);
      setResult(optimizationResult);
      toast.success('已使用大模型完成优化');
    } catch (e) {
      // Fallback to local heuristic optimizer (no network / API issues)
      const fallback = optimizePrompt(input);
      setResult(fallback);
      const msg = e instanceof Error ? e.message : '调用失败';
      toast.error(`大模型调用失败，已使用本地规则优化：${msg}`);
    }
    setIsOptimizing(false);

    // Scroll to result
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCopy = async () => {
    if (result?.optimized) {
      await navigator.clipboard.writeText(result.optimized);
      setCopied(true);
      toast.success('已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
    setShowComparison(false);
  };

  const loadExample = (example: string) => {
    setInput(example);
    setResult(null);
  };

  const examples = [
    'An app for marathon runners',
    'Make the homepage look better',
    'Product page for a tea store'
  ];

  return (
    <section id="optimizer" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-[#f2f047]/30 bg-[#f2f047]/5">
            <Wand2 className="w-4 h-4 text-[#f2f047]" />
            <span className="text-sm text-[#f2f047] font-medium">核心功能</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            提示词优化器
          </h2>
          <p className="text-lg text-[#a0a0a0] max-w-2xl mx-auto">
            输入您的提示词，我们将根据 Google AI Stitch 官方指南进行智能优化
          </p>
        </div>

        {/* Example Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="text-sm text-[#a0a0a0] py-2">快速示例:</span>
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => loadExample(example)}
              className="px-4 py-2 text-sm bg-[#2a2a2a] text-[#a0a0a0] rounded-full border border-[#3a3a3a] hover:border-[#f2f047] hover:text-[#f2f047] transition-all duration-200"
            >
              {example}
            </button>
          ))}
        </div>

        {/* Main Optimizer Interface */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <div className="bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#3a3a3a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f2f047]/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#f2f047]" />
                </div>
                <span className="font-semibold text-white">输入您的提示词</span>
              </div>
              <span className="text-xs text-[#a0a0a0]">{input.length} 字符</span>
            </div>
            <div className="p-6">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="例如: An app for marathon runners..."
                className="min-h-[280px] bg-[#1a1a1a] border-[#3a3a3a] text-white placeholder:text-[#666] font-mono text-sm resize-none focus:border-[#f2f047] focus:ring-[#f2f047]/20"
              />
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={handleReset}
                  className="text-sm text-[#a0a0a0] hover:text-white transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  重置
                </button>
                <Button
                  onClick={handleOptimize}
                  disabled={isOptimizing || !input.trim()}
                  className="bg-[#f2f047] text-[#212121] hover:bg-[#f2f047]/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold px-6"
                >
                  {isOptimizing ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      优化中...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4" />
                      优化提示词
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Output Area */}
          <div 
            ref={resultRef}
            className={`bg-[#2a2a2a] rounded-2xl border overflow-hidden transition-all duration-500 ${
              result ? 'border-[#f2f047]/50' : 'border-[#3a3a3a]'
            }`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#3a3a3a]">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  result ? 'bg-[#f2f047]/20' : 'bg-[#3a3a3a]'
                }`}>
                  <Sparkles className={`w-4 h-4 transition-colors ${
                    result ? 'text-[#f2f047]' : 'text-[#666]'
                  }`} />
                </div>
                <span className="font-semibold text-white">优化后的提示词</span>
              </div>
              {result && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="text-xs text-[#f2f047] hover:underline"
                  >
                    {showComparison ? '隐藏对比' : '显示对比'}
                  </button>
                </div>
              )}
            </div>
            <div className="p-6">
              {result ? (
                <div className="space-y-4">
                  {/* Optimized Text */}
                  <div className="min-h-[200px] bg-[#1a1a1a] rounded-xl p-4 border border-[#3a3a3a]">
                    <p className="font-mono text-sm text-white leading-relaxed whitespace-pre-wrap">
                      {result.optimized}
                    </p>
                  </div>

                  {/* Comparison View */}
                  {showComparison && (
                    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#3a3a3a] animate-fade-in-up">
                      <div className="text-xs text-[#a0a0a0] mb-2 flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" />
                        原始提示词
                      </div>
                      <p className="font-mono text-sm text-[#666] line-through">
                        {result.original}
                      </p>
                    </div>
                  )}

                  {/* Improvements */}
                  <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#f2f047]/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-[#f2f047]" />
                      <span className="text-sm font-medium text-[#f2f047]">优化建议</span>
                    </div>
                    <ul className="space-y-2">
                      {result.improvements.map((improvement, index) => (
                        <li 
                          key={index}
                          className="text-sm text-[#a0a0a0] flex items-start gap-2"
                        >
                          <ArrowRight className="w-4 h-4 text-[#f2f047] mt-0.5 flex-shrink-0" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      onClick={handleOptimize}
                      variant="outline"
                      className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      重新优化
                    </Button>
                    <Button
                      onClick={handleCopy}
                      className="bg-[#f2f047] text-[#212121] hover:bg-[#f2f047]/90"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          复制结果
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[280px] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#3a3a3a] flex items-center justify-center mb-4">
                    <Wand2 className="w-8 h-8 text-[#666]" />
                  </div>
                  <p className="text-[#666] mb-2">优化结果将显示在这里</p>
                  <p className="text-sm text-[#555]">输入提示词并点击优化按钮</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
