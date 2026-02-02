import { useEffect, useRef, useState } from 'react';
import { 
  Target, 
  CheckCircle2, 
  Monitor, 
  Palette, 
  Layout, 
  MousePointer2,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { optimizationRules, promptTips } from '@/lib/promptOptimizer';

const iconMap: Record<string, React.ElementType> = {
  Target,
  CheckCircle2,
  Monitor,
  Palette,
  Layout,
  MousePointer2
};

export default function Rules() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="rules" className="py-24 px-6 bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-[#f2f047]/30 bg-[#f2f047]/5">
            <BookOpen className="w-4 h-4 text-[#f2f047]" />
            <span className="text-sm text-[#f2f047] font-medium">优化指南</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            六大核心规则
          </h2>
          <p className="text-lg text-[#a0a0a0] max-w-2xl mx-auto">
            遵循这些经过验证的规则，让您的提示词更加精准有效
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {optimizationRules.map((rule, index) => {
            const Icon = iconMap[rule.icon] || Target;
            const isVisible = visibleCards.has(index);

            return (
              <div
                key={rule.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                data-index={index}
                className={`group bg-[#2a2a2a] rounded-2xl p-6 border border-[#3a3a3a] card-hover ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-[#f2f047]/10 flex items-center justify-center mb-5 group-hover:bg-[#f2f047]/20 transition-colors">
                  <Icon className="w-7 h-7 text-[#f2f047] group-hover:scale-110 transition-transform" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#f2f047] transition-colors">
                  {rule.title}
                </h3>
                <p className="text-[#a0a0a0] leading-relaxed">
                  {rule.description}
                </p>

                {/* Number Badge */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-[#666] font-mono">RULE {String(index + 1).padStart(2, '0')}</span>
                  <div className="w-8 h-1 rounded-full bg-[#3a3a3a] overflow-hidden">
                    <div className="h-full bg-[#f2f047] w-0 group-hover:w-full transition-all duration-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white mb-3">专业技巧</h3>
            <p className="text-[#a0a0a0]">来自 Google AI Stitch 团队的实用建议</p>
          </div>

          <div className="space-y-4">
            {promptTips.map((tip, index) => (
              <div
                key={index}
                className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] overflow-hidden"
              >
                <button
                  onClick={() => setExpandedTip(expandedTip === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[#333] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-[#f2f047] rounded-full" />
                    <span className="font-semibold text-white">{tip.title}</span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#a0a0a0] transition-transform duration-300 ${
                      expandedTip === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedTip === index ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <div className="px-5 pb-5 pl-14">
                    <p className="text-[#a0a0a0] leading-relaxed">{tip.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
