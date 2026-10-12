# JoeyDDong 新 Hexo 博客项目上下文


最新工具选择：用户已要求使用 npm，现以 Node.js 24.21.0、npm 11.19.0、`package-lock.json` 和 `npm ci` 为准；命令见 README 与 docs/CLOUDFLARE.md。本文中的 pnpm 描述为历史记录。
整理日期：2026-10-12

将本文件放在新博客项目根目录，供新的 Codex 会话先阅读。本文区分用户已确认的需求、推荐默认方案和待确认事项；后续用户的新决定优先。

## 最新需求补充（2026-10-12）

本轮详细咨询的完整记录见根目录 [BLOG_REQUIREMENTS.md](./BLOG_REQUIREMENTS.md)。后续会话应同时阅读该文件；与本文早期建议冲突时，以该文件中的最新确认为准。

用户已更新正式主域名为 **`joeyddong-site.top`**。Blog 使用 `blog.joeyddong-site.top`，Projects 与 Photography 使用对应子域名；导航、站点元信息和语言共享 Cookie 均按新域名配置。

最新部署进展：用户已要求部署并确认使用独立 Cloudflare Workers。现已配置 `joeyddong-blog`、固定 Wrangler、构建校验和部署命令，完整 dry-run 与本地 Cloudflare 路由检查通过。2026-10-13 已实际上传，并成功绑定、验证 https://blog.joeyddong-site.top；备用地址为 https://joeyddong-blog.dongweisp.workers.dev。GitHub 自动部署尚未连接。远程 `main` 当前只有初始 README，生产集成前需合入完整代码。步骤见 [docs/CLOUDFLARE.md](./docs/CLOUDFLARE.md)，验证见 [VALIDATION.md](./VALIDATION.md)。下文“后续部署”等表述为历史状态。

- 用户已确认直接基于 **Icarus 主题定制**，并融合 homepage 视觉，替代本文第 5 节的从零开发 EJS 自定义主题建议。
- 首页为短红色横幅＋博客内部导航＋Icarus 三栏；文章页为宽正文＋右侧目录。
- 内容区域采用浅色背景、奶油色文章卡片和淡紫／淡绿侧栏；文章封面在卡片顶部，标题在其下方，不另设红色文章标题横幅。
- 首阶段包含三语、文章语言筛选、分类、标签、归档、独立全文搜索、目录、公式、代码复制及图片放大。
- 用户最初确认使用测试文章、不加入评论、统计和深色模式；随后已要求复制旧博客 GitHub 仓库 `source/_posts` 的全部 Markdown，替代此前暂不迁移旧文章的决定。正式部署仍在后续安排。
- 当前已完成 Hexo 8.1.2＋Icarus 6.1.1 的实现，并已从旧仓库 `main` 导入全部 12 篇旧文。2026-10-13 按用户要求将原有 12 篇测试文章原样移入 `source/_drafts/`，默认不生成、不计入搜索及分类／标签／归档／文章数量；正常构建只包含 12 篇正式文章。实际环境为 Node.js 24.21.0、npm 11.19.0；测试文章隐藏改动尚未重新部署。使用方式见 [README.md](./README.md)，验证结果见 [VALIDATION.md](./VALIDATION.md)，迁移详情见 [MIGRATION.md](./MIGRATION.md)。本文下方保留前期背景，不能把早期建议或待确认项误读为最新状态。
- 旧文头部已按后续要求规范化：显式固定 slug、中文原文语言、摘要、编程分类及 cover，移除 Keep／MathJax 专用字段并修正竞赛标签拼写。标题、发表时间、正文和文章网址保留；迁移清单只用于来源与正文校验，不再参与运行时语言判定。

## 1. 项目目标与最新决定

用户希望从零建立一个独立的 Hexo 博客，并让它与已经完成的个人主页具有统一的视觉风格。

已确认：

- 个人姓名及品牌统一写作 **JoeyDDong**，注意大小写。
- 新博客继续使用 **Hexo**，建立全新的项目和仓库。
- **不再基于以前的 `My_Hexo_Blog_Source` 仓库或 Keep 主题进行改造。** 这项决定替代此前的“定制现有 Keep 主题”方案。
- Blog 是个人网站的独立子项目，与主页分开维护和部署。
- 博客用于文章、编程笔记、学习记录和个人思考。
- 统一主页与博客的导航、品牌、基础视觉和语言偏好；具体内容布局可以不同。
- 界面支持中文、英文和日文，文章保留原始语言，不要求自动翻译每篇文章。

“新建项目”不等于“删除旧文章”。是否导入旧文章尚未确认，旧站和旧仓库无需为初始化新项目而修改。

## 2. 个人网站的整体结构

主导航固定包含 **Home、Blog、Projects、Photography、Portfolio**，文字随界面语言切换。博客页面应将 Blog 标记为当前栏目。

