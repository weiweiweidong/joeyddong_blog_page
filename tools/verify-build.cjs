'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'../public');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
for(const file of ['index.html','page/2/index.html','categories/index.html','tags/index.html','archives/index.html','search/index.html','posts/layout-zh/index.html','posts/layout-en/index.html','posts/layout-ja/index.html','language/zh/index.html','404.html','search-index.json','assets/images/avatar.png']) assert.ok(fs.existsSync(path.join(root,file)),`Missing ${file}`);
const htmlFiles=walk(root).filter(f=>f.endsWith('.html'));
for(const file of htmlFiles){
 const html=fs.readFileSync(file,'utf8');assert.match(html,/<!doctype html>/i);assert.match(html,/<main\b/);assert.doesNotMatch(html,/\.jsdelivr\.net|fonts\.googleapis\.com|cookieconsent/i);
 const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'');
 const ids=new Set(Array.from(markup.matchAll(/\bid="([^"]+)"/g),m=>m[1]));
 for(const [,value] of markup.matchAll(/\b(?:href|src)="([^"]+)"/g)){
  if(!value||/^(https?:|mailto:|tel:|data:|javascript:)/.test(value))continue;
  const url=new URL(value,'https://local.test/'+path.relative(root,file));
  const pathname=decodeURIComponent(url.pathname);
  const target=path.join(root,pathname.endsWith('/')?pathname+'index.html':pathname);
  assert.ok(fs.existsSync(target),`Broken local link in ${path.relative(root,file)}: ${value}`);
  if(url.hash && target===file)assert.ok(ids.has(decodeURIComponent(url.hash.slice(1))),`Broken anchor: ${value}`);
 }
}
const index=JSON.parse(fs.readFileSync(path.join(root,'search-index.json')));
assert.equal(index.length,12);assert.equal(new Set(index.map(p=>p.url)).size,12);
assert.equal(index.filter(p=>p.text.includes('pagination_probe')).length,1);
assert.equal(index.filter(p=>p.language==='zh').length,4);
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');const second=fs.readFileSync(path.join(root,'page/2/index.html'),'utf8');
assert.equal((home.match(/article-preview/g)||[]).length,10);assert.equal((second.match(/article-preview/g)||[]).length,2);
const zh=fs.readFileSync(path.join(root,'language/zh/index.html'),'utf8');assert.equal((zh.match(/article-preview/g)||[]).length,4);
const post=fs.readFileSync(path.join(root,'posts/layout-zh/index.html'),'utf8');assert.match(post,/class="katex/);assert.match(post,/id="重复标题-2"/);assert.match(post,/toc-links/);
for(const file of ['app.js','search.js','locale.js','messages.js'])new vm.Script(fs.readFileSync(path.join(root,'js',file),'utf8'));
console.log(`验证通过：${htmlFiles.length} 个 HTML 页面，本地链接、锚点、分页、搜索索引、公式与前端脚本。`);
