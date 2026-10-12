(function() {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const locale = window.JoeyLocale;
  const text = key => window.JoeyMessages[locale.get()][key] || window.JoeyMessages.en[key] || key;
  const dropdown = $('.language-switcher'), menu = $('.menu-toggle'), header = $('.brand-header');
  const setMenu = open => { menu.setAttribute('aria-expanded',String(open)); header.classList.toggle('menu-open',open); if(open) dropdown.open=false; };
  function translate() {
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = text(el.dataset.i18n); el.lang = document.documentElement.lang; });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label',text(el.dataset.i18nAria)));
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.setAttribute('placeholder',text(el.dataset.i18nPlaceholder)));
    $('#current-language').textContent = { en:'EN',zh:'中文',ja:'日本語' }[locale.get()];
    document.querySelectorAll('[data-language]').forEach(a => {
      const u = new URL(location.href); u.searchParams.set('lang',a.dataset.language); a.href=u.href;
      a.setAttribute('aria-current',String(a.dataset.language === locale.get()));
      a.querySelector('.language-check').textContent = a.dataset.language === locale.get() ? '✓' : '';
    });
    document.querySelectorAll('[data-destination]').forEach(a => {
      const dest = a.dataset.destination, l = locale.get(), prefix = l === 'en' ? '' : `/${l}`;
      if(dest === 'blog') a.href=`/?lang=${l}`;
      else a.href=`https://joeyddong-site.top${prefix}/${dest === 'home' ? '' : dest + '/'}`;
    });
    // Preserve locale even when persistent browser storage is disabled.
    document.querySelectorAll('a[href]').forEach(a => {
      if(a.hasAttribute('data-language') || a.getAttribute('href').startsWith('#')) return;
      const u = new URL(a.href,location.href);
      if(u.origin === location.origin && !u.pathname.startsWith('/assets/')) { u.searchParams.set('lang',locale.get()); a.href=u.href; }
    });
    window.dispatchEvent(new CustomEvent('joey:locale'));
  }
  document.querySelectorAll('[data-language]').forEach(a => a.addEventListener('click',e => {
    e.preventDefault(); const l=a.dataset.language; locale.remember(l);
    document.documentElement.dataset.locale=l; document.documentElement.lang=l==='zh'?'zh-CN':l;
    const u=new URL(location.href); u.searchParams.set('lang',l); history.replaceState(null,'',u); dropdown.open=false; translate(); dropdown.querySelector('summary').focus();
  }));
  menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
  dropdown.addEventListener('toggle',()=>{if(dropdown.open)setMenu(false)});
  document.addEventListener('click',e=>{if(!dropdown.contains(e.target))dropdown.open=false});
  dropdown.addEventListener('focusout',e=>{if(!dropdown.contains(e.relatedTarget))dropdown.open=false});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(dropdown.open){dropdown.open=false;dropdown.querySelector('summary').focus()}if(menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus()}}});
  $('.main-navigation').addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
  document.querySelectorAll('[data-list-filter]').forEach(select=>select.addEventListener('change',()=>{const u=new URL(select.value,location.origin);u.searchParams.set('lang',locale.get());location.assign(u)}));
  const headerSmall = matchMedia('(max-width:700px)');
  headerSmall.addEventListener('change',()=>{if(!headerSmall.matches)setMenu(false)});
  const small = matchMedia('(max-width:760px)');
  const adapt = () => { document.querySelectorAll('.sidebar-module,.toc-card').forEach(d=>d.open=!small.matches); if(!headerSmall.matches)setMenu(false); };
  small.addEventListener('change',adapt); adapt();
  document.querySelectorAll('.article-content table').forEach(table=>{if(table.closest('figure.highlight'))return;const wrap=document.createElement('div');wrap.className='table-scroll';wrap.tabIndex=0;table.before(wrap);wrap.append(table)});
  document.querySelectorAll('.article-content figure.highlight,.article-content>pre').forEach(block=>{
    const button=document.createElement('button');button.type='button';button.className='copy-button';button.dataset.i18n='copy';button.textContent=text('copy');block.append(button);
    button.addEventListener('click',async()=>{const code=block.querySelector('td.code pre,code,pre')?.textContent || '';try{await navigator.clipboard.writeText(code);button.dataset.i18n='copied'}catch{button.dataset.i18n='copyFailed';const range=document.createRange();range.selectNodeContents(block.querySelector('pre')||block);getSelection().removeAllRanges();getSelection().addRange(range)}button.textContent=text(button.dataset.i18n);setTimeout(()=>{button.dataset.i18n='copy';button.textContent=text('copy')},2000)});
  });
  const dialog=$('#image-dialog'),images=Array.from(document.querySelectorAll('.article-content img')).filter(img=>!img.closest('a'));
  let imageIndex=0, returnFocus=null;
  function displayImage(){const img=images[imageIndex];$('#viewer-image').src=img.currentSrc||img.src;$('#viewer-image').alt=img.alt;$('#viewer-caption').textContent=img.title||img.alt;$('#viewer-count').textContent=`${imageIndex+1} / ${images.length}`;$('[data-image-prev]').hidden=images.length<2;$('[data-image-next]').hidden=images.length<2}
  images.forEach((img,i)=>{
    const figure=document.createElement('figure');figure.className='image-figure';const button=document.createElement('button');button.type='button';button.className='image-trigger';button.dataset.i18nAria='openImage';button.setAttribute('aria-label',text('openImage'));
    img.before(figure);figure.append(button);button.append(img);if(img.title){const caption=document.createElement('figcaption');caption.textContent=img.title;figure.append(caption)}
    button.addEventListener('click',()=>{returnFocus=button;imageIndex=i;displayImage();dialog.showModal()});
  });
  const moveImage=delta=>{if(!images.length)return;imageIndex=(imageIndex+delta+images.length)%images.length;displayImage()};
  $('[data-image-close]').addEventListener('click',()=>dialog.close());$('[data-image-prev]').addEventListener('click',()=>moveImage(-1));$('[data-image-next]').addEventListener('click',()=>moveImage(1));
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();moveImage(-1)}if(e.key==='ArrowRight'){e.preventDefault();moveImage(1)}});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
  dialog.addEventListener('close',()=>returnFocus?.focus());
  const heads=Array.from(document.querySelectorAll('.article-content h1[id],.article-content h2[id],.article-content h3[id],.article-content h4[id]'));
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{const active=entries.find(e=>e.isIntersecting);if(active)document.querySelectorAll('.toc-links a').forEach(a=>{const yes=decodeURIComponent(a.hash.slice(1))===active.target.id;a.classList.toggle('active',yes);if(yes)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})},{rootMargin:'-110px 0px -65% 0px'});heads.forEach(h=>observer.observe(h))}
  window.JoeyUI={text,translate};translate();
})();
