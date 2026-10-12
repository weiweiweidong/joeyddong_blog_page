const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createRequire } = require('node:module');
const path = require('node:path');
const content = require('../themes/joeyddong/lib/content.cjs');
test('自动摘要剔除代码、公式和图片，保留链接文字；手动摘要优先', () => {
  const raw = '## Heading\n\nReadable [link](https://example.com).\n\n```python\nsecret_code = 1\n```\n\nMath $x^2$\n\n$$y=2$$\n\n![image marker](/test.svg)';
  const summary = content.excerpt({ _content: raw });
  assert.match(summary,/Readable link/); assert.doesNotMatch(summary,/secret_code|x\^2|y=2|image marker|```|\[link\]/);
  assert.equal(content.excerpt({summary:'手动摘要',_content:raw}),'手动摘要');
});
test('全文索引保留代码标识符的下划线，自动摘要仍排除代码', () => {
  const post = { _content: '正文关键词 pagination_probe。\n\n```python\nunder_score = True\n```' };
  assert.match(content.plainMarkdown(post._content), /pagination_probe/);
  assert.match(content.plainMarkdown(post._content), /under_score/);
  assert.doesNotMatch(content.excerpt(post), /under_score/);
  assert.match(content.searchText({content:'<pre><code>under_score = (page - 1) * per_page</code></pre>'}), /under_score = \(page - 1\) \* per_page/);
});
test('更新日期必须明确提供，Git 文件时间不影响展示；日期按东京时区显示', () => {
  assert.equal(content.updatedDay({date:'2026-10-12',updated:'2099-01-01'}),'');
  assert.equal(content.day('2026-10-11T15:00:00.000Z'),'2026-10-12');
  assert.equal(content.updatedDay({date:'2026-10-12',last_updated:'2026-10-13'}),'2026-10-13');
  assert.equal(content.updatedDay({date:'2026-10-12',last_updated:'2026-10-01'}),'');
  assert.equal(content.day('2026-02-30'),'');
});
test('完整集合先按原文语言筛选，再分页，保留跨页文章与分类上下文', () => {
  const generators={};
  const mockHexo={config:{per_page:10,archive_generator:{per_page:100}},extend:{generator:{register:(name,fn)=>{generators[name]=fn}},filter:{register:()=>{}}}};
  const source=path.resolve(__dirname,'../scripts/blog.cjs');
  new Function('hexo','require',fs.readFileSync(source,'utf8'))(mockHexo,createRequire(source));
  const collection=items=>({toArray:()=>items,sort:()=>collection(items)});
  const posts=Array.from({length:45},(_,i)=>({title:`article ${i}`,article_lang:['en','zh','ja'][i%3],date:'2026-10-12'}));
  const routes=generators.joey_language_lists({posts:collection(posts),categories:collection([{name:'编程',path:'categories/编程/',posts:collection(posts)}]),tags:collection([])});
  const languageRoutes=routes.filter(r=>/^language\/en\//.test(r.path));
  assert.equal(languageRoutes.length,2);
  assert.equal(languageRoutes[0].data.posts.length,10);assert.equal(languageRoutes[1].data.posts.length,5);
  assert.ok(languageRoutes.flatMap(r=>r.data.posts).every(p=>p.article_lang==='en'));
  assert.equal(new Set(languageRoutes.flatMap(r=>r.data.posts.map(p=>p.title))).size,15);
  assert.equal(routes.find(r=>r.path==='categories/编程/language/zh/page/2/index.html').data.category,'编程');
  const manyPosts=Array.from({length:303},(_,i)=>({title:`article ${i}`,article_lang:['en','zh','ja'][i%3],date:'2026-10-12'}));
  const manyRoutes=generators.joey_language_lists({posts:collection(manyPosts),categories:collection([]),tags:collection([])});
  const archives=manyRoutes.filter(r=>/^archives\/language\/en\//.test(r.path));
  assert.deepEqual(archives.map(r=>r.data.posts.length),[100,1]);
  assert.ok(archives.every(r=>r.layout==='archive' && r.data.per_page===100));
  assert.equal(new Set(archives.flatMap(r=>r.data.posts.map(p=>p.title))).size,101);
  assert.equal(manyRoutes.filter(r=>/^language\/en\//.test(r.path)).length,11);

});
test('空语言集合仍生成可访问的空状态页', () => {
  const pages=content.paginate([], 'language/ja/');
  assert.equal(pages.length,1);assert.equal(pages[0].data.total,1);assert.deepEqual(pages[0].data.posts,[]);
});
test('三语界面文案键完整，原文语言识别独立于界面', () => {
  const messages=require('../themes/joeyddong/source/js/messages.js');
  for(const l of ['zh','ja']) assert.deepEqual(Object.keys(messages[l]).sort(),Object.keys(messages.en).sort());
  assert.equal(content.articleLanguage({article_lang:'ja'}),'ja');
  assert.equal(content.readingTime({_content:''}),1);
});
test('文章语言由显式头部字段决定，未声明时不由文件名或迁移清单覆盖默认语言', () => {
  assert.equal(content.articleLanguage({source:'_posts/AtCoder_386_Summary.md'}),'en');
  assert.equal(content.articleLanguage({source:'_posts/AtCoder_386_Summary.md',article_lang:'zh',lang:'en'}),'zh');
  assert.equal(content.articleLanguage({slug:'AtCoder_386_Summary',article_lang:'zh',language:'en'}),'zh');
  assert.equal(content.articleLanguage({source:'_posts/AtCoder_386_Summary.md',article_lang:'en'}),'en');
  assert.equal(content.articleLanguage({source:'_posts/new-article.md'}),'en');
  assert.equal(content.coverImage({home_cover:'https://example.com/old.jpg'}),'https://example.com/old.jpg');
  assert.equal(content.coverImage({cover:'/new.jpg',home_cover:'/old.jpg'}),'/new.jpg');
});
test('旧 MathJax 行内公式允许首尾空格，邻近公式不会被合并；代码中的美元符号保持原样', () => {
  const MarkdownIt = createRequire(require.resolve('hexo-renderer-markdown-it'))('markdown-it');
  const markdown = new MarkdownIt().use(require('../themes/joeyddong/lib/markdown-math.cjs'));
  const html = markdown.render('在 $i = j $ 的时候，若 $A_i + A_j = 2A_i$ 能够被 $2^k$ 整除。');
  assert.equal((html.match(/class="katex"/g) || []).length,3);
  assert.doesNotMatch(html,/katex-error/);
  assert.match(html,/的时候，若/);
  assert.match(markdown.render('`$i = j $`'),/<code>\$i = j \$<\/code>/);
});

test('时间线按东京日期倒序分年，保留所有文章且不修改原集合', () => {
  const posts=[
    {title:'older',date:'2024-01-01'},
    {title:'new year in Tokyo',date:'2024-12-31T15:00:00Z'},
    {title:'previous year',date:'2023-12-31'},
    {title:'later in 2024',date:'2024-12-25'},
  ];
  const groups=content.archiveGroups(posts);
  assert.deepEqual(groups.map(g=>g.year),['2025','2024','2023']);
  assert.deepEqual(groups.flatMap(g=>g.posts.map(p=>p.title)),['new year in Tokyo','later in 2024','older','previous year']);
  assert.equal(posts[0].title,'older');
  assert.deepEqual(content.archiveGroups([]),[]);
});
