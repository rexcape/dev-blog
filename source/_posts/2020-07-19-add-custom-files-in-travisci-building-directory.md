---
title: Travis CI 的构建目录中添加文件
date: 2020-07-19 20:42:54
tags:
  - Travis CI
categories:
  - 踩坑
---

在 Travis CI 的构建目录中添加文件的方法

<!--more-->

## 背景

`GitHub Pages` 中，要自定义域名需要添加一个 `CNAME` 文件，内容是你的域名，但是 `Travis CI` 自动构建每次都是把所有文件删除再更新库，每次我都要手动添加 `CNAME` 文件？所以开始寻找构建目录添加自己的文件的方法

## 环境变量

`Travis CI` 的构建环境里面有一个环境变量 `$TRAVIS_BUILD_DIR`，这个环境变量就是构建的文件夹，首先我用 `ls` 命令查看了该文件夹下的内容，发现是博客 `GitHub` 仓库的 `source` 分支的文件

得出结论：CI 系统把构建目录下的 `public` 目录部署到 `GitHub Pages` 的主分支

## 解决方案

在 `.travis.yml` 文件的 `script` 项下添加命令即可，本例是 `Hexo` 的博客，要在生成目录也就是 `public` 文件夹下添加`CNAME` 文件，将 `script` 项改为如下所示即可达到目的

```yaml
script:
  - hexo generate
  - echo 'blog.mazixiang.me' >> $TRAVIS_BUILD_DIR/public/CNAME
```

## 参考

[emmby - travis-ci - Travis yml，我如何得到 Travis 的工作目录？](https://kb.kutu66.com/travis-ci/post_1642424)
