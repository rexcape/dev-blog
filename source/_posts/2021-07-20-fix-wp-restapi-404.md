---
title: 解决 WordPress WP REST API 404 问题
date: 2021-07-20 11:27:48
tags:
- Apache2
- WordPress
categories:
- 踩坑
---

解决 WordPress 更新失败时 404 问题

<!--more-->

在想更新文章时，显示 WordPress 更新失败，此响应不是合法的 json 响应，这种错误有四种情况

- WordPress 编辑器插件的问题
- WordPress WP RestAPI 的问题
- 系统镜像的问题
- 伪静态的问题

打开控制台看到 `404` 错误，判断为第二种错误

## 服务器配置

OS: Ubuntu Server 20.04
Apache: Apache2.4.41
WordPress: 5.7.2_zh_CN

## Apache2 配置

首先修改 /etc/apache2/apache2.conf，找到下面的语句

```plain
<Directory /var/www/>
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
```

把 `AllowOverride` 改为 `All`

## 使用 rewrite 模块

改了上面那些还不够，查看 WordPress 根目录下面的 .htaccess 文件

```plain
# BEGIN WordPress
# 在“BEGIN WordPress”与“END WordPress”之间的指令（行）是
# 动态生成的，只应被WordPress过滤器修改。
# 任何对标记之间的指令的修改都会被覆盖。
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>

# END WordPress
```

可以发现需要启用 mod_rewrite.c 模块

```sh
$ sudo a2enmod rewrite
Enabling module rewrite.
To activate the new configuration, you need to run:
  systemctl restart apache2

$ systemctl restart apache2
```

重启服务后，问题就解决了

## 参考资料

- [[已解决]wordpress网站发布失败：此响应不是合法的JSON响应 - 云+社区 - 腾讯云 - 晓得博客](https://cloud.tencent.com/developer/article/1769015)
- [Enable apache mod_rewrite in Ubuntu 14.04 LTS](http://www.iasptk.com/enable-apache-mod_rewrite-ubuntu-14-04-lts/)
- [Stack Overflow](https://stackoverflow.com/questions/34670533/wordpress-rest-api-wp-api-404-error-cannot-access-the-wordpress-rest-api)
