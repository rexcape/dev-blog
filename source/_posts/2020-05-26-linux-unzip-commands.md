---
title: Linux 常用解压命令
date: 2020-05-26 09:00:00
tags:
- Linux
categories:
- 实用
---

Linux 常用的解压命令
<!-- more -->

## 概述

Linux 下常见的压缩包格式为 `zip tar.gz tar.bz2 tar.xz tar.Z`
其中 `tar` 是打包格式，`gz2 bz2` 等后缀是指代压缩方式

## filename.zip

```bash
$ unzip filename.zip
```

## filename.tar.gz

```bash
$ tar -zxvf filename.tar.gz
```

-z：gzip - 压缩格式
-x：extract - 解压
-v：verbose - 详细信息
-f：file - 文件

## filename.tar.bz2

```bash
$ tar -jxvf filename.tar.bz2
```

-j：bz2 压缩方式

## filename.tar.xz

```bash
$ tar -Jxvf filename.tar.xz
```

注意 J 大写

## filename.tar.Z

```bash
$ tar -Zxvf filename.tar.Z
```

注意Z大写

## 简便写法

首先，使用 `tar --version` 查看版本，从1.15版本以后可以直接使用 `tar -xvf` 来智能识别格式

参考自[Linux 下的解压命令小结 - cursorhu](https://www.cnblogs.com/cursorhu/p/5891699.html)