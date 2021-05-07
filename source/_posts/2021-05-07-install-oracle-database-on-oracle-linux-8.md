---
title: 在 Oracle Linux 8 中安装 Oracle Database EE 19c
date: 2021-05-07 19:41:35
tags:
  - 数据库
  - SQL
  - Oracle 数据库
categories:
  - 踩坑
---

介绍如何在 Oracle Linux 中安装 Oracle Database EE 19c

<!--more-->

## 准备

需要准备：

- Oracle Linux 8 操作系统或者虚拟机，[点击链接前往下载页面](https://yum.oracle.com/oracle-linux-isos.html)
- Oracle Database[点击链接前往下载页面](https://www.oracle.com/cn/database/technologies/oracle19c-linux-downloads.html)

## 配置 Linux 操作系统

Linux 安装好之后直接新建一个用户，用户名叫 oracle，密码随意

以 root 身份登录，新建一个用户组叫做 oinstall，执行以下命令为 Oracle 新建一个文件夹并将权限转移到 oracle 用户。

```plain text
# mkdir -p /u01/app/oracle
# mkdir -p /u01/app/oraInventory
# chown -R oracle:oinstall /u01/app/oracle
# chown -R oracle:oinstall /u01/app/oraInventory
# chmod -R 775 /u01/app
```

{% note warning %}

注意：代码块中的 `#` 符号代表以 root 身份执行，`$` 符号代表以用户身份运行。不代表 bash 注释

{% endnote %}

将你下载的 zip 压缩文件使用 WinSCP 进行传输，传输到 /tmp 文件夹下，假设文件名为 db_home.zip，以 oracle 用户的身份进行解压

```shell
$ mkdir -p /u01/app/oracle/product/19.0.0/dbhome_1
$ cd /u01/app/oracle/product/19.0.0/dbhome_1
$ unzip -q /tmp/db_home.zip
...
```

安装相关的依赖

```plain text
# yum -y install oracle-database-preinstall-19c
```

解压完成后，设置对应系统版本的环境变量（不设置会导致安装界面白屏），转换到对应目录执行安装程序

{% note danger %}

注意：将下面的 `OEL8.3` 换成你下载的 Oracle Linux 的版本

{% endnote %}

```shell
$ export CV_ASSUME_DISTID=OEL8.3
$ cd /u01/app/oracle/product/19.0.0/dbhome_1
$ ./runInstaller
...
```

按指示进行，如进行到第三步下图所示

![Step 3](https://z3.ax1x.com/2021/05/07/g3O1Ff.png)

Password 处需要记住，最好包含大小写和数字，不会抛出异常

第四步 Root Script 处选择第一项，输入 root 用户的密码

之后如果监测交换区内存大小出异常，选择 ignore all 忽略掉异常

## 添加环境变量

编辑 `/home/oracle/.bashrc`，在末尾处添加以下内容

```plain text
export TMP=/tmp
export TMPDIR=$TMP

export ORACLE_HOSTNAME=oracle-db-19c
export ORACLE_UNQNAME=oradb
export ORACLE_BASE=/u01/app/oracle
export ORACLE_HOME=$ORACLE_BASE/product/19.0.0/dbhome_1
export ORA_INVENTORY=/u01/app/oraInventory
export ORACLE_SID=orcl
export PDB_NAME=pdb
export DATA_DIR=$ORACLE_BASE/oradata
export PATH=$ORACLE_HOME/bin:$PATH
export LD_LIBRARY_PATH=$ORACLE_HOME/lib:/lib:/usr/lib
export CLASSPATH=$ORACLE_HOME/jlib:$ORACLE_HOME/rdbms/jlib
```

{% note danger %}

注意：将 ORACLE_SID 的值换成你在第四步设置的 `Global database name`

{% endnote %}

执行 `source /home/oracle/.bashrc` 来更新环境变量

更新完环境变量后执行 `lsnrctl start` 开始监听

## 安装 SqlPlus（Linux）

首先需要配置 SqlPlus 来进行数据库的启动，执行如下命令来安装 SqlPlus

```plain text
# yum -y install oracle-instantclient-release-el8.x86_64
# yum -y install instantclient-sqlplus
```

## 使用 SqlPlus 操作数据库

在监听开启的情况下，执行如下命令来使用 SqlPlus 连接并开启数据库

```shell
$ sqlplus / as sysdba
SQL*Plus: Release 19.0.0.0.0 - Production on Fri May 7 08:39:13 2021
Version 19.3.0.0.0

Copyright (c) 1982, 2019, Oracle.  All rights reserved.

Connected to an idle instance.

SQL> startup
ORACLE instance started.

Total System Global Area 2415918568 bytes
Fixed Size           9137640 bytes
Variable Size        536870912 bytes
Database Buffers     1862270976 bytes
Redo Buffers         7639040 bytes
Database mounted.
Database opened.
SQL>
```

执行如下命令来关闭数据库

```shell
SQL> shutdown
Database closed.
Database dismounted.
ORACLE instance shut down.
SQL>
```

浏览器可以前往 `https://localhost:5500/em` 进行图形化管理，使用sys和你刚才设置的密码进行登录，登录不成功的话执行如下命令：

```shell
SQL> exec dbms_xdb_config.SetGlobalPortEnabled(TRUE)
```

## 使用数据库管理软件连接

首先执行如下命令来打开电脑的 1521 端口

```plain text
# firewall-cmd --add-port=1521/tcp --permanent
success
# firewall-cmd --reload
success
```

我使用 Navicat 进行连接。主机写 Linux 的 IP 地址，端口写 1521（默认），服务名就是你在第三步设置的默认数据库名称，默认就是 orcl，用户名是 sys，密码是你在第三步设置的密码，之后就可以连接了。

## 参考

- [Install Oracle 19c RDBMS on Oracle Linux 8 – avoid [WARNING] [INS-08101] Unexpected error while executing the action at state: ‘supportedOSCheck’ – martinberger.com](https://www.martinberger.com/2020/05/install-oracle-19c-rdbms-on-oracle-linux-8-avoid-warning-ins-08101-unexpected-error-while-executing-the-action-at-state-supportedoscheck/)
- [Running RPM Packages to Install Oracle Database](https://docs.oracle.com/en/database/oracle/oracle-database/19/ladbi/running-rpm-packages-to-install-oracle-database.html#GUID-BB7C11E3-D385-4A2F-9EAF-75F4F0AACF02)
- [Running Oracle Database Setup Wizard to Install Oracle Database](https://docs.oracle.com/en/database/oracle/oracle-database/19/ladbi/running-oracle-universal-installer-to-install-oracle-database.html#GUID-DD4800E9-C651-4B08-A6AC-E5ECCC6512B9)
- [Oracle日常运维操作总结-数据库的启动和关闭 - 云+社区 - 腾讯云](https://cloud.tencent.com/developer/article/1027411)
- [CentOS 7 启动Oracle_EricRan__的博客-CSDN博客_centos启动oracle数据库](https://blog.csdn.net/qq_36659897/article/details/84100308)
