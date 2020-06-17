---
title: Ubuntu 通过 apt 安装 nodejs
date: 2020-06-17 13:49:21
tags:
  - Linux
  - Nodejs
---

Ubuntu 通过 apt 安装 nodejs 的方法
<!--more-->
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

## 参考

[Installing Node.js via package manager | Node.js](https://nodejs.org/en/download/package-manager/)

[distributions/README.md at master · nodesource/distributions](https://github.com/nodesource/distributions/blob/master/README.md)
