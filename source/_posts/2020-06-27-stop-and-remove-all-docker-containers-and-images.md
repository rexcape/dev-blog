---
title: 停止和删除 docker 所有的容器和镜像
date: 2020-06-27 21:04:40
tags:
  - Docker
---

停止和删除 docker 所有的容器和镜像的简单方法，一句命令

##　停止所有 Docker 容器

```bash
$ docker stop $(docker ps -aq)
# 你的所有 Docker 容器的 ID
```

其中 `docker ps -aq` 的作用是列出所有 `Docker` 容器的 ID

##　删除所有 Docker 容器

```bash
$ docker rm $(docker ps -aq)
# 你的所有 Docker 容器的 ID
```

## 删除所有 Docker 镜像

```bash
$ docker rmi $(docker images -aq)
# 你的所有 Docker 镜像的 ID
```

其中 `docker images -aq` 的作用是列出所有 `Docker` 镜像的 ID

## 参考

[停止、删除所有的docker容器和镜像 | 鸟窝](https://colobu.com/2018/05/15/Stop-and-remove-all-docker-containers-and-images/)
