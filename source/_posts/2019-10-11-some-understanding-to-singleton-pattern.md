---
title: 对单例模式的理解
date: 2019-10-11 20:04:42
tags:
- 设计模式
categories:
- 实用
---

对单例模式的一些理解
<!--more-->

## 单例模式概述

单例模式（Singleton Pattern）是 Java 中最简单的设计模式之一。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。这种模式涉及到一个单一的类，该类负责创建自己的对象，同时确保只有单个对象被创建。这个类提供了一种访问其唯一的对象的方式，可以直接访问，不需要实例化该类的对象。

注意：

- 单例类只能有一个实例
- 单例类必须创建自己的唯一实例
- 单例类必须给所有其他对象提供这一实例

## 介绍

### 意图

保证一个类仅有一个实例，并提供一个访问它的全局访问点。

### 主要解决

一个全局使用的类频繁地创建与销毁。

### 何时使用

当您想控制实例数目，节省系统资源的时候。

### 如何解决

判断系统是否已经有这个单例，如果有则返回，如果没有则创建。

### 关键代码

构造函数是私有的。

### 应用实例

1. 一个班级只有一个班主任
2. Windows是多进程多线程的，在操作一个文件的时候，就不可避免的出现多个进程或线程同时操作一个文件的情况，所以所有文件的处理必须通过唯一实例运行
3. 设备管理器经常设计为单例模式，比如一个电脑有两个打印机，在输出的时候不能两台打印机处理同一文件

### 优点

1. 在内存里只有一个实例，减少了内存的开销，尤其是频繁的创建和销毁实例（比如管理学院首页页面缓存）。
2. 避免对资源的多重占用（比如写文件操作）。

### 缺点

没有接口，不能继承，与单一职责原则冲突，一个类应该只关心内部逻辑，而不关心外面怎么样来实例化。

### 使用场景

1. 要求生产唯一序列号。

2. WEB 中的计数器，不用每次刷新都在数据库里加一次，用单例先缓存起来。

3. 创建的一个对象需要消耗的资源过多，比如 I/O 与数据库的连接等。

## 实现

### 饿汉式

```java
public class Singleton {
    private static Singleton _instance = new Singleton();
    private Singleton() {}

    public static Singleton getInstance() {
        return _instance;
    }
}
```

### 懒汉式

```java
public class Singleton {
    private static Singleton _instance = new Singleton2();
    private Singleton() { }
    public static Singleton getInstance() {
        if (_instance != null) {
            _instance = new Singleton();
        }
        return _instance;
    }
}
```

## 参考

[runoob.com - 单例模式](https://www.runoob.com/design-pattern/singleton-pattern.html)

[refactoringguru.cn - 单例设计模式](https://refactoringguru.cn/design-patterns/singleton)
