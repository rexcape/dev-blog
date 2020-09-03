---
title: Vimium 的介绍和使用
date: 2020-08-22 22:11:11
tags:
  - vim
  - Chrome
categories:
  - 实用
---

介绍 Vimium 以及基本用法

<!--more-->

## 介绍 Vimium

Vimium [官网链接](https://vimium.github.io/)

[插件 Chrome 商店地址](https://chrome.google.com/webstore/detail/vimium/dbepggeogbaibhgnhhndojpepiihcmeb)

官网介绍：Vimium 是 Google Chrome 浏览器的扩展程序，它提供了 Vim 精神用于导航和控制的键盘快捷键。

对于一部分熟练使用 Vim 文本编辑器的程序员而言，这款插件可以极为简化浏览网页的过程。

你也可以自定义 Vimium 的所有快捷键

## 默认快捷键表

![Vimium 默认快捷键表](https://s1.ax1x.com/2020/08/23/dwEY2d.png)

## 基础用法

介绍 Vimium 插件的基础使用

{% note warning %}

注意：以下说明全部基于 Vimium 的默认快捷键，所有快捷键区分大小写

{% endnote %}

### 移动

使用 `h`、`j`、`k`、`l` 来作为左、下、上、右的基础移动，使用 `gg`、`G`来访问网页的开头和结尾（和 `Vim` 编辑器相同）。

使用 `u` 和 `d` 来进行半页的向上、向下滚动。

### 跳转

使用 `H`、`L` 来进行页面的后退和前进

使用 `f` 来显示当前页面所有可跳转的 URL，选择后在当前页面跳转

使用 `F` 来显示当前页面所有可跳转的 URL，选择后在新标签页跳转

### 标签页

使用 `t` 来新建标签页

使用 `J`（或者 `gT`）、`K`（或者 `gt`）来向左右选择标签页

使用 `x` 来关闭标签页

使用 `X` 来恢复上一个关闭的标签页

### 搜索

使用 `o` 来在当前页面打开 URL、书签或者历史

使用 `O` 来在新标签页打开 URL、书签或者历史

使用 `b` 来在当前页面打开书签

使用 `B` 来在新标签页打开书签

使用 `T` 来在已经打开的页面中搜索

### 查找

使用 `/` 来进入查找模式

使用 `n` 来查看下一个匹配结果

使用 `N` 来查看上一个匹配结果

### 刷新

使用 `r` 来刷新页面

## 定制

打开插件选项可以看到一系列配置

`Excluded URLs and keys` 是在指定 URL 排除指定的按键

`Custom key mappings` 是重新定义按键映射，示例如下

```vimscript
" 这是注释
# 这也是注释

# 将 j 键映射到向下滚动
map j scrollDown
# 解除 j 键的绑定
unmap j
# 解除所有键的绑定
unmapAll
```

更多配置请自行探索

## 另外的浏览器

QuteBrowser 同样是用 vim 的思想设计的浏览器，相关资料请移步其[官方网站](https://qutebrowser.org/)