| 栏目 | 内容 | 规划网址 |
| --- | --- | --- |
| Home | 个人主页 | `https://joeyddong-site.top` |
| Blog | 本项目，新 Hexo 博客 | `https://blog.joeyddong-site.top` |
| Projects | Coding、Vibe Coding、Data Science 等项目 | `https://projects.joeyddong-site.top` |
| Photography | 摄影作品 | `https://photography.joeyddong-site.top` |
| Portfolio | 主站的个人简介 | `https://joeyddong-site.top/portfolio/` |

以上是网址规划，不表示所有子站都已上线。切换正式域名前，需要核对新域名的实际解析和旧站状态。

新仓库建议命名为 `joeyddong-blog`，但尚未创建或最终确认。主站继续保留 Astro 实现。

## 3. 可以参考的现有主页

主页仓库：[weiweiweidong/joeyddong_homepage](https://github.com/weiweiweidong/joeyddong_homepage)。访问私有仓库时使用用户现有授权。

如在同一台电脑上，新会话可以只读参考现有主页目录：

```text
/Users/dongwei/JoeyDong/My_GitHub_Source/joeyddong_homepage
```

重点参考该目录中的文件：

| 文件 | 参考内容 |
| --- | --- |
| `src/styles/global.css` | 配色、字体、圆角、间距、响应式布局、背景动效 |
| `src/components/Header.astro` | 五项导航、手机菜单、品牌文字 |
| `src/components/Footer.astro` | 页尾视觉和链接 |
| `src/components/LanguageSwitcher.astro` | 右上角三语下拉菜单与键盘操作 |
| `src/lib/locale-preference.ts` | 浏览器语言匹配、Cookie 和本地偏好 |
| `src/lib/i18n.ts` | 三语文案 |
| `src/lib/site.ts` | 站点地址及跨站链接 |

Astro 组件需要适配为 Hexo 的模板；可以复用自己的设计、CSS 和浏览器交互逻辑。实现新博客时，主站是参考项目，不应在本次任务中顺带修改主站。

## 4. 已有品牌视觉

当前主页视觉参考 [Kickpush](https://kickpush.co/)，已经替代最初的暖白编辑式主页方案。

- 主色是珊瑚红 **`#cc4942`**，搭配白色粗体无衬线标题。
- 奶油色卡片 **`#f7eee0`**，深色文字 **`#252628`**。
- 辅助卡片颜色包括淡紫 **`#efd6ec`** 和淡绿 **`#c9ddcb`**。
- 字体使用 Avenir Next、Avenir、Arial 和中日文字体回退；默认不依赖外部字体服务。
- 大标题、充足留白、圆角卡片、圆形箭头和轻微悬停反馈构成统一视觉。
- 主页背景包含渐变圆形、倾斜圆角矩形和圆环，以 12–16 秒的交错节奏移动、旋转和缩放。
- 动画提供播放／暂停控制，系统开启“减少动态效果”时默认静止，用户可手动开启。
- 桌面与手机布局均需清晰，装饰不能遮挡正文或拦截点击。

主页首屏现有中文文案为：

> 我是 JoeyDDong。
> 写代码，也记录生活。
> 这里有我的项目、学习笔记，以及镜头里的日常。

这些文案帮助理解品牌语气；博客首屏应使用适合文章入口的文案，不必重复个人主页的完整首屏。

## 5. 新博客的推荐默认方案

本节是此前讨论中的建议，可作为第一版的起点，具体预览效果还需由用户确认。

### 技术与组织

- 初始化全新的 Hexo 项目，选用当时的稳定版本并固定依赖、提交锁文件。
- 沿用 **Node.js 24.19.0、pnpm 11.25.0**，先检查本机实际运行版本。
- 在 `themes/joeyddong/` 中实现自己的主题，初期与博客源码放在同一仓库维护。
- 使用 **EJS + 原生 CSS + 少量 JavaScript**，保持静态、轻量、易维护。
- 文章存放在 `source/_posts/`，图片使用可维护的本地资源组织方式。
- 根据明确的功能需求添加插件，不直接继承旧项目的整套配置与依赖。

### 页面设计

| 页面 | 第一版建议 |
| --- | --- |
| 博客首页 | 较短的红色几何渐变横幅，下方为浅色文章列表或卡片 |
| 文章阅读页 | 统一导航、红色标题区域；奶油色正文背景和深色文字 |
| 分类、标签、归档 | 使用同一套字体、配色、间距和列表控件，后续补齐 |

文章列表展示标题、摘要、日期和已有分类／标签。阅读页重点是正文宽度、字号、行距、标题层级、代码和图片的表现；阅读区域推荐保持静态。

### 多语言与跨站导航

- 语言标识统一为 `en`、`zh`、`ja`，右上角使用下拉菜单。
- 兼容主站跨站链接携带的 `?lang=en|zh|ja` 参数。
- 优先尊重显式语言选择，再读取已保存偏好，最后匹配浏览器语言；未匹配时回退英文。
- 与主页使用相同的偏好键 **`joey_locale`**。
- 正式 `joeyddong-site.top` 域名及其子域名通过共享 Cookie 延续偏好；localStorage 只属于各自域名，不能视为跨域共享。
- 临时 `workers.dev` 地址不能共享正式域名的 Cookie，可使用参数和本地偏好。
- 切换界面语言时保留当前文章，文章标题和正文保持原始语言。初版可在同一文章网址切换界面文案。
- 主页中文路径为 `/zh/`、日文路径为 `/ja/`；Portfolio 对应 `/zh/portfolio/`、`/ja/portfolio/`，英文无语言前缀。跨站导航应指向对应的主站页面。

## 6. 建议实施顺序与第一轮交付

1. 阅读本文件，检查新项目目录和版本管理状态，初始化 Hexo，确认默认页面可启动、可生成。
2. 创建最小自定义主题，完成公共布局、页眉、页尾、博客首页与文章页。
3. 接入个人网站的五项导航和基础视觉，在本地提供可查看的预览。
4. 使用明确标记为测试用途的文章，验证代码、图片、表格、长标题与移动端排版；公式作为编程／数据科学内容的扩展测试。
5. 实现三语界面与偏好记忆，再逐步完善目录、归档、分类、标签和搜索。
6. 预览和静态构建验证通过后，接入新博客的独立 Cloudflare 项目；最后处理正式域名和可选的旧文章迁移。

**第一轮交付目标：能够本地预览的博客首页、完整文章阅读页，以及统一的导航和页尾。** 不必在第一轮加入评论、访问统计、复杂插件或全部旧文章。

## 7. 部署方向与已遇到的问题

用户偏好部署简单、便于自动更新，主要面向海外或不限定地区。主站已连接 GitHub 与 Cloudflare Workers，生产分支为 `main`；用户反馈部署似乎成功，本文未记录可验证的线上访问地址。

新博客建议独立连接 GitHub 与 Cloudflare Workers，`main` 用于正式发布、`dev` 用于开发。新项目的实际 Worker 名称和仓库地址需要在创建时确定。

重要差异：**Hexo 默认生成 `public/`，主页 Astro 生成 `dist/`。新博客的部署目录应使用 `public/`。**

建议将 `pnpm build` 配置为执行 `hexo generate --bail`，并在新博客的 Wrangler 配置中设置：

- `name`：与新博客的实际 Worker 名称一致。
- `build.command`：`pnpm build`。
- `assets.directory`：`./public`。
- `compatibility_date`：选定有效的兼容日期。

Cloudflare 部署命令使用 `npx wrangler deploy`，由 Wrangler 先构建再部署时，控制台构建命令可留空。测试时用 `wrangler deploy --dry-run` 验证整个流程，并至少验证一次输出目录尚不存在的情况。

主页部署曾遇到三类问题，新项目应避免重复：

1. 云端选择的分支只有 README，没有 `package.json`。正式分支需要包含完整项目源码。
2. 缺少 Wrangler 配置，自动配置过程修改依赖并触发 pnpm 安装脚本限制。应明确配置静态资源部署；需要安装脚本的依赖须按实际需要处理。
3. 只配置输出目录，未执行构建，导致云端找不到输出文件。应验证“安装依赖 → 构建 → 部署”的完整顺序。

不要提交 `node_modules/`、生成目录 `public/`、Hexo 缓存、账号令牌或私密环境配置。Git 提交说明使用中文。实际部署成功应以 Cloudflare 返回结果和网页访问验证为准。

## 8. 验收与待确认事项

基础验收：

- 博客首页和文章页在桌面、窄屏手机上无横向溢出。
- 导航、手机菜单、语言下拉菜单可以点击和通过键盘操作。
- 界面语言切换保留当前文章，原文内容完整。
- 长代码、图片、表格和多层级标题能够正确阅读；按已启用能力检查公式与目录。
- 动效可暂停，尊重系统减少动画设置。
- 全新构建生成完整 `public/`，部署流程不会依赖本机已有输出文件。
- 本地预览、线上地址及正式域名的验证结果分别如实记录。

待确认事项：

- 新仓库名称、保存位置和是否设为私有。
- 是否导入旧文章；如果需要，哪些内容和原有网址应保留。
- 博客首页横幅文案，以及浅色阅读区域的具体视觉。
- 第一版是否立即需要公式、目录、搜索或评论。
- 当前正式域名解析与旧 Blog 状态，以及最终的域名切换安排。

可以先按推荐默认方案推进基础页面，将有影响的未定事项在对应阶段与用户确认。未提供的文章、经历、照片或其他个人信息不应编造为真实内容。

## 9. 官方参考

- [Hexo 初始化与目录结构](https://hexo.io/docs/setup)
- [Hexo 主题结构](https://hexo.io/docs/themes)
- [Hexo 模板与公共局部模板](https://hexo.io/docs/templates)
- [Hexo 命令](https://hexo.io/docs/commands)
- [Cloudflare 静态 Astro 部署参考](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/#if-you-have-a-static-site)（用于理解静态资源配置；博客输出目录需改为 `public/`）
- [Wrangler 自定义构建](https://developers.cloudflare.com/workers/wrangler/custom-builds/)
