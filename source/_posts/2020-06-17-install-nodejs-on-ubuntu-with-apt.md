---
title: Ubuntu 通过 apt 安装 nodejs
date: 2020-06-17 13:49:21
tags:
  - Linux
  - Nodejs
categories:
  - 实用
---

Ubuntu 通过 apt 安装 nodejs 的方法

<!--more-->

## 更新

由于 Nodejs 更新速度较快，不建议使用此种方式，建议使用 [nvm](https://github.com/nvm-sh/nvm) 或者 [nodenv](https://github.com/nodenv/nodenv)

官方文档不建议使用管理员权限进行安装，[Resolving EACCES permissions errors when installing packages globally](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

## 方法

### 14.x

```bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 12.x

```bash
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 10.x

```bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```
