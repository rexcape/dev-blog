---
title: Ubuntu 设置锐捷客户端为自启动
date: 2020-10-19 20:07:31
tags:
  - Linux
  - systemd
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
- 系统的大多数编程环境（如 Python）无法一键

实在用不下去，添加了 Ubuntu 系统，和 Windows 10 组了一个双系统，总体来说兼容性
很好，没有发生致命错误，小错误倒是一堆，而且还有很多必须要用但是不兼容的软件，
例如本文章的锐捷客户端，所以来记录一下如何配置锐捷客户端并且设置为自启动

## 环境

硬件环境：DELL G3 3579

操作系统：Ubuntu 20.04LTS

## 更新

刚看到帮助文档的我竟然没看到最后一行……所以理论上可以加上 `--comment` 参数作为
守护进程来运行，所以理论上可以直接打开程序坞 Startup Applications 进行设置

## 基本操作

首先，下载锐捷认证客户端，我学校使用的客户端是一个 .sh 文件，放到 /opt 下，
使用 `/opt/rjsupplicant/rjsupplicant.sh --help` 查看帮助文档（帮助文档太
长就不放了）

最基本的命令如下

```shell
$ sudo /opt/rjsupplicant/rjsupplicant.sh -a 1 -d 1 -u ${你的用户名} -p ${你的密码}
# -a 1 有线认证
# -d 1 使用 DHCP 服务器得到 IP 地址
```

但是这样每次都要手动认证，很不方便，所以想找到一个方法让他自启动

## Systemd

systemd 是一个 Linux 系统基础组件的集合，提供了一个系统和服务管理器，运行为 PID 1
并负责启动其它程序

使用一个 systemd 单元来使用自启动，在 `/lib/systemd/system` 目录下来新建一个 `systemd`
单元，这里命名为 `ruijie.service`，设置为如下内容

```Plain text
[Unit]
Description=Ruijie authentication service
After=networkd-dispatcher.service

[Service]
Type=simple
ExecStart=/opt/rjsupplicant/rjsupplicant.sh -a 1 -d 1 -u ${你的用户名} -p ${你的密码}
ExecStop=sudo /opt/rjsupplicant/rjsupplicant.sh -q

[Install]
WantedBy=multi-user.target
```

`Unit` 部分

`Description` 的值是该服务的描述，随便写

`After` 是该服务在某服务运行之后运行，这里写 networkd-dispatcher.service 是
`Ubuntu` 下的网络派遣服务，**如果在配置网卡之前启动服务的话，是无法自启动的！**

`Service` 部分

`Type` 是服务的类型，选 `simple` 即可

`ExecStart` 是执行 `systemctl start ruijie.service` 时运行的脚本

`ExecStop` 是执行 `systemctl stop ruijie.service` 时运行的脚本

`Install` 部分

`WantedBy` 是该服务所在的 `target`，默认的启动 `Target` 是 `multi-user.target`。
在这个组里的所有服务，都将开机启动。这就是为什么 `systemctl enable` 命令能设置
开机启动的原因

最后，运行如下命令，设置开机自启动：

```shell
$ systemctl enable ruijie.service
# 设置开机自启动
```

## 参考

### systemd 更多细节

[systemd (简体中文) - ArchWiki](<https://wiki.archlinux.org/index.php/systemd_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)#%E7%BC%96%E5%86%99%E5%8D%95%E5%85%83%E6%96%87%E4%BB%B6>)

[17.1 什么是 daemon 与服务 （service） | 鸟哥的 Linux 私房菜：基础学习篇 第四版](https://wizardforcel.gitbooks.io/vbird-linux-basic-4e/content/148.html)

[Systemd 入门教程：实战篇 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-part-two.html)

[可能是史上最全面易懂的 Systemd 服务管理教程！( 强烈建议收藏 ) - 云+社区 - 腾讯云](https://cloud.tencent.com/developer/article/1516125)
