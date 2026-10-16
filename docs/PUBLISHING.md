# 文章写作、Git 提交与手动部署指南

适用项目：`joeyddong_blog_page`。整理日期：2026-10-17。

本指南按项目现有的 Hexo、npm、Git 和 Cloudflare Workers 配置编写。示例文章使用 `disjoint-set-notes` 作为文件名和 slug，实际操作时请替换为自己的文章名称。

## 1. 先了解完整流程

一次手动发布按以下顺序完成：

1. 进入新博客项目，检查分支并同步 GitHub。
2. 新建文章、发布草稿，或者复制已经写好的 Markdown 笔记。
3. 调整文章头部，补齐图片等资源。
4. 本地预览，检查正文、公式、目录和手机布局。
5. 清理输出，运行测试、构建与页面验证。
6. 使用中文 commit 提交源码，推送 GitHub。
7. 检查 Cloudflare 登录状态，执行部署。
8. 检查线上文章、搜索索引、归档与分类。

各步骤的作用如下：

| 操作 | 实际作用 | 会让线上博客更新吗？ |
| --- | --- | --- |
| 把文件放入 `source/_posts/` | 加入正式文章源码 | 不会，需要重新部署 |
| `hexo publish` | 将本地草稿转为正式文章 | 不会，需要重新部署 |
| `npm run dev` | 在本机预览 | 不会 |
| `npm run verify` | 生成并验证本机的 `public/` | 不会 |
| `git commit` | 在本机保存版本 | 不会 |
| `git push origin dev` | 将源码同步到 GitHub | 当前手动流程下不会 |
| `npm run deploy:check` | 运行构建与部署预检，不上传资源 | 不会 |
| `npm run deploy` | 构建并上传到现有 Cloudflare Worker | **会更新正式博客** |

当前使用 `dev` 分支维护完整源码。根据现有发布记录，尚未接入 GitHub 自动部署，本指南不要求切换或合并到 `main`。如果以后启用自动部署，需要先核对 Cloudflare 中的生产分支及构建设置，再调整这里的流程。

## 2. 环境准备与代码同步

### 2.1 进入正确的项目

```sh
cd /Users/dongwei/JoeyDong/My_GitHub_Source/joeyddong_blog_page
git status
git branch --show-current
git remote -v
```

应确认：

- 当前项目是 `joeyddong_blog_page`，新文章应写入这个项目。
- 日常发布分支为 `dev`。
- `origin` 指向 `git@github.com:weiweiweidong/joeyddong_blog_page.git`。

`My_Hexo_Blog_Source` 是旧博客源码目录。只修改旧目录中的笔记，不会自动同步到当前博客。

### 2.2 开始写作前同步代码

如果 `git status` 显示工作区干净，可以执行：

```sh
git switch dev
git pull --ff-only origin dev
```

如果有尚未保存的改动，先检查改动属于什么工作，再决定提交或另行保存。不要为同步代码直接丢弃文件。如果 `--ff-only` 失败，说明本地和远程需要进一步处理；解决分支差异后再继续。

### 2.3 检查 Node.js 和 npm

```sh
node --version
npm --version
```

本项目已验证的版本：

- Node.js：`24.21.0`，项目 `.node-version` 中有记录。
- npm：`11.19.0`，项目 `package.json` 的 `packageManager` 中有记录。
- `engines` 要求 Node.js 24、npm 11。

首次克隆项目、换电脑，或者锁文件发生变化后，运行：

```sh
npm ci
```

日常仅新增或修改文章，且依赖已经安装时，不必每次重新安装。项目统一使用 npm 和 `package-lock.json`。

GitHub 推送使用本机已配置的 SSH 身份；Cloudflare 使用自己的登录授权，两者分别检查。需要只读检查 GitHub 访问时，可以运行 `git ls-remote origin refs/heads/dev`。

## 3. 准备文章：选择一种方式

### 方式 A：直接新建正式文章

