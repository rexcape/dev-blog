---
title: ns3 网络模拟软件的安装和起步
date: 2020-06-24 19:23:29
tags:
  - 计算机网络
  - ns3 网络模拟软件
categories:
  - 踩坑
---

ns3 网络模拟软件的安装和使用

<!--more-->

## 运行环境

运行 `ns3` 需要安装 `Linux` 虚拟机或者是 `WSL`，Windows 无法直接跑，本文中使用 `VMWare Workstation 15.5` 的 `Ubuntu 20.04LTS` 为环境，其他 `Linux` 发行版本大同小异，请前往参考中的官网文档

建议用 `WSL` 跑，虚拟机会消耗一些性能

## 准备

首先，进入[ns 的 release 网页（官方）](https://www.nsnam.org/releases/)

![website](https://s1.ax1x.com/2020/06/24/Nwenq1.png)

下载最新版本的 tar 包，传入虚拟机中，使用 `tar -xvf` 命令解压文件，得到文件夹，我的是 `ns-allinone-3.30.1`

## 使用 apt 安装依赖

首先使用以下命令安装依赖

```bash
$ sudo apt install g++ python3
...
g++ is already the newest version (4:9.3.0-1ubuntu2).
python3 is already the newest version (3.8.2-0ubuntu2).
0 upgraded, 0 newly installed, 0 to remove and 9 not upgraded.
```

`Ununtu 20.04LTS` 版本中已经安装好了 `g++` 和 `Python3`

## 开始构建

确保工作目录是在 `ns-allinone-3.30.1` 下，在命令行中执行如下命令开始构建，时间可能会很长，请耐心等待。

```bash
$ ./build.py --enable-tests --enable-examples
...
Leaving directory `./ns-3.30.1'
```

得到以下输出，说明构建成功

![构建成功](https://s1.ax1x.com/2020/06/24/Nwmb9S.jpg)

如果失败，请删除文件夹重新再来一遍（我就是这么做的，重来了几遍，最后可以正常运行了）

## 进一步构建

据官方文档所说，上一步是构建好运行时需要的库，这一步是进行真实构建。

切换工作目录到文件夹中的 `ns-*` 目录（我的是 `ns-3.30.1`），在命令行中执行如下命令，向 Waf 解释它应该进行包括示例和测试的优化构建

```bash
$ ./waf clean
'clean' finished successfully (0.398s)
$ ./waf configure --build-profile=optimized --enable-examples --enable-tests
...
'configure' finished successfully (2.899s)
```

切换回包含示例和测试的调试（debug）版本。

```bash
$ ./waf clean
$ ./waf configure --build-profile=debug --enable-examples --enable-tests
...
'configure' finished successfully (2.618s)
```

开始构建

```bash
$ ./waf
...
'build' finished successfully (20m15.146s)
...
```

如果出现了下图的结果，说明构建成功

![进一步构建成功](https://s1.ax1x.com/2020/06/24/NwuTSS.jpg)

## 测试 ns3（可跳过）

命令行中执行 `./test.py` 来运行测试脚本，出现一大堆 `PASS` 说明测试成功（图就不放了，太大了）

这个时间很长，如果没耐心可以跳过，基本上来说前几步正常进行的话都没问题

## 运行一个脚本

命令行中执行如下命令

```bash
$ ./waf --run hello-simulator
Build commands will be stored in build/compile_commands.json
'build' finished successfully (0.844s)
Hello Simulator
```

出现和上面相同的结果说明运行成功，成功入门

## 相关文章

[NS3 网络仿真（2）：first.py - jhcelue - 博客园](https://www.cnblogs.com/jhcelue/p/6905943.html)

这个是系列教程，作者很牛逼

[NS3 网络仿真\_deep_keng 的博客-CSDN 博客\_ns3 使用 netanim 仿真 wifi 节点](https://blog.csdn.net/deep_kang/article/details/73350350)

[用 NS3 进行虚拟仿真 - 简书](https://www.jianshu.com/p/fe77a15a1eb4)

## 参考

[ns3 官方安装指南（英）](https://www.nsnam.org/wiki/Installation)

[ns3 官方构建文档（英）](https://www.nsnam.org/docs/release/3.30/tutorial/html/getting-started.html)
