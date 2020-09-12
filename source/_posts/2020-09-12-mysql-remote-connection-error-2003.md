---
title: MySQL Server 8 的远程连接错误 ERROR 2003 解决办法
date: 2020-09-12 22:02:26
tags:
  - MySQL
categories:
  - 踩坑
---

简单介绍 MySQL Server 8 的远程连接错误 ERROR 2003 解决办法

<!--more-->

## 起因

购买了一台阿里云服务器，但是我的域名没法备案，无法用来存放网页，所以想将其作为数据库服务器，在服务器上运行了 MySQL Server 8.0 数据库软件，之后发现无法通过 DataGrip 软件连接，开始排查原因。

## 服务器环境

服务器是阿里云的最低配服务器，安装的是 Ubuntu20.04 - LTS 系统，有基础的开发环境

## 数据库用户问题

远程连接数据库并且通过 MySQL Shell 创建并授权一个用户

```SQL
create user 'tone'@'%' identified by '123123';

grant all privileges on *.* to 'tone'@'%' with grant option;
```

之后打开本地电脑上面的软件，发现 DataGrip 报错，输出

```Plain Text

[08S01] Communications link failure

The last packet sent successfully to the server was 0 milliseconds ago. The driver has not received any packets from the server.
java.net.ConnectException: Connection refused: connect.
```

怀疑是密码的问题，于是查看了一下，默认的密码格式为 `caching_sha2_password`，但 `root` 用户的密码格式为 `mysql_native_password`，所以进行了操作修改了密码格式

```SQL
ALTER USER 'zhangsan'@'%' IDENTIFIED WITH mysql_native_password BY 'zhangsan111';
```

发现仍然无法连接

## 防火墙端口问题

查阅网上对 `jdbc` 的 `java.net.ConnectException: Connection refused: connect.` 的说明，可能是端口问题，于是开始排查服务器的防火墙。

首先，打开阿里云控制台的安全组，将 MySQL 运行的端口（默认为 3306）对所有 IP 地址开放，还是无法连接，然后在 Linux 上安装 nmap 软件查看开放的端口

```bash
$ sudo apt install nmap
...
$ nmap localhost
Starting Nmap 7.80 ( https://nmap.org ) at 2020-09-12 22:22 CST
Nmap scan report for localhost (127.0.0.1)
Host is up (0.0000030s latency).
Other addresses for localhost (not scanned): ::1
Not shown: 997 closed ports
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
3306/tcp open  mysql

Nmap done: 1 IP address (1 host up) scanned in 0.05 seconds
```

发现所有端口均开放正常，也没有防火墙之类的问题，于是继续排查问题

## 服务器端配置

为了更加精确地排查错误，我使用了 Ubuntu - WSL 安装了 MySQL-Client-8.0

```bash
$ sudo apt install mysql-client-8.0
...
```

使用本地的 MySQL 客户端连接服务器后，才精准地定位到了错误：

```Plain Text
Enter password:
ERROR 2003 (HY000): Can't connect to MySQL server on '47.101.58.125' (111)
```

于是开始上网查找 ERROR 2003 的解决方法，发现了提示：ERROR 2003 有可能和服务器端的配置有关系，马上找到 `/etc/mysql/my.cnf`

```Plain Text
!includedir /etc/mysql/conf.d/
!includedir /etc/mysql/mysql.conf.d/
```

发现有两个目录：

```Plain Text
/etc/mysql/conf.d
├── mysql.cnf
└── mysqldump.cnf

/etc/mysql/mysql.conf.d
├── mysql.cnf
└── mysqld.cnf
```

分别查看这四个文件，发现只有 `/etc/mysql/mysql.conf.d/mysqld.cnf` 有一些内容，其中，网上的资料说可能与 `bind-address=127.0.0.1` 有关系，而这个文件正好有一行，所以尝试修改为我的服务器的 IP 地址，发现不行。于是去查了一下有关这个属性的资料，得知，这个属性是指定 TCP/IP 的配置，将其注释掉，重启 MySQL 服务，DataGrip 连接成功，MySQL 客户端连接成功。

## 总结

我本以为远程连接服务器上的数据库是非常简单的，只需要一个用户和密码就可以连接了。但是，实际操作服务器时，还是有很多的细节没有注意，导致了多次的失败，所以对于任何事情一定要多去实践，只有多实践才能知道有哪些不足。纸上得来终觉浅，绝知此事要躬行。

许多事情，不要觉得简单就去用图形界面，拿这次举例，DataGrip 是 JetBrains 公司推出的带有图形界面的数据库管理软件，但是他连接失败只报出了 `java.net.ConnectException` 错误，导致我排查错误的方向不对，而命令行上面的 `mysql-client` 直接报告了错误的详细信息，让我有了更精准的排查方式。

## 参考

### 数据库用户

创建用户并授权：[mysql8 创建用户及授权-远程连接(坑) | 永无止境](http://netsite.win/2018/06/13/mysql/mysql8%E5%88%9B%E5%BB%BA%E7%94%A8%E6%88%B7%E5%8F%8A%E6%8E%88%E6%9D%83-%E8%BF%9C%E7%A8%8B%E8%BF%9E%E6%8E%A5-%E5%9D%91/)

修改密码格式：[mysql8 创建用户并授权\_飞奔的波大爷的博客-CSDN 博客](https://blog.csdn.net/qq_22860341/article/details/85061819)

### 防火墙和端口

对 `java.net.ConnectException: Connection refused: connect.` 错误的解决方法：[解决： java.net.ConnectException: Connection refused: connect\_愿我如星君如月 ... 夜夜流光相皎洁 ...-CSDN 博客](https://blog.csdn.net/u011314442/article/details/80926682)

查看正在使用的端口：[linux 如何查看正在使用的端口\_萝卜 Master 的博客-CSDN 博客](https://blog.csdn.net/q361239731/article/details/53180126)

查看开放的端口：[Linux 查看服务器开放的端口号 - 潇湘隐者 - 博客园](https://www.cnblogs.com/kerrycode/p/5609010.html)

### 服务器端配置问题

ERROR 2003 解决方法：[MySQL 远程连接 ERROR 2003 (HY000):Cant connect to MySQL server onXXXXX(111) 的问题\_qustdjx 的博客-CSDN 博客](https://blog.csdn.net/qustdjx/article/details/26937325)

ERROR 2003 解决方法：[MySQL 远程访问报错 ERROR 2003 (HY000):Cant connect to MySQL server onXXXXX(111)\_没事就写点-CSDN 博客](https://blog.csdn.net/a5nan/article/details/72864249)

### 对 bind-address 属性的解释

官方：[MySQL :: MySQL 8.0 Reference Manual :: 5.1.8 Server System Variables](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_tmpdir)，Chrome 80 以上点击 [此链接](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#docs-body:~:text=a-,bind_address%20system)，可以直达 `bind-address` 处
