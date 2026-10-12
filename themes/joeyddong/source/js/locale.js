/* Runs before paint. The shell language is independent of each article's lang. */
(function() {
  const valid = l => ['en','zh','ja'].includes(l);
  const key = 'joey_locale';
  const params = new URLSearchParams(location.search);
  let locale = params.get('lang');
  if (!valid(locale)) {
    let cookie;
    try { cookie = document.cookie.split('; ').find(c => c.startsWith(key+'='))?.split('=')[1]; } catch {}
    if (valid(cookie)) locale = cookie;
    else { try { locale = localStorage.getItem(key); } catch {} }
  }
  if (!valid(locale)) locale = (navigator.languages || [navigator.language]).map(l => l.toLowerCase().split('-')[0]).find(valid) || 'en';
  function remember(l) {
    try { localStorage.setItem(key,l); } catch {}
    const domain = location.hostname === 'joeyddong.top' || location.hostname.endsWith('.joeyddong.top') ? '; Domain=joeyddong.top' : '';
    try { document.cookie = `${key}=${l}; Path=/; Max-Age=31536000; SameSite=Lax${domain}${location.protocol === 'https:' ? '; Secure' : ''}`; } catch {}
  }
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
  document.documentElement.dataset.locale = locale;
  document.documentElement.classList.add('js-enabled');
  if (valid(params.get('lang'))) remember(locale);
  window.JoeyLocale = { valid, remember, get: () => document.documentElement.dataset.locale };
})();
