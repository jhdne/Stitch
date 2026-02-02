/**
 * Prompt Optimizer Engine
 * Based on Google AI Stitch Official Prompt Guide
 * https://discuss.ai.google.dev/t/stitch-prompt-guide/83844
 */

export interface OptimizationResult {
  original: string;
  optimized: string;
  improvements: string[];
  category: 'high-level' | 'detailed' | 'refinement' | 'theming' | 'general';
}

export interface OptimizationRule {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const optimizationRules: OptimizationRule[] = [
  {
    id: 'clear-specific',
    title: '清晰具体',
    description: '明确告诉 AI 要改变什么以及如何改变。避免模糊的指令，使用精确的描述。',
    icon: 'Target'
  },
  {
    id: 'one-thing',
    title: '一次一事',
    description: '每次只做一个或两个调整，而不是一次性尝试改变所有内容。',
    icon: 'CheckCircle2'
  },
  {
    id: 'focus-screen',
    title: '聚焦屏幕',
    description: '针对特定屏幕或组件进行优化，而不是泛泛地描述整个应用。',
    icon: 'Monitor'
  },
  {
    id: 'use-adjectives',
    title: '使用形容词',
    description: '用形容词定义应用氛围和风格，如"充满活力的"、"极简的"。',
    icon: 'Palette'
  },
  {
    id: 'ui-keywords',
    title: 'UI/UX 关键词',
    description: '使用专业术语如 "navigation bar"、"call-to-action button"、"card layout"。',
    icon: 'Layout'
  },
  {
    id: 'specific-reference',
    title: '具体引用',
    description: '精确引用元素，如"登录页面的主按钮"、"英雄区域的图片"。',
    icon: 'MousePointer2'
  }
];

export const promptTips = [
  {
    title: '从简单开始',
    content: '先用简单提示开始，然后逐步细化和复杂化。不要一开始就写超长提示。'
  },
  {
    title: '避免混合',
    content: '不要在一个提示中混合布局变化和 UI 组件修改，分开处理效果更好。'
  },
  {
    title: '迭代优化',
    content: '通过多次迭代逐步完善，每次基于上次结果继续优化。'
  },
  {
    title: '检查长度',
    content: '避免超过 5000 字符的长提示，可能导致组件遗漏。'
  },
  {
    title: '保存进度',
    content: '每步成功后保存结果，便于回溯和对比。'
  }
];

// Keywords for categorization
const highLevelKeywords = ['app for', 'application', 'website', 'platform', 'tool for'];
const detailedKeywords = ['page', 'screen', 'component', 'button', 'header', 'footer', 'card', 'modal'];
const themingKeywords = ['color', 'theme', 'style', 'font', 'background', 'vibe', 'modern', 'minimal'];

// UI/UX vocabulary to suggest
const uiVocabulary = [
  'navigation bar', 'call-to-action button', 'hero section', 'card layout',
  'dropdown menu', 'sidebar', 'footer', 'header', 'modal dialog',
  'form field', 'input group', 'tab bar', 'breadcrumb', 'pagination'
];

// Adjectives for vibe
const vibeAdjectives = [
  'vibrant', 'minimalist', 'modern', 'elegant', 'professional',
  'playful', 'serious', 'clean', 'bold', 'subtle', 'luxurious',
  'friendly', 'technical', 'creative', 'corporate'
];

function detectCategory(prompt: string): 'high-level' | 'detailed' | 'refinement' | 'theming' | 'general' {
  const lower = prompt.toLowerCase();
  
  if (themingKeywords.some(k => lower.includes(k))) return 'theming';
  if (detailedKeywords.some(k => lower.includes(k))) return 'detailed';
  if (highLevelKeywords.some(k => lower.includes(k))) return 'high-level';
  return 'general';
}

function analyzePrompt(prompt: string): { issues: string[]; suggestions: string[] } {
  const issues: string[] = [];
  const suggestions: string[] = [];
  const lower = prompt.toLowerCase();
  
  // Check for vagueness
  const vagueWords = ['good', 'nice', 'better', 'improve', 'make it pretty'];
  vagueWords.forEach(word => {
    if (lower.includes(word)) {
      issues.push(`使用了模糊词汇: "${word}"`);
      suggestions.push('使用具体的描述替代模糊词汇');
    }
  });
  
  // Check for multiple actions
  const actionWords = ['and', 'also', 'plus', 'then'];
  const actionCount = actionWords.reduce((count, word) => {
    return count + (lower.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
  }, 0);
  if (actionCount > 2) {
    issues.push('可能包含过多的修改请求');
    suggestions.push('将修改拆分为多个步骤，每次聚焦一个或两个调整');
  }
  
  // Check length
  if (prompt.length > 5000) {
    issues.push('提示词过长（超过5000字符）');
    suggestions.push('简化提示词，分多次迭代优化');
  }
  
  // Check for UI vocabulary
  const hasUiVocab = uiVocabulary.some(term => lower.includes(term));
  if (!hasUiVocab && lower.length > 50) {
    suggestions.push('使用 UI/UX 专业术语，如 "navigation bar"、"call-to-action"');
  }
  
  // Check for adjectives
  const hasAdjectives = vibeAdjectives.some(adj => lower.includes(adj));
  if (!hasAdjectives && !lower.includes('style')) {
    suggestions.push('添加形容词定义应用氛围，如 "modern"、"minimalist"');
  }
  
  // Check for specific location
  const locationWords = ['page', 'screen', 'section', 'on the', 'in the'];
  const hasLocation = locationWords.some(word => lower.includes(word));
  if (!hasLocation && lower.length > 30) {
    suggestions.push('指定具体位置，如 "On the homepage"、"In the header"');
  }
  
  return { issues, suggestions };
}

function optimizeForCategory(prompt: string, category: string): string {
  const trimmed = prompt.trim();
  
  switch (category) {
    case 'high-level':
      // Enhance high-level concept with more details
      if (!trimmed.toLowerCase().includes('with') && !trimmed.toLowerCase().includes('featuring')) {
        return `${trimmed} with a modern, clean design featuring intuitive navigation and clear call-to-action elements.`;
      }
      return trimmed;
      
    case 'detailed':
      // Make detailed prompts more specific
      let enhanced = trimmed;
      if (!trimmed.toLowerCase().includes('style') && !trimmed.toLowerCase().includes('design')) {
        enhanced += ' Use a clean, professional style with consistent spacing and typography.';
      }
      return enhanced;
      
    case 'theming':
      // Enhance theming prompts
      if (!trimmed.toLowerCase().includes('ensure') && !trimmed.toLowerCase().includes('consistent')) {
        return `${trimmed} Ensure all elements maintain visual consistency and accessibility standards.`;
      }
      return trimmed;
      
    default:
      return trimmed;
  }
}

export function optimizePrompt(prompt: string): OptimizationResult {
  const category = detectCategory(prompt);
  const { issues, suggestions } = analyzePrompt(prompt);
  
  // Build optimized prompt
  let optimized = optimizeForCategory(prompt, category);
  
  // Add specificity if missing
  const lower = prompt.toLowerCase();
  
  // Structure the optimized prompt according to best practices
  const improvements: string[] = [];
  
  if (issues.length > 0) {
    improvements.push(...issues.map(i => `修复: ${i}`));
  }
  if (suggestions.length > 0) {
    improvements.push(...suggestions.slice(0, 3).map(s => `建议: ${s}`));
  }
  
  // If no issues found, add positive feedback
  if (improvements.length === 0) {
    improvements.push('提示词结构良好');
    improvements.push('包含了具体的描述');
    improvements.push('可以继续迭代优化');
  }
  
  // Final polish based on category
  if (category === 'high-level') {
    // For high-level, suggest adding more details
    if (!lower.includes('features') && !lower.includes('functionality')) {
      improvements.push('建议: 添加核心功能描述以获得更好的起始点');
    }
  } else if (category === 'detailed') {
    // For detailed, ensure it's focused
    improvements.push('建议: 每次只修改一个或两个元素，便于精确控制');
  }
  
  return {
    original: prompt,
    optimized,
    improvements,
    category
  };
}

// Example prompts for demonstration
export const examplePrompts = {
  before: [
    'An app for marathon runners',
    'Make the homepage better',
    'Product page for tea store',
    'Change the colors to blue'
  ],
  after: [
    'An app for marathon runners to engage with a community, find partners, get training advice, and find races near them. Use a vibrant and encouraging design style.',
    'On the homepage, add a search bar to the header and increase the size of the primary call-to-action button. Use the brand\'s primary blue color for the button.',
    'Product detail page for a Japandi-styled tea store. Sells herbal teas and ceramics. Use neutral, minimal colors with black buttons and soft, elegant typography.',
    'Update the theme to dark blue as the primary color. Ensure all buttons, links, and icons reflect this new color scheme consistently across all screens.'
  ]
};
