---
title: 基础 Docker 命令
date: 2021-01-21 10:57:55
tags:
  - Docker
categories:
  - 实用
---

介绍一些基础的 Docker 命令

<!--more-->

## `docker ps`

`ps` 命令用于查看正在运行的镜像的状态

`ps -a` 命令可以查看所有容器

## `docker run`

run 命令用于建立并运行一个容器，常用参数有

- `-i`：与这个容器互动
- `-t`：创建一个终端
- `--name 容器名称`：容器的名称
- `-p 本机端口:虚拟机端口`：容器的端口映射
- `-d`：启动为 detached 模式，不进入容器中
- `-v 本机路径:虚拟机路径`：将电脑中的文件映射到容器中，允许容器获取指定位置的文件

例 `docker run -it --name ubuntu -p 8080:80 -v $(pwd):/app ubuntu:lts`

## 容器匹配

下面几个命令中的 CONTAINER 可以是：

- 容器名称
- 容器 ID
- 容器 ID 的前几位，Docker 会进行模糊匹配

## `docker start CONTAINER`

`start` 命令用于启动一个已经停止的容器

## `docker stop CONTAINER`

`stop` 命令用于停止一个正在运行的容器

## `docker attach CONTAINER`

`attach` 命令用于进入到一个正在运行的容器中

## `docker rm CONTAINER`

`rm` 命令用于移除一个容器

## `docker image ls`

`image ls` 命令可以查看所有本地镜像

## `docker rmi`

`rmi` 命令可以删除指定的本地镜像，释放空间

## 参考资料

[BiliBili 初探 Docker - CodingStartup](https://www.bilibili.com/video/BV1vD4y1X7ce)
