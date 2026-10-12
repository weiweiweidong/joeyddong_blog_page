/* Branded adaptation of the Icarus layout: retain column/card structure and SSR. */
const { Component, Fragment } = require('inferno');
const { Text, Profile, Sidebars, Toc } = require('./common/brand');
const { listBase, excerpt, coverImage } = require('../lib/content.cjs');
module.exports = class extends Component {
  render() {
    const { site, config, page, helper, body } = this.props;
    const post = page.__post === true || page.layout === 'post';
    const home = Boolean(page.posts) && !page.archive && !page.category && !page.tag && !page.__categories && !page.__tags && !listBase(page);
    const search = page.layout === 'search';
    const overview = !post && Boolean(home || page.archive || page.category || page.tag || page.__categories || page.__tags || search);
    const url = p => helper.url_for(p);
    const canonical = new URL(String(page.path || '').replace(/index\.html$/, ''), config.url + '/').href;
    const sectionTitle = page.category || page.tag || (search ? 'Search' : page.archive ? 'Archives' : page.__categories ? 'Categories' : page.__tags ? 'Tags' : page.layout === 'not-found' ? 'Page not found' : '');
    const title = post ? `${page.title} — JoeyDDong Blog` : `${sectionTitle ? sectionTitle + ' — ' : ''}JoeyDDong Blog`;
    return <html lang="en" data-overview={overview || post ? 'true' : undefined} data-page={home ? 'home' : post ? 'post' : search ? 'search' : 'list'}><head>
      <meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>{title.replace(/^ — /,'')}</title><meta name="description" content={post ? excerpt(page) : config.description}/>
      <meta name="theme-color" content="#cc4942"/><link rel="icon" href={url('/assets/favicon.svg')}/><link rel="canonical" href={canonical}/>
      <meta property="og:title" content={title}/><meta property="og:type" content={post ? 'article' : 'website'}/><meta property="og:url" content={canonical}/><meta property="og:description" content={post ? excerpt(page) : config.description}/>
      {coverImage(page) ? <meta property="og:image" content={new URL(coverImage(page),config.url).href}/> : null}
      <link rel="stylesheet" href={url('/css/default.css')}/><link rel="stylesheet" href={url('/css/joey.css')}/><link rel="stylesheet" href={url('/css/header.css')}/>
      {post ? <link rel="stylesheet" href={url('/vendor/katex/katex.min.css')}/> : null}
      <script src={url('/js/locale.js')}/><script defer src={url('/js/messages.js')}/><script defer src={url('/js/app.js')}/>
      {search ? <script defer src={url('/js/search.js')}/> : null}
    </head><body class={post ? 'is-2-column post-page' : 'is-3-column'} id="top">
      {overview || post ? <div class="hero-art" data-motion="on" aria-hidden="true"><span class="hero-circle"/><span class="hero-panel"/><span class="hero-ring"/></div> : null}
      <a class="skip-link" href="#main"><Text k="skip"/></a>
      <header class="brand-header"><div class="brand-shell header-inner">
        <a class="wordmark" href="https://joeyddong-site.top/" data-destination="home">JoeyDDong<span>.</span></a>
        <nav class="main-navigation" id="main-navigation" aria-label="Main navigation" data-i18n-aria="mainNav">
          {['home','blog','projects','photography','portfolio'].map(k => <a href={k === 'blog' ? url('/') : k === 'home' ? 'https://joeyddong-site.top/' : k === 'portfolio' ? 'https://joeyddong-site.top/portfolio/' : `https://${k}.joeyddong-site.top/`} data-destination={k} aria-current={k === 'blog' ? 'page' : undefined}><Text k={'nav.'+k}/></a>)}
        </nav>
        <div class="header-actions"><button class="menu-toggle" aria-expanded="false" aria-controls="main-navigation" aria-label="Menu" data-i18n-aria="menu" type="button"><Text k="menu" class="menu-label"/><span class="menu-symbol" aria-hidden="true">+</span></button>
          <details class="language-switcher"><summary class="language-toggle" aria-label="Choose language" data-i18n-aria="chooseLanguage"><svg class="language-globe" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg><span id="current-language">EN</span><svg class="language-chevron" viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m3 4.5 3 3 3-3"/></svg></summary><nav class="language-options" aria-label="Choose language" data-i18n-aria="chooseLanguage">{[['en','English'],['zh','中文'],['ja','日本語']].map(([l,name]) => <a href={'?lang='+l} lang={l} data-language={l}>{name}<span class="language-check" aria-hidden="true"/></a>)}</nav></details>
        </div>
      </div></header>
      {overview || post ? <section class="blog-hero"><div class="brand-shell hero-inner"><h1>JoeyDDong‘s Blog<span>.</span></h1><Text k="hero" tag="p" class="hero-description"/></div></section> : null}
      <nav class="blog-navigation" aria-label="Blog navigation" data-i18n-aria="blogNav"><div class="brand-shell blog-nav-inner">{[['latest','/'],['categories','/categories/'],['tags','/tags/'],['archives','/archives/'],['search','/search/']].map(([k,p]) => <a href={url(p)} aria-current={(k === 'latest' && home || k === 'categories' && (page.category || page.__categories) || k === 'tags' && (page.tag || page.__tags) || k === 'archives' && page.archive || k === 'search' && search) ? 'page' : undefined}><Text k={k}/>{k === 'search' ? <span aria-hidden="true"> ↗</span> : null}</a>)}</div></nav>
      <section class="section blog-section"><div class="brand-shell"><div class={post ? 'columns blog-columns reading-columns' : 'columns blog-columns'}>
        <main class="column column-main" id="main" dangerouslySetInnerHTML={{__html:body}}/>
        {!post ? <Profile site={site} helper={helper}/> : null}
        {post ? <aside class="column column-toc"><Toc page={page} helper={helper}/></aside> : <Sidebars site={site} helper={helper}/>}
      </div></div></section>
      <footer class="brand-footer"><div class="brand-shell footer-inner"><div><p class="footer-name">JoeyDDong<span>.</span></p><Text k="footer" tag="p"/></div><div class="footer-links"><a href="https://github.com/weiweiweidong">GitHub ↗</a><a href="#top"><Text k="top"/> ↑</a></div><small>© {new Date().getFullYear()} JoeyDDong · Hexo / <a href="https://github.com/ppoffice/hexo-theme-icarus">Icarus</a></small></div></footer>
      <dialog id="image-dialog" aria-label="Image viewer" data-i18n-aria="imageViewer"><div class="viewer-toolbar"><button type="button" data-image-close data-i18n-aria="close" aria-label="Close image">×</button></div><div class="viewer-body"><button type="button" data-image-prev data-i18n-aria="previousImage" aria-label="Previous image">←</button><figure><img id="viewer-image" alt=""/><figcaption id="viewer-caption"/></figure><button type="button" data-image-next data-i18n-aria="nextImage" aria-label="Next image">→</button></div><p id="viewer-count"/></dialog>
    </body></html>;
  }
};
