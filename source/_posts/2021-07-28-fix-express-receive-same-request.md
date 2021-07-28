---
title: 解决 Express 收到两次请求的方法
date: 2021-07-28 09:41:09
tags:
  - JavaScript
  - Express
categories:
  - 踩坑
---

介绍如何解决 Express 收到两次请求

<!--more-->

## 问题来源

本来做一个服务器来接收 WebHook 请求，但是，一测试 WebHook 就会有两次请求进来，导致要执行的代码被重复执行两次，原代码如下：

```javascript
const express = require("express");
const app = express();
app.use(express.json);

// Handle Functions...

app.listen(1919);
```

后来，打印出请求 IP 发现，会有两个值：`::ffff:127.0.0.1` 和 `::1`，经过搜索发现，这两个都是本机地址的 IPv6 标记，而如果监听 IPv6 地址，`net.Server` 也可能会监听 IPv4 地址导致收到两次重复请求。

## 解决方案

上网找到如下解决方案：

```javascript
const express = require("express");
const app = express();
app.use(express.json);

// Handle Functions...

app.listen(1919, "0.0.0.0");
```

这样就可以只监听 IPv4 地址

## 参考资料

- [Node.js express 如何监听 IPv4 地址 - CodePlayer | 代码玩家](https://codeplayer.vip/question/j7t0v/answer/j7t11)
- [IPv6: Are There Actual Differences Between Local Addresses ::1 and ::ffff:127.0.0.1? - Server Fault](https://serverfault.com/questions/840198/ipv6-are-there-actual-differences-between-local-addresses-1-and-ffff127-0)
- [express - What's different in ::1 and ::ffff:127.0.0.1 - Stack Overflow](https://stackoverflow.com/questions/59355190/whats-different-in-1-and-ffff127-0-0-1)
