---
title: 解决 Windows 上 git log 乱码
date: 2020-05-27 11:35:18
tags: git
---

解决大多数的 Windows 上 git log 乱码问题，注意是大多数问题
<!--more-->
## Linux 系统

Linux系统上的环境变量需要使用 `export LANG=zh_CN.UTF-8` 来指定

永久写入需要把 `export` 语句直接写入 `.bashrc` 或者 `.zshrc` 中

## 检查环境变量

打开 cmd 或者 powershell，输入

```powershell
> echo %LANG%
```

查看 `LANG` 变量，如果输出 `zh_CN.UTF-8` 则继续进行，如果输出别的，新建一个环境变量 `LANG`，值设为 `zh_CN.UTF-8`，重启 cmd

## 修改 git config

在 cmd 或者 powershell 中，输入

```powershell
> git config --global i18n.commitencoding utf-8
> git config --global i18n.logoutputencoding utf-8
```

并新建一条环境变量 `LESSCHARSET`，值设为 `utf-8`

## 暂时设置环境变量

在 cmd 或者 powershell 中输入 `set LANG=zh_CN.UTF-8`，可以暂时起作用，但重新启动后就没用了

## 参考

[git log中文乱码 - 简书](https://www.jianshu.com/p/fb47a39f3578)

[git log 乱码解决方法_git_qianggezhishen的专栏-CSDN博客](https://blog.csdn.net/qianggezhishen/article/details/80865143)

[git log 中文乱码的解决方案 - 张发财 - 博客园](https://www.cnblogs.com/zhangxiaoliu/p/9226197.html)
