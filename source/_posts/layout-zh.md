---
title: "【测试】从一段代码开始：中文长文、公式与阅读排版"
slug: layout-zh
date: 2026-10-12 09:00:00
article_lang: zh
test: true
summary: "这是一篇明确标记的测试文章，用于检查中文长文、代码、数学公式、图片和表格的阅读体验，不代表作者的真实经历。"
categories:
  - 编程
tags:
  - Layout
  - Hexo
last_updated: 2026-10-12
cover: /assets/images/test-geometric.svg
cover_alt: 测试用品牌几何图形
---

## 用途与边界

这份内容用于验证博客主题。标题、元信息、文章目录与图片放大都是验收对象；文章正文保留原始语言，切换界面语言时不会被翻译。

> 测试材料用于检查展示能力，不应被理解为正式发布的观点或个人记录。

## 代码与复制

下面是一个用于检查语法高亮与复制操作的 Python 示例。搜索关键词 **pagination_probe** 只出现在正文，便于验证全文搜索。

```python
def pagination_probe(items, page=1, per_page=10):
    start = (page - 1) * per_page
    return items[start:start + per_page]

print(pagination_probe(list(range(30)), page=2))
```

### 超长代码行

长代码应当在代码框内滚动，不会撑宽整个页面。

```javascript
const sample = { description: "This intentionally long line checks horizontal scrolling inside the code block rather than stretching the entire document across a narrow mobile viewport.", category: "programming", language: "zh", test: true };
```

## 数学公式

行内公式示例：当 $a^2 + b^2 = c^2$ 时，页面应保留正确的字体与基线。

独立公式示例：

$$
\mathcal{L}(\theta)=\frac{1}{n}\sum_{i=1}^{n}(y_i-f_\theta(x_i))^2
$$

### 推导中的多层标题

这里检查三级标题能否进入文章目录。下面的列表也是正文排版测试。

1. 准备输入数据。
2. 在本地运行示例。
3. 检查输出和边界条件。

#### 边界条件

空输入、重复条目与最后一页不足十篇，都是分页需要处理的情况。

## 图片与说明

下面的图形是本项目创建的测试资源，不是个人照片。点击可以放大；使用左右方向键可切换图片，按 Esc 可关闭。

![测试用珊瑚红、淡紫和淡绿几何图形](/assets/images/test-geometric.svg "图一：测试用品牌几何图形")

![第二张图片，用于测试同篇图片切换](/assets/images/test-grid.svg "图二：测试用网格与圆环")

## 表格与窄屏

| 场景 | 输入 | 预期输出 | 检查方式 |
| --- | --- | --- | --- |
| 首页分页 | 12 篇测试文章 | 首页 10 篇，第二页 2 篇 | 页码导航 |
| 原文语言 | 中文、English、日本語 | 保留原始文章内容 | 切换界面语言 |
| 全文搜索 | pagination_probe | 返回此测试文章 | 搜索正文关键词 |
| 长内容 | very_long_identifier_that_checks_whether_a_table_remains_readable_on_small_screens | 只在表格容器内滚动 | 手机预览 |

## 链接与结束

可访问 [Hexo 官方文档](https://hexo.io/docs/) 了解写作格式。文章末尾应包含分类、标签、前后文章以及返回列表入口。

## 重复标题

两个相同标题需要各自独立的锚点。

## 重复标题

这段内容用于验证第二个同名标题的目录链接。
