import { Sparkles, ExternalLink, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[#3a3a3a]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f2f047]/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#f2f047]" />
            </div>
            <div>
              <span className="font-bold text-white">Prompt Optimizer Pro</span>
              <p className="text-xs text-[#666]">基于 Google AI Stitch 官方指南</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a 
              href="https://discuss.ai.google.dev/t/stitch-prompt-guide/83844"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#a0a0a0] hover:text-[#f2f047] transition-colors flex items-center gap-1"
            >
              官方指南
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="#optimizer"
              className="text-sm text-[#a0a0a0] hover:text-[#f2f047] transition-colors"
            >
              优化器
            </a>
            <a 
              href="#rules"
              className="text-sm text-[#a0a0a0] hover:text-[#f2f047] transition-colors"
            >
              规则
            </a>
            <a 
              href="#examples"
              className="text-sm text-[#a0a0a0] hover:text-[#f2f047] transition-colors"
            >
              示例
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a 
              href="#"
              className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#a0a0a0] hover:bg-[#f2f047] hover:text-[#212121] transition-all duration-300"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="#"
              className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#a0a0a0] hover:bg-[#f2f047] hover:text-[#212121] transition-all duration-300"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-[#3a3a3a] text-center">
          <p className="text-sm text-[#666]">
            © 2025 Prompt Optimizer Pro. 基于 Google AI Stitch 官方提示词指南构建。
          </p>
        </div>
      </div>
    </footer>
  );
}
