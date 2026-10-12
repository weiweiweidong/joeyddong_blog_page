const { Component, Fragment } = require('inferno');
const { createElement } = require('inferno-create-element');
const messages = require('../../source/js/messages');
const { array, articleLanguage, readingTime, day, updatedDay, listBase, languagePath } = require('../../lib/content.cjs');
const Text = ({ k, tag = 'span', ...props }) => {
  return createElement(tag, { ...props, 'data-i18n': k }, messages.en[k] || k);
};
const Category = ({ name }) => messages.en['cat.' + name] ? <Text k={'cat.' + name} /> : <span>{name}</span>;
const Terms = ({ post, helper }) => <div class="article-terms">
  {array(post.categories).map(c => <a class="category-chip" href={helper.url_for(c.path)}><Category name={c.name} /></a>)}
  {array(post.tags).map(t => <a class="tag-chip" href={helper.url_for(t.path)}>#{t.name}</a>)}
</div>;
const Meta = ({ post }) => <div class="article-meta">
  <time dateTime={day(post.date)}>{day(post.date)}</time>
  {updatedDay(post) ? <span><Text k="updated" /> <time dateTime={updatedDay(post)}>{updatedDay(post)}</time></span> : null}
  <span>{readingTime(post)} <Text k="minutes" /></span>
  <span class="language-badge" lang={articleLanguage(post)}>{({ en: 'English', zh: '中文', ja: '日本語' })[articleLanguage(post)]}</span>
  {post.test ? <Text k="test" tag="span" class="test-badge" /> : null}
</div>;
const Filter = ({ page, helper }) => <label class="article-filter"><Text k="articleLanguage" />
  <select data-list-filter aria-label="Article language" data-i18n-aria="articleLanguage" value={page.article_filter || 'all'}>
    {['all','en','zh','ja'].map(l => <option value={helper.url_for(languagePath(listBase(page), l))} selected={l === (page.article_filter || 'all')} data-i18n={l === 'all' ? 'all' : undefined}>{l === 'all' ? 'All languages' : ({en:'English',zh:'中文',ja:'日本語'})[l]}</option>)}
  </select>
</label>;
const Pagination = ({ page, helper }) => {
  if (!(page.total > 1)) return null;
  const base = page.base || '';
  const link = n => helper.url_for('/' + base + (n > 1 ? `page/${n}/` : ''));
  return <nav class="pagination blog-pagination" aria-label="Pagination">
    {page.current > 1 ? <a class="pagination-previous" href={link(page.current - 1)} rel="prev"><Text k="previous" /></a> : null}
    <div class="page-numbers">{Array.from({length:page.total}, (_, i) => i + 1).filter(n => page.total <= 7 || n === 1 || n === page.total || Math.abs(n - page.current) <= 1).map((n,i,list) => <Fragment>{i && n - list[i-1] > 1 ? <span>…</span> : null}<a class={n === page.current ? 'current' : ''} aria-current={n === page.current ? 'page' : undefined} href={link(n)}>{n}</a></Fragment>)}</div>
    {page.current < page.total ? <a class="pagination-next" href={link(page.current + 1)} rel="next"><Text k="next" /></a> : null}
  </nav>;
};
const Profile = ({ site, helper }) => <aside class="column column-left"><div class="card profile-card"><div class="card-content">
  <img class="avatar" src={helper.url_for('/assets/images/avatar.png')} alt="JoeyDDong GitHub avatar" width="112" height="112" loading="lazy" />
  <p class="profile-name">JoeyDDong<span>.</span></p><Text k="intro" tag="p" class="profile-intro" />
  <div class="profile-stats">{[['posts',site.posts.length,'/archives/'],['categories',site.categories.length,'/categories/'],['tags',site.tags.length,'/tags/']].map(([k,n,url]) => <a href={helper.url_for(url)}><strong>{n}</strong><Text k={k} /></a>)}</div>
  <a class="brand-button" href="https://github.com/weiweiweidong">GitHub ↗</a>
  <a class="profile-portfolio" href="https://joeyddong-site.top/portfolio/" data-destination="portfolio"><Text k="nav.portfolio" /> ↗</a>
</div></div></aside>;
const SidebarModule = ({ k, children, color }) => <details class={'card sidebar-module ' + (color || '')} open><summary><Text k={k} /><span aria-hidden="true">＋</span></summary><div class="sidebar-content">{children}</div></details>;
const Sidebars = ({ site, helper }) => {
  const recent = array(site.posts.sort('-date')).slice(0,5);
  const months = new Map();
  array(site.posts.sort('-date')).forEach(p => { const m = day(p.date).slice(0,7); months.set(m,(months.get(m) || 0)+1); });
  return <aside class="column column-right">
    <SidebarModule k="recents" color="coral"><div class="recent-list">{recent.map(p => <a href={helper.url_for(p.path)}><time dateTime={day(p.date)}>{day(p.date)}</time><span>{p.title}</span></a>)}</div></SidebarModule>
    <SidebarModule k="categories" color="coral-light"><ul class="term-list">{array(site.categories).map(c => <li><a href={helper.url_for(c.path)}><Category name={c.name}/><span>{c.posts.length}</span></a></li>)}</ul></SidebarModule>
    <SidebarModule k="tags" color="coral"><div class="tag-cloud">{array(site.tags).map(t => <a href={helper.url_for(t.path)}>#{t.name}<small>{t.posts.length}</small></a>)}</div></SidebarModule>
    <SidebarModule k="archives" color="coral-light"><ul class="term-list">{Array.from(months).slice(0,8).map(([m,n]) => <li><a href={helper.url_for('/archives/' + m.replace('-','/') + '/')}><span>{m}</span><span>{n}</span></a></li>)}</ul></SidebarModule>
  </aside>;
};
const Toc = ({ page, helper }) => {
  const html = helper.toc(page.content || '', { list_number: false });
  return <details class="card toc-card" open><summary><Text k="toc" /></summary><nav class="toc-links" aria-label="On this page" data-i18n-aria="toc" dangerouslySetInnerHTML={{ __html: html || '<span data-i18n="noToc">No section headings</span>' }} /></details>;
};
module.exports = { Text, Category, Terms, Meta, Filter, Pagination, Profile, Sidebars, Toc };
