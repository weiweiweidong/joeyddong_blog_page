'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const crypto=require('node:crypto');
const legacyImport=require('../content/legacy-posts.json');
const {createRequire}=require('node:module');
const yaml=createRequire(require.resolve('hexo/package.json'))('js-yaml');
const root=path.resolve(__dirname,'../public');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
for(const file of ['index.html','page/2/index.html','categories/index.html','tags/index.html','archives/index.html','search/index.html','language/zh/index.html','404.html','search-index.json','assets/images/avatar.png']) assert.ok(fs.existsSync(path.join(root,file)),`Missing ${file}`);
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
const postFiles=walk(path.resolve(__dirname,'../source/_posts')).filter(f=>/\.(md|markdown)$/i.test(f));
assert.equal(index.length,postFiles.length);assert.equal(new Set(index.map(p=>p.url)).size,index.length);
// Draft fixtures must stay out of normal builds, including stale article output.
const drafts=path.resolve(__dirname,'../source/_drafts');
for(const file of fs.existsSync(drafts) ? walk(drafts).filter(f=>/\.(md|markdown)$/i.test(f)) : []){
 const front=/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(fs.readFileSync(file,'utf8'));
 const fields=front ? yaml.load(front[1],{schema:yaml.JSON_SCHEMA}) : {};
 if(!fields.test)continue;
 const slug=fields.slug || path.basename(file,path.extname(file));
 assert.ok(!index.some(p=>decodeURIComponent(p.url)===`/posts/${slug}/`),`测试草稿进入搜索索引：${slug}`);
 assert.ok(!fs.existsSync(path.join(root,'posts',slug,'index.html')),`测试草稿仍有生成页面：${slug}，请先清理构建输出`);
}
assert.equal(index.filter(p=>p.text.includes('pagination_probe')).length,0);
const legacyIndex=index.filter(p=>!p.test);
for(const imported of legacyImport.posts){
 const source=path.resolve(__dirname,'../source/_posts',imported.file);
 const raw=fs.readFileSync(source);
 const front=/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw.toString('utf8'));
 assert.ok(front,`缺少头部：${imported.file}`);
 const fields=yaml.load(front[1],{schema:yaml.JSON_SCHEMA});
 assert.ok(fields.slug);assert.equal(fields.article_lang,'zh');assert.ok(fields.summary);
 assert.ok(fields.categories.includes('编程'));
 for(const old of ['home_cover','mathjax','code_block_shrink']) assert.ok(!(old in fields),`残留旧字段 ${old}：${imported.file}`);
 assert.ok(!fields.tags.includes('Prgoramming Contest'));
 if(process.argv.includes('--check-import')) assert.equal(crypto.createHash('sha256').update(raw.subarray(Buffer.byteLength(front[0]))).digest('hex'),imported.body_sha256,`正文校验失败：${imported.file}`);
 const slug=fields.slug;
 const post=legacyIndex.find(p=>decodeURIComponent(p.url)===`/posts/${slug}/`);
 assert.ok(post,`旧文章未进入搜索索引：${imported.file}`);
 assert.equal(post.language,imported.article_lang);
 const html=fs.readFileSync(path.join(root,decodeURIComponent(post.url),'index.html'),'utf8');
 assert.ok(!html.includes('class="katex-error'),`公式渲染失败：${imported.file}`);
 assert.match(html,/<article[^>]*lang="zh"/);
 assert.match(html,/toc-link[^>]* href=/);
 assert.doesNotMatch(html,/&lt;img\b/);
}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');const second=fs.readFileSync(path.join(root,'page/2/index.html'),'utf8');
assert.equal((home.match(/article-preview/g)||[]).length,Math.min(10,index.length));assert.equal((second.match(/article-preview/g)||[]).length,Math.min(10,index.length-10));
const zh=fs.readFileSync(path.join(root,'language/zh/index.html'),'utf8');assert.equal((zh.match(/article-preview/g)||[]).length,Math.min(10,index.filter(p=>p.language==='zh').length));
const post=fs.readFileSync(path.join(root,'posts/AtCoder_384_Summary/index.html'),'utf8');assert.match(post,/class="katex/);assert.match(post,/toc-links/);
for(const file of ['app.js','search.js','locale.js','messages.js'])new vm.Script(fs.readFileSync(path.join(root,'js',file),'utf8'));
console.log(`验证通过：${htmlFiles.length} 个 HTML 页面、${index.length} 篇文章、${legacyImport.posts.length} 篇旧文${process.argv.includes('--check-import') ? '正文校验' : '渲染检查'}，本地链接、锚点、分页、搜索索引、公式与前端脚本。`);
