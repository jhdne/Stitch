import { useEffect, useRef } from 'react';
import { Sparkles, ArrowDown, Zap } from 'lucide-react';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Staggered animation on mount
    const elements = [titleRef.current, subtitleRef.current, ctaRef.current];
    elements.forEach((el, index) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
          el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 100 + index * 200);
      }
    });
  }, []);

  const scrollToOptimizer = () => {
    document.getElementById('optimizer')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRules = () => {
    document.getElementById('rules')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#212121]">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f2f047]/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#f2f047]/3 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(242, 240, 71, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(242, 240, 71, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
        {/* Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-[#f2f047]/30 bg-[#f2f047]/5"
          style={{ opacity: 0 }}
          ref={titleRef}
        >
          <Sparkles className="w-4 h-4 text-[#f2f047]" />
          <span className="text-sm text-[#f2f047] font-medium">基于 Google AI Stitch 官方指南</span>
        </div>

        {/* Main Title */}
        <h1 
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight"
          style={{ opacity: 0 }}
        >
          <span className="text-white">Prompt</span>
          <span className="text-[#f2f047]"> Optimizer</span>
          <span className="text-white"> Pro</span>
        </h1>

        {/* Subtitle */}
        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl text-[#a0a0a0] max-w-3xl mx-auto mb-12 leading-relaxed"
          style={{ opacity: 0 }}
        >
          将您的提示词优化为专业级 AI 指令
          <br className="hidden sm:block" />
          让每一次 AI 交互都更加精准高效
        </p>

        {/* CTA Buttons */}
        <div 
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ opacity: 0 }}
        >
          <button 
            onClick={scrollToOptimizer}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#f2f047] text-[#212121] font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(242,240,71,0.4)]"
          >
            <Zap className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span>开始优化</span>
          </button>
          
          <button 
            onClick={scrollToRules}
            className="group inline-flex items-center gap-3 px-8 py-4 border border-[#f2f047] text-[#f2f047] font-semibold rounded-xl transition-all duration-300 hover:bg-[#f2f047] hover:text-[#212121]"
          >
            <span>查看指南</span>
            <ArrowDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { value: '6', label: '核心规则' },
            { value: '500+', label: '已优化提示词' },
            { value: '98%', label: '满意度' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="text-center"
              style={{ 
                opacity: 0,
                animation: `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${0.8 + index * 0.1}s forwards`
              }}
            >
              <div className="text-3xl md:text-4xl font-bold text-[#f2f047] mb-1">{stat.value}</div>
              <div className="text-sm text-[#a0a0a0]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#212121] to-transparent" />
    </section>
  );
}
