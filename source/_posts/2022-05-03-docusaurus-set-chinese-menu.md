---
title: Docusaurus 设置中文菜单
date: 2022-05-03 21:21:52
tags:
- docusaurus
categories:
- 踩坑
---

Docusaurus 设置中文菜单

<!--more-->

Docusaurus 是一个静态页面生成工具，其中每个文章的 Edit this page 和 Next 默认都是英文，在设置中设置 zh-CN 是无效的，需要设置为 zh-Hans

在 `docusaurus.config.js` 文件的 `config` 字段中添加如下键值

```js
const config = {
  // other config
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans"],
  },
};
```

注意，是 zh-Hans，不是 zh-CN。此处官方文档没有任何说明

## 参考

[翻译源代码](https://github.com/facebook/docusaurus/tree/main/packages/docusaurus-theme-translations/locales/zh-Hans)
