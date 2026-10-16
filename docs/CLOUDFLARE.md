# Cloudflare Workers 部署

本博客使用 Workers Static Assets，独立 Worker 名称为 `joeyddong-blog`，上传 Hexo 的 `public/`。配置集中在根目录 `wrangler.jsonc`，无需编写 Worker 服务端脚本。

## 本机部署

本机已验证 Node.js 24.21.0、npm 11.19.0：

```sh
npm ci
npm run deploy:check
npm run cf:login
npm run cf:whoami
npm run deploy
```

`deploy:check` 不上传。`deploy` 与 `deploy:check` 都由 Wrangler 的 `build.command` 依次清理旧输出、执行回归测试、生成并验证完整站点；不依赖已有的 `public/`。失败时中止部署。Wrangler 固定版本写入锁文件，`npm ci` 会执行 `esbuild` 和 `workerd` 等必要依赖的安装脚本。

首次登录在浏览器中授权。拥有多个 Cloudflare 账号时，通过终端环境变量 `CLOUDFLARE_ACCOUNT_ID` 指定目标账号；不要把 API Token 写入源码或提交到 Git。本机也可使用 OAuth，无需在聊天中提供令牌。

部署成功后，终端会返回实际 `workers.dev` 地址与版本标识。首次 Worker 名称若需要调整，修改 `wrangler.jsonc` 的 `name`，并确保 Cloudflare 项目名称与之相同。

## Cloudflare 本地预览

```sh
npm run cf:preview
```

打开 Wrangler 显示的本机地址（通常为 `http://127.0.0.1:8787`）。文章、分类和搜索页面使用尾斜杠 URL；不存在的路径返回 `404.html` 和 HTTP 404，不回退到首页。日常写作仍可使用更轻量的 `npm run dev`。

## GitHub 自动部署

在 Cloudflare 的 **Workers & Pages** 中找到首次部署的 `joeyddong-blog`，在 **Settings → Builds** 连接 GitHub 仓库 `weiweiweidong/joeyddong_blog_page`。

| 设置 | 值 |
| --- | --- |
| Worker 名称 | `joeyddong-blog`（与 Wrangler 一致） |
| 项目根目录 | 仓库根目录 `/` |
| 生产分支 | `main` |
| 构建命令 | 留空，Wrangler 自动构建并校验 |
| 部署命令 | `npm run deploy` |
| 非生产分支部署命令（如启用） | `npm exec -- wrangler versions upload` |
| 构建变量 | `NODE_VERSION=24.21.0` |

**2026-10-12 检查时，远程 `main` 只有初始 README，完整博客代码位于 `dev`。** 连接生产自动部署前，先将完整源码、`wrangler.jsonc` 和锁文件合并到 `main` 并推送。仅本地修改或首次 CLI 上传不会同步 GitHub，也不会自动建立 Git 集成。不要使用 homepage 的 `dist/` 输出目录设置。

## 正式域名

2026-10-13 已将 `wrangler.jsonc` 的 Custom Domain 改为 `blog.joeyddong.top`，并成功部署、验证新域名的 HTTPS 与线上页面。后续部署将使用该域名。`workers_dev: true` 保留备用地址。

- 正式地址：https://blog.joeyddong.top
- 备用地址：https://joeyddong-blog.dongweisp.workers.dev
- 最新发布版本：`3a698bdb-ae3c-49b7-97a0-4b5d8d1eb1ca`（2026-10-17，补齐 8 篇本机笔记，正式文章共 20 篇）

换账号或域名时，确保目标 zone 在对应 Cloudflare 账号中，并先核对 DNS 与现有服务。

已验证新域名的 HTTPS 证书、首页、`/search/`、文章、中文分类路径、图片、搜索索引、404 及保留语言查询参数的尾斜杠重定向。跨子域语言 Cookie 仍需浏览器实测。Hexo `_config.yml` 的 `url` 已指向 `https://blog.joeyddong.top`；临时预览地址的 canonical 仍指向正式地址。

2026-10-13 已将 12 篇测试文章移入 `source/_drafts/`。正常构建只发布 12 篇正式文章，草稿不会进入页面、分类、归档和搜索索引；部署前的自动清理会移除测试文章的旧生成页面。隐藏改动已于 2026-10-13 重新部署并在线验证：搜索索引包含 12 篇正式文章，全部 12 个测试文章地址返回 404。旧博客日期地址及短链重定向还未配置。

2026-10-17 已通过 `npm run deploy` 发布 8 篇新增笔记，部署时 9 项测试及 120 个 HTML 页面／20 篇文章检查通过。发布后线上搜索索引、首页及第二页、归档、中文文章列表两页和 8 个新文章地址均返回 200，响应内容与本地已验证构建逐字节一致。原有 12 篇文章源码未覆盖。

## 官方文档

- [Workers 静态资源](https://developers.cloudflare.com/workers/static-assets/)
- [静态站点与自定义 404](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)
- [Workers Builds 配置](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [构建环境及版本配置](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)
- [自定义域名](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
