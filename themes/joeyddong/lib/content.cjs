'use strict';
const { stripHTML } = require('hexo-util');
const languages = ['en', 'zh', 'ja'];
function array(items) { return items?.toArray ? items.toArray() : Array.from(items || []); }
function articleLanguage(post) {
  const language = post.article_lang || post.lang || post.language || 'en';
  return languages.includes(language) ? language : 'en';
}
function plainMarkdown(raw, summary = false) {
  let text = String(raw || '').replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
  if (summary) text = text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, '').replace(/^(?: {4}|\t).*$/gm, '').replace(/`[^`]*`/g, '').replace(/\$\$[\s\S]*?\$\$/g, '').replace(/\$[^$\n]+\$/g, '');
  return stripHTML(text.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/^\s*[#>*+-]+\s*/gm, '').replace(/(^|\s)__([^_\n]+)__(?=$|[\s.,!?])/g, '$1$2').replace(/(^|\s)_([^_\n]+)_(?=$|[\s.,!?])/g, '$1$2').replace(/[`*~|]/g, '').replace(/<!--.*?-->/gs, '')).replace(/\s+/g, ' ').trim();
}
function excerpt(post) { return String(post.summary || '').trim() || plainMarkdown(post._content, true).slice(0, 180); }
function searchText(post) { return post.content ? stripHTML(post.content).replace(/\s+/g, ' ').trim() : plainMarkdown(post._content); }
function readingTime(post) {
  const text = plainMarkdown(post._content);
  const cjk = (text.match(/[\u3040-\u30ff\u3400-\u9fff]/g) || []).length;
  const words = (text.replace(/[\u3040-\u30ff\u3400-\u9fff]/g, '').match(/\S+/g) || []).length;
  return Math.max(1, Math.ceil(cjk / 400 + words / 200));
}
function day(value) {
  if (!value) return '';
  if (typeof value.format === 'function') return value.format('YYYY-MM-DD');
  const string = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(string)) {
    const parsed = new Date(string + 'T00:00:00+09:00');
    return Number.isNaN(parsed.getTime()) || new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(parsed) !== string ? '' : string;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(parsed);
}
function updatedDay(post) { const updated = day(post.last_updated); return updated && updated >= day(post.date) ? updated : ''; }
function listBase(page) {
  if (page.list_base !== undefined) return page.list_base;
  if (typeof page.base === 'string') return page.base.replace(/^\//, '');
  if (page.category) return `categories/${page.category}/`;
  if (page.tag) return `tags/${page.tag}/`;
  if (page.archive) return `archives/${page.year ? page.year + '/' : ''}${page.month ? String(page.month).padStart(2, '0') + '/' : ''}`;
  return '';
}
function languagePath(base, language) { return '/' + base + (language === 'all' ? '' : `language/${language}/`); }
function paginate(posts, base, size = 10) {
  const total = Math.max(1, Math.ceil(posts.length / size));
  return Array.from({ length: total }, (_, i) => ({
    path: `${base}${i ? `page/${i + 1}/` : ''}index.html`,
    data: { posts: posts.slice(i * size, (i + 1) * size), current: i + 1, total, base, per_page: size }
  }));
}
module.exports = { languages, array, articleLanguage, plainMarkdown, searchText, excerpt, readingTime, day, updatedDay, listBase, languagePath, paginate };
