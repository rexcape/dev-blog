---
title: CSS 常用单位
date: 2020-05-28 08:48:01
tags:
- CSS
- 基础知识
categories:
- 实用
---

简单介绍 CSS 常用单位
<!--more-->

## px

`px` 是最常用的**绝对单位**，全称是 `pixel` ，代表屏幕上的像素点，用法如下

```css
div {
  font-size: 18px;
}
```

## em

`em` 是一个相对单位，代表相对父元素字体大小的倍数，用法如下

```css
div {
  font-size: 20px;
}
div h1 {
  font-size: 0.8em;
}
```

此时的 `div` 中的 `h1` 元素字体大小为 `20px * 0.8em = 16px`

## rem

`rem` 也是一个相对单位，代表相对根（root）元素字体大小的倍数，用法如下

```css
html {
  font-size: 10px;
}

h1 {
  font-size: 0.8rem;
}
```

此时的 `div` 中的 `h1` 元素字体大小为 `10px * 0.8em = 8px`，并且不受父容器字体大小的限制

## vw 和 vh

`vw` 和 `vh` 即是 `viewport width` 和 `viewport height` 的缩写，`viewport` 是目前看到的画面的大小，他们的值只能是 1 - 100，`50vw` 是占画面宽度的一半，`50vh` 是占画面高度的一半

经常用到的是 `100vh` 和 `100 vw`，用来做水平垂直居中都很方便

## 参考

[CodingStartup - 5 个常用的 CSS 单位](https://www.bilibili.com/video/BV1d441167e9)

[知乎 - css 单位中 px 和 em,rem 的区别](https://zhuanlan.zhihu.com/p/28915418)

[w3.org - 网页样式表 CSS 提示以及技巧](https://www.w3.org/Style/Examples/007/units.zh_CN.html)
