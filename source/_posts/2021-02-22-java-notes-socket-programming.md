---
title: Java 笔记 - 网络编程
date: 2021-02-22 18:29:42
tags:
  - Java
  - Socket 编程
categories:
  - 笔记
---

Java 笔记 - 网络编程

<!--more-->

注意：本文内容涉及到到 [IO 流](https://blog.mazixiang.me/2021/02/20/java-notes-io-stream/) 的内容

## 网络编程概述

Java 是 Internet 上的语言，它从语言级上提供了对网络应用程序的支持，程序员能够很容易开发常见的网络应用程序。

Java 提供的网络类库，可以实现无痛的网络连接，联网的底层细节被隐藏在 Java 的本机安装系统里，由 JVM 进行控制。并且 Java 实现了一个跨平台的网络库，程序员面对的是一个统一的网络编程环境。

网络编程的目的：直接或间接地通过网络协议与其他计算机实现数据交换，进行通讯

## 网络通信要素概述

如何实现网络中的主机互相通信

通信双方地址：

- IP
- 端口号

一定的规则

- OSI 参考模型：模型过于理想化，未能在因特网上进行广泛推广
- TCP/IP 参考模型：事实上的国际标准

![网络通信协议](https://s3.ax1x.com/2021/02/22/yHDZPx.png)

网络通信协议

## 通信要素 1：IP 和端口号

### IP

IP 地址类：`InetAddress`

- 唯一的表示 `Internet` 上的计算机
- 本地主机地址：`127.0.0.1`，主机名：`localhost`
- IP 地址分类方式：IPV4 和 IPV6
  - IPV4：4 个字节组成，4 个 0-255。大概 42 亿，30 亿都在北美，亚洲 4 亿。2011 年初已经用尽。以点分十进制表示，如 192.168.1.1
  - IPV6：128 位（16 字节），写成 8 个无符号整数，每个整数用四个十六进制位表示，数之间用冒号（:）分开，如：`3ffe:3021:1401:1280:c8ff:fe4d:db39:1984`
- IP 地址分类方式 2：公网地址和私有地址。192.168 开头的就是私有地址，范围是 `192.168.0.0 - 192.168.255.255`

`InetAddress` 不对外暴露构造器，需要用 `InetAddress.getByName("localhost")` 进行实例化

另外，可以用 `InetAddress.getLocalHost()` 直接获取本机的本地 IP

常用方法

- `getHostName()`：获取主机域名
- `getHostAddress()`：获取主机地址

### 端口号

端口号标识正在计算机上运行的进程（程序）

- 不同的进程有不同的端口号
- 被规定为一个 16 位的整数 0-65535

端口分类

- 公认端口：0-1023：被预先定义的服务通信占用（如 HTTP 占用端口 80，FTP 占用端口 21，Telnet 占用端口 23 等）
- 注册端口：1024-49151：分配给用户进程或应用程序。（如 Tomcat 占用端口 8080，MySQL 占用端口 3306，Oracle 占用端口 1521 等）
- 动态/私有端口：49152-65535

端口号与 IP 地址的组合地处一个网络套接字：Socket

## 通信要素 2：网络协议

### 网络通信协议

计算机网络中实现通信必须有一些约定，即通信协议，对速率、传输代码、代码结构、传输控制步骤、出错控制等制定标准

问题：网络协议太复杂

计算机网络通信涉及内容很多，比如指定源地址和目标地址，加密解密，压缩解压缩，差错控制，流量控制，路由控制，如何实现如此复杂的网络协议呢？通信协议分层的思想

在制定协议时，把复杂成份分解成一些简单的成份，再将它们复合起来。最常用的复合方式是层次方式，即同层间可以通信、上一层可以调用下一层，而与再下一层不发生关系。各层互不影响，利于系统的开发和扩展

### TCP/IP 协议

传输层协议中有两个非常重要的协议

传输控制协议：TCP，Transmission Control Protocol

用户数据报协议：UDP，User Datagram Protocol

TCP/IP 以其两个主要协议：传输控制协议和网络互联协议（IP）而得名，实际上是一组协议，包括具有多个不同功能且互为关联的协议

IP 协议是网络层的主要协议，支持网间互联的数据通信

TCP/IP 协议模型从更实用的角度触发，形成了高效的四层体系结构，及物理链路层、IP 层、传输层和应用层

TCP 协议

- 使用 TCP 协议前，须先建立 TCP 连接，形成传输数据通道
- 传输前，采用三次握手方式，点对点通信，是可靠的
- TCP 协议进行通信的两个应用进程：客户端、服务端。
- 在连接中可进行大数据量的传输
- 传输完毕，需释放已建立的连接，效率低

UDP 协议

- 将数据、源、目的封装成数据包，不需要建立连接
- 每个数据报的大小限制在 64K 内
- 发送不管对方是否准备好，接收方收到也不确认，故是不可靠的
- 可以广播发送
- 发送数据结束时无需释放资源，开销小，速度快

## TCP 网络编程

示例 1：简单的文本传输

```java
import org.junit.Test;

import java.io.*;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class TCPTest {
    @Test
    public void client() {
        Socket socket = null;
        OutputStream os = null;
        try {
            InetAddress addr = InetAddress.getByName("localhost");
            // 创建 Socket 对象，指明服务器 IP 和端口号
            socket = new Socket(addr, 10999);
            // 获取输出流，用于输出数据
            os = socket.getOutputStream();
            // 向输出流写数据
            os.write("test".getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            close(os);
            close(socket);
        }

    }

    @Test
    public void server() {
        ServerSocket socket = null;
        Socket client = null;
        InputStream inputStream = null;
        ByteArrayOutputStream out = null;
        try {
            // 创建服务器端 ServerSocket，指明自己的端口号
            socket = new ServerSocket(10999);
            // 调用 accept 接收来自客户端的 socket
            client = socket.accept();
            // 获取输入流
            inputStream = client.getInputStream();
            // 读取输入流中的数据
            out = new ByteArrayOutputStream();
            byte[] buf = new byte[20];
            int len;
            while ((len = inputStream.read(buf)) != -1) {
                out.write(buf, 0, len);
            }
            // 操作数据
            System.out.println(out.toString());
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            // 资源的关闭
            close(out);
            close(inputStream);
            close(client);
            close(socket);
        }

    }

    private void close(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

示例 2：文件传输

```java
import org.junit.Test;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class FileTransmissionServer {

    @Test
    public void client() {
        Socket client = null;
        OutputStream socketOutputStream = null;
        FileInputStream fis = null;
        try {
            client = new Socket("localhost", 10021);
            socketOutputStream = client.getOutputStream();
            fis = new FileInputStream("hello.txt");

            byte[] buf = new byte[1024];
            int len;

            while ((len = fis.read(buf)) != -1) {
                socketOutputStream.write(buf, 0, len);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            close(socketOutputStream);
            close(fis);
            close(client);
        }

    }

    @Test
    public void server() {
        ServerSocket serverSocket = null;
        Socket clientSocket = null;
        InputStream is = null;
        FileOutputStream fos = null;
        try {
            serverSocket = new ServerSocket(10021);
            clientSocket = serverSocket.accept();
            is = clientSocket.getInputStream();
            fos = new FileOutputStream("hello-server.txt");

            byte[] buf = new byte[1024];
            int len;
            while ((len = is.read(buf)) != -1) {
                fos.write(buf, 0, len);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            close(fos);
            close(is);
            close(clientSocket);
            close(serverSocket);
        }

    }

    private void close(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

{% note warning %}
注意

某些时候需要使用：`socket.shutdownInput()/shutdownOutput()` 来显式关闭流
{% endnote %}

## UDP 网络编程

```java
import org.junit.Test;

import java.io.Closeable;
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UDPTest {
    public void sender() {
        @Test
        DatagramSocket socket = null;
        try {
            socket = new DatagramSocket();

            String str = "UDP packet";
            byte[] data = str.getBytes();
            InetAddress addr = InetAddress.getLocalHost();
            DatagramPacket packet = new DatagramPacket(data, 0, data.length, addr, 10900);

            socket.send(packet);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            close(socket);
        }

    }

    @Test
    public void receiver() {
        DatagramSocket socket = null;
        try {
            socket = new DatagramSocket(10900);
            byte[] buf = new byte[1024];
            DatagramPacket packet = new DatagramPacket(buf, 0, buf.length);

            socket.receive(packet);

            System.out.println(new String(packet.getData(), 0, packet.getLength()));
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            close(socket);
        }

    }

    private void close(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

}
```

## URL 编程

URL 表示因特网上某一资源的地址

它是一种具体的 URI，即 URL 可以用来标识一个资源，而且还指明了如何定位这个资源

通过 URL 我们可以访问因特网上的各种网络资源，比如最常见的网站

URL 的基本结构由五部分构成

传输协议://主机名:端口号/文件名#片段名?参数列表

URL 类常用方法

- `getProtocol()`：获取协议名
- `getHost()`：获取主机名
- `getPort()`：获取端口号
- `getPath()`：获取文件路径
- `getFile()`：获取文件名
- `getQuery()`：获取参数

下载文件示例

```java
import org.junit.Test;

import java.io.Closeable;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class URLTest {
    @Test
    public void test1() {
        HttpURLConnection urlConnection = null;
        InputStream is = null;
        FileOutputStream fos = null;
        try {
            URL url = new URL("http://example.org/api");
            urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.connect();
            is = urlConnection.getInputStream();
            fos = new FileOutputStream("hello.txt");

            byte[] buf = new byte[100];
            int len;

            while ((len = is.read(buf)) != -1) {
                fos.write(buf, 0, len);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            close(is);
            close(fos);
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
        }
    }

    private void close(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```
