# 主题来源与维护

本主题由 ppoffice 的 **hexo-theme-icarus 6.1.1** npm 发布包派生。

- 原项目：https://github.com/ppoffice/hexo-theme-icarus
- 示例：https://ppoffice.github.io/hexo-theme-icarus/
- 许可证：MIT，原始版权声明保留在 `LICENSE` 中。
- KaTeX 0.19.0 的本地样式和字体位于 `source/vendor/katex/`，许可证随资源保存。

保留上游 `include/`、`languages/`、主题扩展与 Stylus/Bulma 基础。定制集中在 `layout/` 的页面与品牌组件、`lib/content.cjs`、`source/css/joey.css` 和自有浏览器脚本。

`package.json` 的主题名称改为 joeyddong，Hexo 兼容检查扩展到已验证的 Hexo 8；其他来源信息保留。当前依赖组合固定在项目根目录的锁文件中。

主题升级需要单独核验与合并，不能直接覆盖定制目录。根目录 `hexo-theme-icarus` 依赖记录原始发行版本；更新该依赖不会自动更新本目录。原始主题的可选插件及资产保留在源码中，但当前布局仅加载自有脚本、Icarus 基础样式与本地公式资源，不开启评论或统计。