```sh
npm exec -- hexo new post "disjoint-set-notes"
```

将生成：

```text
source/_posts/disjoint-set-notes.md
```

新文章使用 `scaffolds/post.md` 模板。打开文件，将 `title` 改成展示给读者的标题，保留一个唯一、稳定的 `slug`，然后填写正文。

### 方式 B：先写草稿，完成后发布

新建草稿：

```sh
npm exec -- hexo new draft "disjoint-set-notes"
```

草稿保存在 `source/_drafts/disjoint-set-notes.md`，普通构建不展示。

需要预览草稿时，先在原终端按 `Ctrl+C` 停止普通预览服务，再运行：

```sh
npm run dev -- --draft
```

完成后，停止草稿预览服务，将草稿转为正式文章：

```sh
npm exec -- hexo publish "disjoint-set-notes"
```

确认文章已经移入 `source/_posts/`，并检查头部中的 `date`、`slug`、`article_lang`、分类与标签。`hexo publish` 只完成本地草稿转换，后面仍要执行 Git 提交、推送和部署。

恢复普通预览前清理一次：

```sh
npm run clean
npm run dev
```

项目中已有的 12 篇测试草稿应继续留在 `source/_drafts/`。`test: true` 只是标记，实际隐藏依赖草稿目录和 `render_drafts: false`；不要将测试草稿误移入正式文章目录。

### 方式 C：导入已经写好的 Markdown

将完成的 `.md` 文件复制到当前项目的 `source/_posts/`。复制前先检查是否已有同名文件或相同 slug，避免覆盖已发布文章。例如：

```sh
ls source/_posts/
```

然后使用编辑器或 Finder 复制文件，并按下一节适配文章头部。

从旧博客导入时，注意以下字段：

- 添加或确认 `slug`、`article_lang`、`summary`、`categories`。
- 将旧 `home_cover` 改为 `cover`，保留有效的图片地址。
- 移除旧主题专用的 `mathjax`、`code_block_shrink` 和不再使用的 `abbrlink`。
- 本项目使用 KaTeX，直接写数学公式，不需要 `mathjax: true`。
- 保留原始发表日期；导入日期不是文章的新发表日期。
- 本机图片需要复制进新项目，并将引用改成站内资源路径。

普通新增文章**不需要**加入 `content/legacy-posts.json`。这个文件只记录历史迁移来源和校验信息，不控制文章是否发布。

## 4. 文章头部、正文与图片

### 4.1 推荐文章格式

下面是可以参考的完整结构。示例中的日期应改为实际发表时间；新文章不必填写 `last_updated`。

````markdown
---
title: '并查集基础笔记'
slug: 'disjoint-set-notes'
date: '2026-10-17 10:00:00'
article_lang: 'zh'
summary: '记录并查集的基本操作、路径压缩和常见应用。'
categories:
  - '编程'
tags:
  - 'Algorithm'
  - 'C++'
# cover: /assets/images/disjoint-set-cover.jpg
# cover_alt: 并查集结构示意图
---

这里写文章的引言。

<!-- more -->

## 基本概念

这里写正文。

```cpp
int find(int x) {
    return parent[x] == x ? x : parent[x] = find(parent[x]);
}
```

单次操作的均摊复杂度可以写作 $O(\alpha(n))$。

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
````

字段说明：

