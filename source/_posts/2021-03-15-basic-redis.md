---
title: 基础 Redis
date: 2021-03-15 20:13:14
tags:
  - redis
categories:
  - 实用
---

介绍基础的 redis

<!--more-->

## 安装

我使用 Docker 来进行安装

```shell
$ docker run -d -p 6379:6379 --name redis-docker redis
...
Status: Downloaded newer image for redis:latest
```

## 默认端口由来

Redis 是一个开源的使用 ANSI C 语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value 数据库，并提供多种语言的 API。redis 的默认端口号是 6379。

为什么 Redis 选择 6379 作为默认端口号？

6379 在是手机按键上 MERZ 对应的号码，而 MERZ 取自意大利歌女 Alessia Merz 的名字。

Alessia Merz 是一位意大利舞女、女演员。 Redis 作者 Antirez 早年看电视节目，觉得 Merz 在节目中的一些话愚蠢可笑，Antirez 喜欢造“梗”用于平时和朋友们交流，于是造了一个词 "MERZ"，形容愚蠢，与 "stupid" 含义相同。

后来 Antirez 重新定义了 "MERZ" ，形容”具有很高的技术价值，包含技艺、耐心和劳动，但仍然保持简单本质“。

到了给 Redis 选择一个数字作为默认端口号时，Antirez 没有多想，把 "MERZ" 在手机键盘上对应的数字 6379 拿来用了。

## 基础命令

### 连接

使用 `docker exec -it ID /bin/sh` 进入容器，使用 redis 命令进入命令行：

```bash
# redis-cli
127.0.0.1:6379>
```

### del

del 命令用于删除现有的 key

## Redis 数据类型

### String（字符串）

string 类型是 redis 最基本的类型，一个 key 对应一个 value

一个键最大能存储 512 MB

用法：

```plain text
127.0.0.1:6379> set hello world
OK
127.0.0.1:6379> get hello
"world"
```

### Hash（哈希）

hash 是一个键值对集合

每个 hash 可以存储 $2^{32}-1$ 个键值对

用法：

```plain text
127.0.0.1:6379> hmset hello field1 value1 field2 value2
OK
127.0.0.1:6379> hget hello field1
"value1"
```

### List（列表）

Redis 列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部或尾部

列表最多存储 $2^{32}-1$ 个元素

用法：

```plain text
127.0.0.1:6379> lpush hello redis
(integer) 1
127.0.0.1:6379> lpush hello mongodb
(integer) 2
127.0.0.1:6379> lrange hello 0 10
1) "redis"
2) "mongodb"
```

### Set（集合）

set 是 string 类型的无序集合

集合是通过哈希表实现的，所以添加、删除、查找的复杂度都是 $O(1)$

集合中最大成员数为 $2^{32}-1$

用法：

```plain text
127.0.0.1:6379> sadd hello redis
(integer) 1
127.0.0.1:6379> sadd hello mongodb
(integer) 1
127.0.0.1:6379> sadd hello mongodb
(integer) 0
127.0.0.1:6379> smembers hello
1) "redis"
2) "mongodb"
```

注：上面用法中 mongodb 添加了两次，但根据集合内元素的唯一性，第二次插入的元素将被忽略

### zset（有序集合）

zset 和 set 一样也是 string 类型元素的集合，不允许重复的成员

不同的是在 zset 中，每个元素都会关联一个 double 类型的分数。redis 通过分数来为集合中的成员进行从小到大的排序

zset 的成员是唯一的，但分数（score）可重复

用法：

```plain text
127.0.0.1:6379> zadd hello redis
(integer) 1
127.0.0.1:6379> zadd hello mongodb
(integer) 1
127.0.0.1:6379> zadd hello mongodb
(integer) 0
127.0.0.1:6379> ZRANGESCORE runoob 0 1000
1) "redis"
2) "mongodb"
```

## 参考

- [redis默认端口是什么-Redis-PHP中文网](https://m.php.cn/redis/453699.html)
- [Redis 数据类型 | 菜鸟教程](https://www.runoob.com/redis/redis-data-types.html)
