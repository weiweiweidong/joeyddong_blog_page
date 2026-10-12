(function(){
  'use strict';
  const input=document.querySelector('#search-input'),filter=document.querySelector('#search-language'),status=document.querySelector('#search-status'),results=document.querySelector('#search-results'),retry=document.querySelector('#search-retry');
  let index=null,loading=null,failed=false,timer;
  const text=k=>window.JoeyUI.text(k),params=()=>new URL(location.href).searchParams;
  function restore(){input.value=params().get('q')||'';filter.value=['en','zh','ja'].includes(params().get('article_lang'))?params().get('article_lang'):'all'}
  function syncURL(){const u=new URL(location.href);input.value.trim()?u.searchParams.set('q',input.value.trim()):u.searchParams.delete('q');filter.value==='all'?u.searchParams.delete('article_lang'):u.searchParams.set('article_lang',filter.value);history.replaceState(null,'',u)}
  async function load(){if(index)return index;if(loading)return loading;failed=false;retry.hidden=true;loading=fetch('/search-index.json').then(r=>{if(!r.ok)throw Error('index');return r.json()}).then(data=>{index=data;return data}).catch(()=>{failed=true;return null}).finally(()=>{loading=null});return loading}
  function snippet(post,q){const target=post.text.toLocaleLowerCase().indexOf(q.toLocaleLowerCase());return target>=0?(target>50?'…':'')+post.text.slice(Math.max(0,target-50),target+150)+(target+150<post.text.length?'…':''):post.summary}
  function highlighted(el,content,terms){const escaped=terms.map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));if(!escaped.length){el.textContent=content;return}const re=new RegExp('('+escaped.join('|')+')','giu');let end=0;for(const m of content.matchAll(re)){el.append(document.createTextNode(content.slice(end,m.index)));const mark=document.createElement('mark');mark.textContent=m[0];el.append(mark);end=m.index+m[0].length}el.append(document.createTextNode(content.slice(end)))}
  async function render(){
    const q=input.value.trim();results.replaceChildren();retry.hidden=true;
    if(!q){status.textContent=text('searchStart');return}
    if(!index){status.textContent=text('searching');await load();if(input.value.trim()!==q){render();return}}
    if(failed){status.textContent=text('searchError');retry.hidden=false;return}
    const terms=q.toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const found=index.filter(p=>(filter.value==='all'||p.language===filter.value)&&terms.every(t=>[p.title,p.summary,...p.tags,...p.categories,p.text].join(' ').toLocaleLowerCase().includes(t))).sort((a,b)=>score(b)-score(a));
    function score(p){return terms.reduce((n,t)=>n+(p.title.toLocaleLowerCase().includes(t)?5:0)+(p.tags.join(' ').toLocaleLowerCase().includes(t)?2:0),0)}
    status.textContent=found.length?`${found.length} ${text('results')}`:text('empty');
    for(const p of found){const article=document.createElement('article');article.className='search-result';article.lang=p.language;const h=document.createElement('h2'),a=document.createElement('a');const u=new URL(p.url,location.origin);u.searchParams.set('lang',window.JoeyLocale.get());a.href=u.href;highlighted(a,p.title,terms);h.append(a);const summary=document.createElement('p');highlighted(summary,snippet(p,terms[0]),terms);const meta=document.createElement('small');meta.textContent=`${p.date} · ${p.minutes} ${text('minutes')} · ${p.language==='zh'?'中文':p.language==='ja'?'日本語':'English'}${p.test?' · '+text('test'):''}`;article.append(h,summary,meta);results.append(article)}
  }
  document.querySelector('#search-form').addEventListener('submit',e=>{e.preventDefault();clearTimeout(timer);syncURL();render()});
  input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{syncURL();render()},180)});filter.addEventListener('change',()=>{syncURL();render()});retry.addEventListener('click',async()=>{index=null;await load();render()});window.addEventListener('popstate',()=>{restore();render()});window.addEventListener('joey:locale',render);restore();render();
})();
