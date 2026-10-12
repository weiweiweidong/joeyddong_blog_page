# JoeyDDong Blog

独立的 Hexo 博客，基于 **Icarus 6.1.1** 定制，延续 JoeyDDong homepage 的品牌视觉。

当前已完成可本地预览的第一版：首页三栏、宽正文文章页、分类、标签、归档、三语界面、文章语言筛选、独立全文搜索、目录、公式、代码复制和图片放大。已从旧博客 GitHub 默认分支导入全部 12 篇 Markdown，保留原有 12 篇测试文章，共 24 篇。尚未正式部署，迁移来源与验证记录见 [MIGRATION.md](./MIGRATION.md)。

正式地址配置为 `https://blog.joeyddong-site.top`，主站为 `https://joeyddong-site.top`，Projects／Photography 使用对应子域名；界面语言 Cookie 在 `joeyddong-site.top` 及其子域间共享。这里记录配置地址，实际部署及域名解析仍需另行验证。

## 环境与运行

- Node.js **24.21.0**（`.node-version`；Node 24 系列）
- pnpm **11.25.0**（`packageManager`）
- Hexo **8.1.2**，依赖固定版本，提交 `pnpm-lock.yaml`

```sh
pnpm install --frozen-lockfile
pnpm dev
```

打开 `http://127.0.0.1:4000/?lang=zh`。英文使用 `?lang=en`，日文使用 `?lang=ja`。服务仅监听本机；默认端口为 4000。

```sh
pnpm clean       # 清理生成内容与 Hexo 缓存
pnpm build       # hexo generate --bail，输出到 public/
pnpm check       # 内容处理、日期、完整语言筛选分页和三语文案回归测试
pnpm verify      # 构建并检查页面、链接、锚点、分页、搜索索引和脚本
```

`.npmrc` 将依赖缓存放在本项目的 `.pnpm-store/`。pnpm 安装脚本白名单仅允许 Hexo 工具生成代码高亮映射，关闭不需要的 Inferno 捐赠提示脚本。Babel/Inferno 编译依赖已固定为兼容版本，避免上游 Babel 8 与当前渲染器冲突。

## 写作

```sh
pnpm exec hexo new post "your-article-slug"
```

文章位于 `source/_posts/`，使用 `scaffolds/post.md` 模板。推荐文件名及 slug 使用简短英文，标题可以使用任何语言。

```yaml
---
title: 一篇文章的标题
slug: your-article-slug
date: 2026-10-12 09:00:00
article_lang: zh
summary: 手动摘要，可留空。
categories:
  - 编程
tags:
  - Python
# 真正编辑文章时再填写，不根据文件修改时间自动更新：
# last_updated: 2026-10-13
# cover: /assets/images/your-cover.jpg
# cover_alt: 图片说明
---
```

- 文章地址为 `/posts/your-article-slug/`。修改标题、分类或发布日期不改变网址；slug 应保持唯一且稳定。
- `article_lang` 使用 `en`、`zh`、`ja`，默认英文；它与界面语言独立。
- 分类使用编程、学习、生活、思考，具体技术放入标签。四类名称在界面中提供英日翻译，标签保留原始名称。
- 手动 `summary` 优先，未填写则自动截取正文开头，忽略代码、公式、图片。
- `last_updated` 是明确的内容更新时间，可省略；不得早于发布日期。重新构建、检出 Git 或修改文件时间不会自动展示更新日期。推荐日期值加引号以便人工阅读；未加引号的 YAML 日期也按东京时区处理。
- 封面可选；没有封面时不添加占位图。封面只在卡片中展示，不替代正文图片。
- 已导入旧文的头部统一使用 `slug`、`article_lang`、`summary`、`categories` 和 `cover`，保留原发表时间与正文。`content/legacy-posts.json` 仅记录迁移来源和正文校验，不再参与运行时语言判定。旧 `home_cover` 的兼容回退仍保留；原有 HTML 图片和带空格的行内公式可正常渲染。
- 测试文章使用 `test: true`。页面会显示测试标记，完整文章页会显示用途说明；正式文章不填写该字段。
- 草稿可使用 `pnpm exec hexo new draft "slug"`，发布时使用 `pnpm exec hexo publish "slug"`。默认不渲染草稿或未来日期文章。

图片保存到 `source/assets/images/`，文章引用 `/assets/images/文件名`。不要填写本机绝对路径。

```markdown
![替代文本](/assets/images/photo.jpg "图片说明")

行内公式：$a^2+b^2=c^2$

$$
\sum_{k=1}^{n} k = \frac{n(n+1)}{2}
$$
```

数学公式由 KaTeX 在构建时渲染，字体与样式本地提供。正文图片可点击放大，方向键切换，Esc 关闭；Markdown 图片标题用于说明文字。已有图片链接保留其链接行为。

## 主题与内容查找

- `themes/joeyddong/` 保存 Icarus 的源码及定制，不修改 `node_modules`。
- 保留 Icarus 的 Inferno 模板、Stylus/Bulma 样式基础、分类／标签生成器与扩展结构；品牌布局及阅读组件集中在该主题中。
- `themes/joeyddong/source/css/joey.css` 为品牌及响应式样式，`source/js/` 下为三语、语言偏好、阅读交互与搜索代码。
- 博客首页采用三栏；文章页采用正文＋目录。手机优先显示文章，个人卡片在列表后，侧栏与目录可折叠。
- 文章列表每页 10 篇。语言筛选访问完整的独立集合及分页，不是只隐藏当前页面中的不匹配文章。
- 搜索页为 `/search/`，关键词参数 `q`，文章语言参数 `article_lang`；输入后 180ms 自动更新。例如 `/search/?lang=zh&q=Python&article_lang=en`。
- 搜索索引在构建时生成到 `public/search-index.json`，不需要服务器或外部搜索账号。
- 界面优先读取显式 `?lang=`，然后 Cookie／localStorage 的 `joey_locale`，再匹配浏览器语言，最后回退英文。正式主域及子域共享 Cookie，临时域名与本地预览只使用各自存储与参数。

## 项目文档

- [需求与实现方案](./BLOG_REQUIREMENTS.md)
- [项目背景与当前状态](./PROJECT_CONTEXT.md)
- [验证记录](./VALIDATION.md)
- [旧文章迁移记录](./MIGRATION.md)
- [主题来源与维护说明](./themes/joeyddong/UPSTREAM.md)

首次部署、Cloudflare 配置和正式域名切换尚未实施。旧文章现使用 `/posts/slug/`，尚未设置旧站日期／短链网址重定向。Hexo 输出目录是 **`public/`**，与 Astro homepage 的 `dist/` 不同。上线前先处理测试内容，并核对独立部署设置及实际域名状态。
