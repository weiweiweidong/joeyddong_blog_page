/* global hexo */
'use strict';
const fs = require('fs');
const { array, languages, articleLanguage, excerpt, readingTime, day, searchText, paginate } = require('../themes/joeyddong/lib/content.cjs');
// Complete language-filtered collections, rather than hiding only the current page.
hexo.extend.generator.register('joey_language_lists', locals => {
  const all = array(locals.posts.sort('-date'));
  const contexts = [{ base: '', posts: all, data: {} }, { base: 'archives/', posts: all, data: { archive: true } }];
  for (const [field, prefix] of [['categories','categories'], ['tags','tags']]) {
    array(locals[field]).forEach(term => contexts.push({ base: term.path, posts: array(term.posts.sort('-date')), data: { [prefix === 'categories' ? 'category' : 'tag']: term.name } }));
  }
  const groups = new Map();
  all.forEach(post => {
    const d = day(post.date), year = d.slice(0,4), month = d.slice(5,7);
    for (const base of [`archives/${year}/`, `archives/${year}/${month}/`]) {
      if (!groups.has(base)) groups.set(base, []);
      groups.get(base).push(post);
    }
  });
  groups.forEach((posts, base) => contexts.push({ base, posts, data: { archive: true, year: Number(base.split('/')[1]), month: Number(base.split('/')[2]) || undefined } }));
  return contexts.flatMap(context => languages.flatMap(language => paginate(context.posts.filter(p => articleLanguage(p) === language), `${context.base}language/${language}/`, hexo.config.per_page).map(route => ({
    ...route, layout: 'index', data: { ...route.data, ...context.data, list_base: context.base, article_filter: language }
  }))));
});
hexo.extend.generator.register('joey_search_index', locals => ({
  path: 'search-index.json', data: JSON.stringify(array(locals.posts.sort('-date')).map(post => ({
    title: post.title, url: '/' + post.path, summary: excerpt(post), text: searchText(post),
    language: articleLanguage(post), date: day(post.date), minutes: readingTime(post),
    tags: array(post.tags).map(t => t.name), categories: array(post.categories).map(c => c.name), test: Boolean(post.test)
  })))
}));
// Explicit updates only: never derive editorial updates from file timestamps.
hexo.extend.filter.register('before_post_render', post => {
  if (post.last_updated && (!day(post.last_updated) || day(post.last_updated) < day(post.date))) throw new Error(`Invalid last_updated in ${post.source}`);
  if (post.article_lang && !languages.includes(post.article_lang)) throw new Error(`Invalid article_lang in ${post.source}`);
  return post;
});
hexo.extend.generator.register('joey_404', () => ({ path: '404.html', layout: 'not-found', data: { title: 'Page not found' } }));
