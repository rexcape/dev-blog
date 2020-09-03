---
title: scanf 格式字符串中的空格
date: 2020-06-24 12:54:52
tags:
  - C 语言
categories:
  - 踩坑
---

scanf 语句中空格的问题

<!--more-->

## 格式说明符前

```c
scanf("%d", &a);
scanf(" %c", &c);
```

第二行中 `%c` 前加空格，会消耗 `%d` 后的所有后继空白符，然后读取一个 `char`

## 格式说明符后

```c
scanf("%d ", &a);
```

这种写法在你输入数字后，`scanf` 会**跳过所有空格字符，包括回车符**，直到遇到不是空格字符才退出，**不建议这么写**

## 参考

[zh.cpprefernce.com](https://zh.cppreference.com/w/c/io/fscanf)

[scanf 语句中%d 后面多加一个空格，为什么数据需要多输入一个？\_百度知道](https://zhidao.baidu.com/question/620629950137762012.html)
