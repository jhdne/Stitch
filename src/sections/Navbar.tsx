import { useState, useEffect } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';

const navLinks = [
  { label: '优化器', href: '#optimizer' },
  { label: '规则', href: '#rules' },
  { label: '示例', href: '#examples' }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#212121]/90 backdrop-blur-lg border-b border-[#3a3a3a]' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a 
              href="#" 
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-9 h-9 rounded-lg bg-[#f2f047]/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#f2f047]" />
              </div>
              <span className="font-bold text-white hidden sm:block">Prompt Optimizer Pro</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-2 text-sm text-[#a0a0a0] hover:text-white rounded-lg hover:bg-[#2a2a2a] transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#optimizer"
                onClick={(e) => handleNavClick(e, '#optimizer')}
                className="ml-4 px-5 py-2 bg-[#f2f047] text-[#212121] text-sm font-semibold rounded-lg hover:brightness-110 transition-all duration-200"
              >
                开始优化
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-[#212121]/95 backdrop-blur-lg"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div 
          className={`absolute top-16 left-0 right-0 bg-[#1a1a1a] border-b border-[#3a3a3a] p-6 transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-3 text-lg text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#optimizer"
              onClick={(e) => handleNavClick(e, '#optimizer')}
              className="mt-4 px-4 py-3 bg-[#f2f047] text-[#212121] text-lg font-semibold rounded-lg text-center"
            >
              开始优化
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
