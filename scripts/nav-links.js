// input: 全站导航链接的「唯一真实来源」（EN/FR）与页面语言判定
// output: enNavLinks / frNavLinks（{href,label}[]）、pageLanguage(relative)、canonicalHrefs(lang)
// pos: scripts/nav-links.js（更新规则：导航增删只改这里；build.js 与 check-nav.js 都引用本文件，禁止在别处再写一份）
//
// 为什么集中在这里：导航链接若在两处（build.js 注入、check-nav.js 校验）各写一份，
// 迟早会漂移，导致"构建注入的链接"与"校验期望的链接"不一致。统一引用本文件可彻底杜绝。

const enNavLinks = [
  { href: '/', label: 'Generator' },
  { href: '/blank-text-generator', label: 'Blank Text' },
  { href: '/tiktok-invisible-username-generator', label: 'TikTok' },
  { href: '/invisible-name-generator', label: 'Names' },
  { href: '/tools', label: 'Tools' },
  { href: '/blog/', label: 'Blog' }
];

const frNavLinks = [
  { href: '/index-fr', label: 'Accueil' },
  { href: '/fr/caractere-invisible', label: 'Caractère invisible' },
  { href: '/fr/pseudo-invisible-tiktok', label: 'TikTok' },
  { href: '/fr/message-vide-whatsapp', label: 'WhatsApp' },
  { href: '/fr/saut-de-ligne-instagram', label: 'Instagram' },
  { href: '/fr/pseudo-invisible-discord', label: 'Discord' },
  { href: '/blog/fr/', label: 'Blog' }
];

// 页面语言判定：与 build.js 的 isFrenchPage、check-seo.js 的 expectedLang 必须一致。
// 规则：index-fr.html、任意 *-fr.html、blog/fr/ 下、fr/ 下的页面均为法语。
function pageLanguage(relative) {
  const norm = relative.replace(/\\/g, '/');
  if (norm === 'index-fr.html' ||
      norm.endsWith('-fr.html') ||
      norm.startsWith('blog/fr/') ||
      norm.startsWith('fr/')) {
    return 'fr';
  }
  return 'en';
}

// 返回某语言的标准导航 href 集合（用于校验时做集合比较）。
function canonicalHrefs(lang) {
  return (lang === 'fr' ? frNavLinks : enNavLinks).map(link => link.href);
}

module.exports = { enNavLinks, frNavLinks, pageLanguage, canonicalHrefs };