| 字段 | 填写方式与用途 |
| --- | --- |
| `title` | 展示标题，可以使用中文、英文或日文。包含冒号等符号时，使用引号包裹更方便。 |
| `slug` | 唯一、稳定的地址标识。建议使用简短英文，如 `disjoint-set-notes`；不要与其他文章重复。 |
| `date` | 原发表时间，使用带引号的 `YYYY-MM-DD HH:mm:ss`，站点时区为 `Asia/Tokyo`。 |
| `article_lang` | 正文语言，填写 `zh`、`en` 或 `ja`。当前新文模板默认 `zh`；完全省略该字段时，主题默认按英文处理。 |
| `summary` | 文章卡片摘要。为空时自动从正文提取，忽略代码、公式和图片。 |
| `categories` | 建议从“编程、学习、生活、思考”中选择。列表内多个条目在 Hexo 中可构成分类层级。 |
| `tags` | 技术或主题标签，以 YAML 列表填写，例如 `Algorithm`、`C++`、`AtCoder`。 |
| `cover` | 可选封面，使用站内路径或已有的 HTTPS 图片地址。没有封面时保持注释或省略。 |
| `cover_alt` | 可选封面说明文字。 |
| `last_updated` | 旧文章正文实际更新时填写，如 `'2026-10-18'`，不得早于发表日期。 |

示例文章的正式地址为：

```text
https://blog.joeyddong.top/posts/disjoint-set-notes/
```

文章列表按 `date` 倒序排列。导入旧日期文章时，它可能出现在后面的分页中，可通过归档或搜索查找。

`future: false` 表示未来日期文章默认不生成。仅将 `date` 改成未来时间不会触发定时部署；到达日期后仍需要重新构建和发布。当前验证脚本也要求正式文章目录与生成的索引数量一致，因此准备稍后发布的文章应先放在草稿目录。

### 4.2 图片放在哪里

图片保存到：

```text
source/assets/images/
```

正文中的引用写成：

```markdown
![并查集结构示意图](/assets/images/disjoint-set-diagram.png "结构示意图")
```

封面同样使用 `/assets/images/文件名`。文章中的 URL 不包含 `source/` 前缀，也不应写 `/Users/...` 这样的本机绝对路径。

复制 Markdown 不会自动带走图片。引用的每张本地图片都应存在，并随文章一起提交。外部图床图片可以继续使用，但需要在预览及线上检查中确认能够加载。

### 4.3 更新已发布文章

直接编辑已有的 `source/_posts/文件名.md`：

1. 保留现有 `slug`，使文章地址稳定。
2. 保留原 `date`，让它继续表示首次发表时间。
3. 实际更新正文时填写或更新 `last_updated`。
4. 按后续步骤重新检查、提交、推送和部署。

不需要再次运行 `hexo new` 或 `hexo publish`。修改历史导入文章后，原始迁移正文哈希与新正文不一致是正常的；日常发布使用 `npm run verify`，不必为了更新文章改写迁移时的原始哈希。

## 5. 本地预览与检查

### 5.1 启动预览

```sh
npm run dev
```

打开：

- 首页：<http://127.0.0.1:4000/?lang=zh>
- 示例文章：<http://127.0.0.1:4000/posts/disjoint-set-notes/?lang=zh>
- 搜索：<http://127.0.0.1:4000/search/?lang=zh>

`?lang=zh` 切换界面文案，正文语言仍由 `article_lang` 决定。

检查标题、摘要、日期、代码高亮、公式、目录锚点、图片、分类和标签。缩窄浏览器窗口，确认手机宽度下正文可读。搜索文章标题中的关键词，确认能检索到文章。

服务占用当前终端，按 `Ctrl+C` 停止。若 4000 端口已被占用，可另用一个端口：

```sh
npm run dev -- --port 4001
```

此时将预览 URL 中的端口改为 `4001`。修改 `_config.yml` 或主题配置后，停止并重新启动服务。

### 5.2 运行发布前检查

停止预览服务，在项目根目录执行：

```sh
npm run clean && npm run check && npm run verify
```

使用 `&&`，确保前一步失败时停止执行。各命令的作用：

- `clean`：清理生成目录 `public/` 和 Hexo 缓存，避免已删除文章或草稿的旧页面残留。
- `check`：运行内容处理、日期、语言筛选、分页等回归测试。
- `verify`：运行构建并验证本地页面链接、目录锚点、分页、搜索索引、历史导入文章渲染和前端脚本。

