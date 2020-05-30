---
title: 在 CentOS7 上安装 MySQL Community Server
date: 2020-05-29 10:00:04
tags:
  - MySQL
  - Linux
---

对[tianranll - CentOS安装MySQL详解](https://juejin.im/post/5d07cf13f265da1bd522cfb6#heading-24)的一些补充
<!--more-->

## 步骤

[tianranll - CentOS安装MySQL详解](https://juejin.im/post/5d07cf13f265da1bd522cfb6#heading-24)

这个人已经讲的很详细了，我就是补充一下，讲解一下踩到的坑，另外，我是用虚拟机的方式来测试环境的，下面的一切操作都是基于 CentOS 虚拟机的情况下中执行的，容错率比较高。

## MySQL Yum Repo 安装链接

这个链接是在 [MySQL Community Downloads - MySQL Yum Repository](https://dev.mysql.com/downloads/repo/yum/) 下找到的，根据 Linux 版本来选取，比如说我安装的是 CentOS7 就选择 RedHat Enterprise Linux 7

![选择 RedHat Enterprise Linux 7](https://cdn.jsdelivr.net/gh/mazixiang/assets@master/picgo/20200528085819.png)

点击之后出来的这个页面，复制下面的 `no thanks` 链接地址

![复制链接地址](https://cdn.jsdelivr.net/gh/mazixiang/assets@master/picgo/20200528090827.png)

你的 `wget` 命令后面应该接的是这个复制的地址（如果你想安装最新的版本）

## 远程连接问题

对应文章的 6. 允许 root 远程访问

**从 MySQL 8.0 以后，不可以再直接使用 `GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;` 来给权限了，可以用下面的命令来代替**

```sql
-- 1. 使用alter user
> alter user set user.host='%' where user.user='root';
-- 2. 使用create user
> create user 'userName'@'%' identified by 'your_password';
```

我失败了之后查了好长一段时间，最后在[mysql8 grant授权报错：ERROR 1410 (42000): You are not allowed to create a user with GRANT](https://www.jianshu.com/p/98a6d42e28c8)找到了解决方案，但是原作者好像忘了写那个 `identified` 后面的 `by` 了……

## 开启 CentOS7 的防火墙 3306 端口

不开启端口，是无法使用远程连接的，参考[CentOS 7 开放防火墙端口命令](https://blog.csdn.net/achang21/article/details/52538049)，在终端执行

```bash
$ firewall-cmd --zone=public --add-port=3306/tcp --permanent
success
$ firewall-cmd --reload
success
```

## 参考

[tianranll - CentOS安装MySQL详解](https://juejin.im/post/5d07cf13f265da1bd522cfb6#heading-24)

[mysql8 grant授权报错：ERROR 1410 (42000): You are not allowed to create a user with GRANT](https://www.jianshu.com/p/98a6d42e28c8)
