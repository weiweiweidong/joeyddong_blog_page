---
title: "[TEST] A reading page for code, diagrams, and notes"
slug: layout-en
date: 2026-10-11 09:00:00
article_lang: en
test: true
summary: "A test article for English typography and mixed content. This is sample material, not a personal story."
categories:
  - 学习
tags:
  - Layout
  - Hexo
---

## Why this page exists

This sample checks the reading width, paragraph rhythm, links, and a table of contents. It deliberately has **no cover image**. The heading should begin at the top of the cream reading card without a placeholder.

## A small example

```javascript
const square = value => value ** 2;
console.log([1, 2, 3].map(square));
```

The inline expression $E = mc^2$ and the following display equation exercise mathematical rendering:

$$
\sum_{k=1}^{n}k=\frac{n(n+1)}{2}
$$

### Things to verify

- Changing the interface language keeps this English article open.
- Copying a code block preserves its line breaks.
- A long link such as https://example.com/an/intentionally/long/path/for/responsive/layout/testing wraps inside the card.

## A wide table

| Case | Expected behaviour | Notes |
| --- | --- | --- |
| Missing cover | Text begins directly | No automatic image |
| Empty search | Helpful prompt | No fabricated results |
| Language filter | Entire collection filtered | Pagination remains valid |

## Closing the sample

Use the next and previous article links to explore the other test pages. These fixtures will be removed or explicitly retained before a future production launch.
