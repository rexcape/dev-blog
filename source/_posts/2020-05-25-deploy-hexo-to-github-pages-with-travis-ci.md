---
title: 通过 Travis CI 将 Hexo 博客部署到 GitHub Pages
date: 2020-05-25 22:30:00
tags:
---

纯萌新遇到的一些坑
<!--more-->

## 流程

使用 Hexo 搭建完博客之后，翻了一下官网，结果发现还可以用 `Travis CI` 来做自动生成部署啊！正好今天整了一天的 `Travis CI`，也差不多熟悉了，就直接按照官方文档去照着做了

## Travis CI 介绍

Travis CI是一个持续集成工具，因为我只使用了一天，还不太了解。详细原理可以去搜一下，这里就简单讲一下：就是你提交了一次 `commit` 后，这个工具按照你的 repo 里的 `.travis.yml` 来自动执行一些操作，如果构建通过了显示 `passing`，不通过显示 `failing`。

## 问题

[Hexo 官方的使用 Travis CI 教程](https://hexo.io/zh-cn/docs/github-pages)有点小坑啊，现在的 `GitHub Pages` 的部署分支必须是 `master` 分支了，但是官网的教程是部署到 `gh-pages` 分支上的，官网说可以切换 `GitHub Pages` 部署分支到 `gh-pages` 分支上，**完全没说别的**，作为刚使用一天的选手，我就是想把生成的分支改为 `master`，但是我在官方给的配置文件中根本没找到 `gh-pages`！，这里附带官网的配置文件（其中还要添加 `GH_TOKEN` 环境变量，这里就不展开说了）：

```yaml
sudo: false
language: node_js
node_js:
  - 10 # 使用 nodejs 的长期支持版本
cache: npm
branches:
  only:
    - master # 仅仅构建 master 分支
script:
  - hexo generate # 生成静态文件
deploy:
  provider: pages
  skip-cleanup: true
  github-token: $GH_TOKEN
  keep-history: true
  on:
    branch: master
  local-dir: public
```

## 解决方法

我去网上找来找去，找到了几个类似的解决办法：

- [通过 Travis CI 自动部署 Hexo 到 Github](https://garryshield.github.io/2019/04/08/travis-ci/) - 这个实现方法，和官方的实现方法不太一样，我一般比较喜欢官方的实现方法，要是实在找不到解决办法才会用
- [使用 Travis CI 自动更新 GitHub Pages](https://notes.iissnan.com/2016/publishing-github-pages-with-travis-ci/) - 这个说的也和官方的不太一样

找来找去，结果在 [官方 pages 部署的文档](https://docs.travis-ci.com/user/deployment/pages/) 里面找到了，原来这个部署的默认分支就是 `gh-pages`！可以通过进一步配置 `target_branch` 来修改！所以我把所有的源代码移到了 `source` 分支上，然后将配置文件改成了下面这样，就可以正常访问了。

```yaml
sudo: false
language: node_js
node_js:
  - 10 # 使用 nodejs 的长期支持版本
cache: npm
branches:
  only:
    - source # 仅仅构建 source 分支
script:
  - hexo generate # 生成静态文件
deploy:
  provider: pages
  skip-cleanup: true
  github-token: $GH_TOKEN
  keep-history: true
  on:
    branch: source
  local-dir: public
  target_branch: master
```

## 心得

再也不折腾了，真的费劲！
