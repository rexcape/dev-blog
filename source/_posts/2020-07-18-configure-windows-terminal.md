---
title: 配置 Windows Terminal
date: 2020-07-18 17:57:06
tags:
- Windows Terminal
- 美化
categories:
- 实用
---

最近重装了一遍系统，记录一下每次重装系统反复配置的软件，本文记录如何配置与美化 Windows Terminal
<!--more-->

## 打开 Windows Terminal 配置文件

在 `Windows Terminal` 窗口下按 `Ctrl + ,` （或者点击新建标签页旁边的向下箭头-设置）来用编辑器打开配置文件，我的电脑中是用 `VS Code` 打开的

## Dracula 主题

去 [Dracula 主题网站的 Windows Terminal 页面](https://draculatheme.com/windows-terminal)，将主题的配置复制到 `schemes` 项下面

```json
"schemes": [
    {
        "name" : "Dracula",
        "background" : "#272935",
        "black" : "#21222C",
        "blue" : "#BD93F9",
        "cyan" : "#8BE9FD",
        "foreground" : "#F8F8F2",
        "green" : "#50FA7B",
        "purple" : "#FF79C6",
        "red" : "#FF5555",
        "white" : "#F8F8F2",
        "yellow" : "#FFB86C",
        "brightBlack" : "#6272A4",
        "brightBlue" : "#D6ACFF",
        "brightCyan" : "#A4FFFF",
        "brightGreen" : "#69FF94",
        "brightPurple" : "#FF92DF",
        "brightRed" : "#FF6E6E",
        "brightWhite" : "#F8F8F2",
        "brightYellow" : "#FFFFA5"
    }
]
```

之后在 `Profiles` 中的 `defaults` 下配置默认主题

```json
"defaults":
{
    "colorScheme": "Dracula"
}
```

## 添加到右键菜单

### 自动添加注册表

新建 `wt.reg` 文件，用记事本打开，将如下代码拷贝到其中

```reg
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\Background\shell\wt]
@="Windows Terminal Here"
"Extended"=""

[HKEY_CLASSES_ROOT\Directory\Background\shell\wt\command]
@="C:\\Users\\你的用户名\\AppData\\Local\\Microsoft\\WindowsApps\\wt.exe"
```

### 手动添加注册表

按下 `Win + R` 打开运行，输入 `regedit` 打开注册表编辑器，找到 `HKEY_CLASSES_ROOT\Directory\Background\shell`，新建一项（名字随便起，这里叫做 wt）

![新建 wt 项](https://s1.ax1x.com/2020/07/19/UW3rz4.png)

wt 项的默认值的数据就是右键菜单的文本内容，我将其配置为“通过 Terminal 打开”

再新建一个字符串值，名称为 `Icon`，数据是 Windows Terminal 图标的绝对路径（可以通过网上下载到 `Windows Terminal` 的图标

我的 wt 项配置如下

![wt 项配置](https://s1.ax1x.com/2020/07/19/UW82cQ.png)

{% note primary %}
如果想添加快捷键，新建的项默认值是 `通过 Terminal 打开 (&T)`，其中， `&` 后面是你想添加的快捷键
{% endnote %}

再在 wt 项下建立 command 项，默认值的数据是到达你的 `wt.exe` 的绝对路径，一般来说是 `C:\Users\[你的用户名]\AppData\Local\Microsoft\WindowsApps\wt.exe`

## 更改启动路径

经过以上操作，完成了右键菜单的添加，这部分介绍如何更改默认的启动路径

在配置文件 `settings.json` 中，`Profiles` 下面的 `defaults` 下配置默认启动路径，让每次的启动路径都是右键点击的路径

```json
"defaults":
{
    "colorScheme": "Dracula",
    "startingDirectory": "."
}
```

这样 `Windows Terminal` 的美化和配置就完成了

## 了解更多

更多配置信息可以通过 [Microsoft - Windows 终端](https://docs.microsoft.com/zh-cn/windows/terminal/) 去了解

## 参考

[Dracula 主题网站](draculatheme.com)

自动添加注册表

[Garwih - 将 Windows Terminal 添加到右键菜单](https://gist.github.com/Garwih/b4ec0d853e0f3093874e919ace7fce2f)

手动添加注册表

[Huelse - 将Windows Terminal添加到右键菜单](https://blog.csdn.net/u011532601/article/details/106305373)