正常结束时会显示“验证通过”及实际页面、文章数量。数量会随新增文章变化，不必保持当前的 20 篇。

验证脚本对历史导入文章有专门的公式检查；新文章仍需自己检查公式。也可以在构建后搜索生成页面中的 KaTeX 错误标记：

```sh
rg -n -o 'class="katex-error[^"<]*' public/posts/
```

无匹配时没有输出，`rg` 返回码为 1，这表示没有找到该错误标记。该检查只是辅助，不能代替阅读页面。

`node tools/verify-build.cjs --check-import` 是历史迁移正文校验，只有在专门核对迁移原文时才需要，**不属于日常发布必跑步骤**。

## 6. 中文提交并推送到 GitHub

### 6.1 检查并暂存此次发布的文件

```sh
git status --short
git diff --stat
git diff
git diff --check
```

`git diff` 默认只展示已跟踪文件的未暂存改动；新建文章还需要自己打开阅读，或在暂存后通过 `git diff --cached` 查看。

以示例文章为例：

```sh
git add -- source/_posts/disjoint-set-notes.md
```

如果确实新增了图片，再暂存对应文件：

```sh
git add -- source/assets/images/disjoint-set-diagram.png
```

如果草稿之前已经提交过，还需暂存它从草稿目录移除的变化。可以使用 `git add -u -- source/_drafts`，再通过下面的检查确认只包含预期改动。其他文档或资源也应按实际文件逐个加入。

```sh
git diff --cached --stat
git diff --cached
git diff --cached --check
```

暂存检查可能指出笔记中的行尾空格或结尾空行。新文章可以根据排版需要修整；若为保留迁移原文而有意保留，应理解差异后处理，避免对代码或 Markdown 换行进行盲目清理。

源码提交范围包括文章、图片和必要配置。`public/`、`node_modules/`、`db.json`、`.wrangler/` 及本机凭据已在忽略规则中，不需要强制加入 Git。

### 6.2 使用中文 commit

```sh
git commit -m "新增并查集基础笔记"
```

更新文章时可以使用：

```sh
git commit -m "更新并查集笔记的路径压缩说明"
```

提交说明应描述本次实际修改。

### 6.3 推送并确认

```sh
git push origin dev
git status
git log -1 --oneline
```

