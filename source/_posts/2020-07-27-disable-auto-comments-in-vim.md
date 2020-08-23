---
title: Vim 关闭自动插入注释
date: 2020-07-27 07:05:56
tags:
- vim
categories:
- 实用
---

介绍如何关闭 Vim 编辑器的自动插入注释功能

<!--more-->

## 问题

`Vim` 编辑器下，当你输入了一整行注释

```c++
// This is the comment
```

再按下回车，`Vim` 编辑器会自动给你在新的一行加上 `//`，这在有的时候非常不方便，我希望关闭这一项功能

## 解决方案

在你的 `.vimrc` 中加入

```vim script
autocmd FileType * setlocal formatoptions-=c formatoptions-=r formatoptions-=o
```

## 参考

[Disable automatic comment insertion | Vim Tips Wiki | Fandom](https://vim.fandom.com/wiki/Disable_automatic_comment_insertion)

给出了更多种解决方案，包括针对单种编程语言
