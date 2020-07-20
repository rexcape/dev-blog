---
title: 美化 PowerShell
date: 2020-07-20 11:36:06
tags:
- PowerShell
- 美化
categories:
- 实用
---

最近重装了一遍系统，记录一下每次重装系统反复配置的软件，本文记录如何用 oh-my-posh 美化 PowerShell
<!--more-->

## 开放许可

首次在计算机上启动 `Windows PowerShell` 时，现用执行策略很可能是 Restricted（默认设置），这个策略是禁止运行任何脚本的，要想打开，只需在**有管理员权限的** `PowerShell` 下输入 `set-executionpolicy remotesigned`即可。

## 安装 oh-my-posh

根据 [oh-my-posh 的说明](https://github.com/JanDeDobbeleer/oh-my-posh#installation)，执行以下命令：

```powershell
> Install-Module posh-git -Scope CurrentUser
> Install-Module oh-my-posh -Scope CurrentUser
```

如果有选项全通过就可以了

## 配置 oh-my-posh

在 powershell 中输入 `notepad $PROFILE`，用记事本打开配置文件，将如下文本添加到其中即可成功配置。

```powershellImport-Module posh-git
Import-Module oh-my-posh
Set-Theme Paradox
```

## 安装 PowerLine 字体

此时通过 Windows Terminal 等软件打开会出现无法显示字符的情况，需要从 [microsoft/cascadia-code](https://github.com/microsoft/cascadia-code/releases) 或者其他途径安装 `PowerLine` 字体，最后将终端软件（如 `Windows Terminal` 的字体配置改为你下载的那个字体。

```json
"defaults":
{
    // Put settings here that you want to apply to all profiles.
    "colorScheme": "Dracula",
    "startingDirectory": ".",
    "fontFace": "Cascadia Mono PL"
},
```

这里推荐一个字体网站 [Nerd Fonts](https://www.nerdfonts.com/)，有很多 `PowerLine` 字体。

## 参考

[PowerShell因为在此系统中禁止执行脚本解决方法 - Asharp - 博客园](https://www.cnblogs.com/zhaozhan/archive/2012/06/01/2529384.html)

[JanDeDobbeleer/oh-my-posh](https://github.com/JanDeDobbeleer/oh-my-posh)

[Microsoft - 教程：在 Windows 终端中设置 Powerline](https://docs.microsoft.com/zh-cn/windows/terminal/tutorials/powerline-setup)
