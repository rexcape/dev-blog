---
title: 进入 Docker 容器的方法
date: 2021-02-19 19:37:15
tags:
  - Docker
categories:
  - 实用
---

简单介绍进入 Docker 容器的方法

<!--more-->

在创建容器时，使用 `-d` 参数，容器会在后台启动。如果想和容器进行交互，就要进入容器。

进入容器有 `docker attach` 和 `docker exec` 两种方式，更推荐后者

## attach

假设某一容器名为 `container`，可以通过如下方式

```bash
$ docker attach container
root@<container-id>:/#
```

{% note warning %}
**注意**

如果从这个 stdin 中退出（比如执行 exit 命令），会使容器停止运行
{% endnote %}

## exec

假设某一容器名为 `container`，可以通过如下方式

```bash
$ docker exec -it container
root@<container-id>:/#
```

`-i` 参数表示我们与这个容器进行交互，由于没有分配伪终端，界面没有提示符，但是命令执行结果仍然可以返回

`-t` 是为我们分配了一个伪终端

`-i` `-t` 一起使用时，就可以看到命令提示符了

## 参考

[进入容器 - Docker —— 从入门到实践](https://yeasy.gitbook.io/docker_practice/container/attach_exec)
