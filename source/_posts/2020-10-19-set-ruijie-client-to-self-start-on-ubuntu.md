---
title: Ubuntu 设置锐捷客户端为自启动
date: 2020-10-19 20:07:31
tags:
  - Linux
categories:
  - 踩坑
---

如何用 Linux 的 systemd 让锐捷客户端自启动

<!--more-->

## 我为什么要换为 Ubuntu

Windows 10 系统实在没法用来开发，最近遇到的问题：

- PowerShell Git 客户端显示 Git log 乱码，按照网上大多数教程都没用
- PowerShell Python 下虚拟环境 Virtualenv 显示颜色过于鲜艳
- 没有原生 GCC、G++ 编译器，安装 MinGW 频繁报错
- 系统的大多数编程环境（如 Python）无法一键进行更新

实在用不下去，添加了 Ubuntu 系统，和 Windows 10 组了一个双系统，总体来说兼容性
很好，没有发生致命错误，小错误倒是一堆，而且还有很多必须要用但是不兼容的软件，
例如本文章的锐捷客户端，所以来记录一下如何配置锐捷客户端并且设置为自启动

## 环境

硬件环境：DELL G3 3579

操作系统：Ubuntu 20.04LTS

## 官方客户端

锐捷的官方客户端需要网卡加载以后再运行，没法进行 `systemd` 配置，所以不使用官方客户端

## 第三方客户端

这里使用 minieap 作为认证客户端，minieap 的 [GitHub 链接](https://github.com/updateing/minieap)

首先，克隆仓库

```bash
$ git clone https://github.com/updateing/minieap.git
```

转到仓库 `cd minieap`

安装依赖 `sudo apt install gcc g++ cmake`

进行编译 `make`

可以直接使用 `${你的 minieap 目录路径}/minieap -h` 来查看文档，说明基本命令

```bash
$ ${你的 minieap 目录路径}/minieap -u ${你的用户名} -p ${你的密码} -n ${你的网卡名} -b 1
# -b 1 是在后台运行的意思
```

就可以使用基本的认证功能了

## 设置开机自启动

打开程序坞中的 `Startup Applications`，添加一条任务，名称是 minieap，命令是
`${你的 minieap 目录路径}/minieap -u ${你的用户名} -p ${你的密码} -n ${你的网卡名} -b 1`
即可完成设置

## 参考

minieap 的 [GitHub 链接](https://github.com/updateing/minieap)