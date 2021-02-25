---
title: Java 笔记 - 动态代理
date: 2021-02-25 21:33:53
tags:
  - Java
  - 设计模式
  - 动态代理
categories:
  - 笔记
---

Java 笔记 - 动态代理

<!--more-->

## 代理设计模式的原理

使用一个代理将对象包装起来，然后用该代理对象取代原始对象，任何对原始对象的调用都要通过代理。代理对象决定是否以及何时将方法调用转到原始对象上。

## 静态代理的例子

```java
interface ClothFactory {
    void produceCloth();
}

class ProxyClothFactory implements ClothFactory {

    private ClothFactory factory; // 用被代理类对象进行实例化

    public ProxyClothFactory(ClothFactory factory) {
        this.factory = factory;
    }

    @Override
    public void produceCloth() {
        System.out.println("代理工厂做准备工作");
        factory.produceCloth();
        System.out.println("代理工厂做后续工作");
    }
}

class NikeClothFactory implements ClothFactory {
    @Override
    public void produceCloth() {
        System.out.println("Nike 工厂生产一批运动服");
    }
}
public class StaticProxyTest {
    public static void main(String[] args) {
        // 创建被代理类的对象
        NikeClothFactory nike = new NikeClothFactory();
        // 创建代理类的对象
        ProxyClothFactory proxyClothFactory = new ProxyClothFactory(nike);

        proxyClothFactory.produceCloth();
    }
}
```

静态代理的特点是代理类和被代理类在编译期间确定下来了

## 动态代理举例

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

interface Human {
    String getBelief();

    void eat(String food);
}

// 被代理类
class SuperMan implements Human {
    @Override
    public String getBelief() {
        return "I believe I can fly.";
    }

    @Override
    public void eat(String food) {
        System.out.println("我喜欢吃 " + food);
    }
}

/*
* 问题一：如何根据加载到内存中的被代理类，动态创建一个代理类及其对象
* 问题二：当通过代理类的对象调用方法时，如何动态调用被代理类中的方法
*/
class ProxyFactory {
    /***
     * 调用此方法返回一个代理类的对象
     * @param obj 被代理类的对象
     * @return 代理类的对象
     */
    public static Object getProxyInstance(Object obj) {
        MyInvocationHandler handler = new MyInvocationHandler();

        handler.bind(obj);

        return Proxy.newProxyInstance(obj.getClass().getClassLoader(), obj.getClass().getInterfaces(), handler);
    }
}

class MyInvocationHandler implements InvocationHandler {
    // 需要使用被代理类的对象来赋值
    private Object obj;

    public void bind(Object obj) {
        this.obj = obj;
    }
    /***
     * 通过代理类的对象调用方法时，会自动调用如下方法
     * 将被代理类要执行的方法的功能声明在 invoke 方法中
     * @param proxy 代理类的对象
     * @param method 代理类的对象要调用的方法，也是被代理类对象要调用的方法
     * @param args 同名方法的参数
     * @return 要调用的方法的返回值
     * @throws Throwable 抛出的异常
     */
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        return method.invoke(obj, args);
    }
}

public class DynamicProxyTest {
    public static void main(String[] args) {
        SuperMan superMan = new SuperMan();
        // 代理类的对象
        Human proxyInstance = (Human) ProxyFactory.getProxyInstance(superMan);
        // 当通过代理类对象调用方法时，会自动调用被代理类中的同名方法
        proxyInstance.getBelief();
        proxyInstance.eat("四川麻辣烫");
    }
}
```

## 动态代理和 AOP

AOP（Aspect Oriented Programming），面向切面编程

在上个例子的 `invoke` 方法中，可以自由添加你想要执行的方法，这就是面向切面的编程

```java
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // your method...
        Object returnValue = method.invoke(obj, args);
        // your method...
        return returnValue;
    }
```
