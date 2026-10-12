'use strict';
const texmath = require('markdown-it-texmath');

// Keep legacy MathJax-style padding inside $ ... $ without rewriting source.
// Escaped dollars stay within the same expression; an unescaped $ always ends it.
texmath.rules.joey = {
  inline: texmath.rules.dollars.inline.map(rule => rule.name === 'math_inline' ? {
    ...rule,
    rex: /\$((?:\\.|[^$\\\n])+?)\$/gy
  } : { ...rule }),
  block: texmath.rules.dollars.block.map(rule => ({ ...rule }))
};
module.exports = (markdown, options = {}) => texmath(markdown, { ...options, delimiters: 'joey' });
