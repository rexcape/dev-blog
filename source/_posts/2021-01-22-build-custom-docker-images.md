---
title: 构建 Docker 镜像
date: 2021-01-22 11:24:47
tags:
  - Docker
categories:
  - 实用
---

构建 Docker 镜像的方法

<!--more-->

构建 Docker 镜像可以让别人也可以构建出相同的环境

## commit

### 查看更改

在终端中输入 `docker diff CONTAINER` 来查看容器的变动，其中 A 是新增的文件，C 是修改的文件，D 是删除的文件

### 提交更改

在终端中输入 `docker commit CONTAINER username/image-name:tag` 来提交更改，username 是自己定义的用户名，image-name 是镜像名称，`tag` 是标签（版本号），可以是数字、字符串等

示例：`docker commit foobar mazixiang/foobar:0.1.0`

之后就可以在本地看到提交的 Docker 镜像了

## Dockerfile

在项目文件夹下新建 Dockerfile 文件，然后添加字段

- `FROM` 表示构建镜像的基础
- `RUN` 构建镜像时执行的命令
- `WORKDIR` 定义工作目录
- `COPY` 将本机文件拷贝到容器中
- `CMD` 指定容器运行时要执行什么命令，只能有一个

在项目文件夹下执行 `docker build -t username/image-name:tag .` 来构建容器

例

```Dockerfile
FROM ubuntu
RUN sudo apt update && sudo apt upgrade && sudo apt install nodejs -y
WORKDIR /app
COPY . .
CMD ["node", "test.js"]
```

## 参考

[Dockerfile 参考文档](https://docs.docker.com/engine/reference/builder/)

[BiliBili 自建 Docker 镜像 - CodingStartip](https://www.bilibili.com/video/BV1v5411G7xc)