成功时会看到 `dev -> dev` 等推送结果。可在 [GitHub dev 分支](https://github.com/weiweiweidong/joeyddong_blog_page/tree/dev) 查看新文章和中文提交记录。

如果推送被拒绝，先处理远程新增提交或分支差异，再重试。普通文章发布不需要强制推送。

## 7. 手动部署到 Cloudflare

### 7.1 检查登录状态

```sh
npm run cf:whoami
```

确认显示的 Cloudflare 账号是现有博客所属账号。首次使用或登录已失效时，运行：

```sh
npm run cf:login
npm run cf:whoami
```

按终端提示在浏览器授权。若错误提示无法连接 Cloudflare 授权服务，先检查网络；这种情况不一定表示账号或凭据无效。

### 7.2 可选：只做部署预检

```sh
npm run deploy:check
```

该命令执行 Wrangler dry-run，会按照现有配置清理、测试、构建并验证站点，不发布静态资源。首次部署、依赖或部署配置发生变化时，可先执行；平时不必为了发布同一份内容重复预检。

### 7.3 正式部署

确认要发布的内容已经提交并成功推送后，运行：

```sh
npm run deploy
```

现有 `wrangler.jsonc` 会自动执行：

```sh
npm run clean && npm run check && npm run verify
```

通过后，将 `public/` 中的完整静态站点上传至 Worker `joeyddong-blog`。这一步会更新生产博客。上传对象来自**本机当前工作目录**，因此部署前要核对是否有未提交的文章或配置改动；GitHub 分支不是本次 CLI 部署的直接输入。

本项目不使用 `hexo deploy`、`hexo d` 或向 `gh-pages` 推送生成文件。也不必手动把 `public/` 上传到 GitHub。

### 7.4 判断部署是否成功

终端应以成功状态结束，并显示类似：

```text
Deployed joeyddong-blog triggers
  https://joeyddong-blog.dongweisp.workers.dev
  blog.joeyddong.top (custom domain)
Current Version ID: <本次 Cloudflare 版本 ID>
```

保存本次 Git commit 和 Cloudflare Version ID，后续排查时可对照。前面的测试通过或资源上传成功只是中间结果，应等到命令完整结束，再进行线上检查。

如果构建、验证或上传失败，先阅读最早出现的具体错误，修复后重新运行部署。若修复了源码，先重新检查、提交并推送修复，再部署对应内容。

## 8. 上线后验证

### 8.1 在浏览器中检查

- 正式博客：<https://blog.joeyddong.top/?lang=zh>
- 示例文章：<https://blog.joeyddong.top/posts/disjoint-set-notes/?lang=zh>
- 搜索页：<https://blog.joeyddong.top/search/?lang=zh>
- 归档：<https://blog.joeyddong.top/archives/?lang=zh>

检查文章正文、代码、公式和图片。在搜索页搜索文章标题，并在分类、标签或归档中找到它；保留旧日期的笔记可能位于后面的列表页。

### 8.2 使用终端检查文章和搜索索引

先将示例 slug 改成实际 slug：

```sh
article_slug='disjoint-set-notes'
curl --fail --silent --show-error --output /dev/null \
  --write-out '%{http_code}\n' \
  "https://blog.joeyddong.top/posts/${article_slug}/"
```

正常应输出 `200`。该示例使用 GET 请求，只丢弃正文。

下载公开搜索索引并检查文章地址：

```sh
curl --fail --silent --show-error \
  'https://blog.joeyddong.top/search-index.json' \
  --output /tmp/joey-blog-release-search-index.json
```

上一条命令成功后执行下面的检查，同样将示例 slug 改成实际值：

```sh
node - disjoint-set-notes <<'JS'
const fs = require('node:fs');
const slug = process.argv[2];
const posts = JSON.parse(fs.readFileSync('/tmp/joey-blog-release-search-index.json', 'utf8'));
const post = posts.find(item => decodeURIComponent(item.url) === `/posts/${slug}/`);
if (!post) {
  console.error(`线上索引未找到文章：${slug}`);
  process.exit(1);
}
console.log(`线上文章数：${posts.length}`);
console.log(`已找到：${post.title} ${post.url}`);
JS
```

HTTP 200 表示页面可访问；还应检查页面是否确实为这次发布的内容。仅能打开旧首页，不能证明新文章已经上线。

### 8.3 记录本次发布

需要保留操作记录时，可以在 `VALIDATION.md` 中记录：

- 日期、文章名称与源码 commit。
- 测试和构建结果。
- Cloudflare Version ID。
- 线上检查结果。

更新 `docs/CLOUDFLARE.md` 的最新部署版本时，填写实际返回值。部署后的记录文档可以另做一次中文提交并推送；这些项目文档位于 Hexo 内容目录之外，仅更新它们不需要再次部署文章。

## 9. 常见问题与处理方式

| 现象 | 优先检查 |
| --- | --- |
| GitHub 已有文章，网站没变化 | 当前流程需要另外运行 `npm run deploy`；确认终端显示最终部署成功。 |
| 文章本地能看到，正式站没有 | 检查是否部署了正确项目，以及文章是否仍在 `_drafts`、`date` 是否晚于当前东京时间。 |
| 首页找不到旧笔记 | 首页按原发表时间排序，查看后续分页、搜索和归档。 |
| 新文章显示为英文原文 | 确认头部有 `article_lang: zh`；界面的 `?lang=zh` 不会改变正文语言标记。 |
| 本地图片不显示 | 核对文件是否在 `source/assets/images/`，引用是否为 `/assets/images/...`，以及文件名大小写是否一致。 |
| 公式显示红色或原始代码 | 检查 `$`/`$$`、大括号及反斜杠。例如集合写 `\left\{A,B\right\}`，不要重复增加反斜杠。 |
| `last_updated` 导致构建失败 | 使用有效日期，并保证不早于原 `date`。新文章可以省略此字段。 |
| 正式文章数和搜索索引数量不一致 | 检查未来日期、重复 slug、误放入正式目录的草稿或测试文章。 |
| 本地链接验证失败 | 根据报错定位缺少的图片、文章路径或锚点；补齐资源或修正链接后重新构建。 |
| 历史正文哈希校验失败 | 若确实编辑过旧文章，使用日常 `npm run verify`；迁移原文校验不要求编辑后的正文仍保持原始哈希。 |
| 草稿预览后普通预览仍残留草稿页面 | 停止预览服务，执行 `npm run clean`，再启动不带 `--draft` 的普通预览。 |
| 端口 4000 已占用 | 检查已有预览服务，或使用 `npm run dev -- --port 4001`。 |
| `git push` 提示远程领先 | 同步并处理远程改动，再重新测试和推送。 |
| GitHub 报 SSH 权限问题 | 检查本机 GitHub SSH 配置、远程地址和仓库访问权限。 |
| Cloudflare 未登录或登录失效 | 检查网络，执行 `npm run cf:login`，再用 `npm run cf:whoami` 确认账号。 |
| 页面仍展示旧内容 | 先确认部署版本、文章地址和线上索引，再刷新或用无痕窗口检查；同时确认部署后没有其他人发布不同版本。 |

## 10. 发布后需要修正或撤回

小问题直接修改原文章、填写实际 `last_updated`，再按检查、提交、推送、部署的顺序更新。

如果要撤回一篇文章，可将它从 `source/_posts/` 移回 `source/_drafts/`，保留文件作为草稿，再检查、提交、推送并重新部署。当前历史迁移清单中的文章还被验证脚本要求存在于正式目录；撤回这类文章需要同时调整对应的验证要求和迁移状态，不能只移动文件后忽略构建错误。

如果需要撤销一个完整的错误提交，可以先检查该提交涉及的文件，再使用 `git revert <错误提交的完整哈希>` 生成反向修改。处理可能的冲突，检查反向修改、测试通过后，推送并重新部署。若有多笔后续变更，应先判断撤销范围。

使用源码修正后重新发布，可以让 GitHub 与线上内容保持对应。Git 中撤销提交或移动文章本身，都需要部署后才会影响正式站。

## 11. 日常发布速查

以下从“文章已完成并在本地预览过”开始。替换实际文件名，图片或其他文件按需暂存。逐条确认成功，再执行下一条：

```sh
cd /Users/dongwei/JoeyDong/My_GitHub_Source/joeyddong_blog_page

# 确认当前为 dev，且改动属于本次发布
git branch --show-current
git status --short

# 干净构建与检查
npm run clean && npm run check && npm run verify

# 检查差异，并暂存文章；有本地图片时另行暂存
git diff
git add -- source/_posts/disjoint-set-notes.md
git diff --cached
git diff --cached --check

# 中文提交并备份到 GitHub
git commit -m "新增并查集基础笔记"
git push origin dev

# 确认工作区，检查账号并部署
git status --short
npm run cf:whoami
npm run deploy
```

命令全部成功后，打开实际文章地址，检查正文和搜索结果。到这一步，本次手动发布才算完成。

## 12. 相关文件

- [项目说明与常用命令](../README.md)
- [Cloudflare 配置与部署记录](./CLOUDFLARE.md)
- [新文章模板](../scaffolds/post.md)
- [草稿模板](../scaffolds/draft.md)
- [站点配置](../_config.yml)
- [部署配置](../wrangler.jsonc)
- [验证记录](../VALIDATION.md)
- [历史迁移记录](../MIGRATION.md)
