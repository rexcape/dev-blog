---
title: Java 笔记 - 注解
date: 2021-02-17 21:07:36
tags:
  - Java
  - Java 注解
categories:
  - 笔记
---

Java 笔记 - 注解

<!--more-->

## 概述

注解是代码里的特殊标记，这些标记可以在编译、类加载和运行时被读取并执行相应的处理。通过使用注解，程序员可以在不改变程序原有逻辑的情况下在源文件中嵌入一些补充信息。代码分析工具、开发工具和部署工具可以通过这些补充信息进行验证或者进行部署

注解可以像修饰符一样被树勇，可用于修饰包、类、构造器、方法、成员变量、参数、局部变量的声明，这些信息被保存在注解的 `name=value` 对中

## 示例

生成文档相关的注解

在编译时进行格式检查

JDK 内置三个注解

- `@Override`：重写父类**方法**
- `@Deprecated`：表示所修饰的元素已经过时
- `@SuppressWarnings`：抑制编译器警告

跟踪代码依赖性，实现替代配置文件的功能

## 自定义注解

- 定义新的 `Annotation` 类型使用 `@interface` 关键字
- 自定义注解自动继承了 `java.lang.annotation.Annotation` 接口
- `Annotation` 的成员变量在 `Annotation` 定义中以无参数方法的形式来声明。其方法名和返回值定义了该成员的名字和类型。我们称为配置参数。类型只能是八种基本数据类型、 `String` 类型、`Class` 类型、`enum` 类型、 `Annotation` 类型以上所有类型的数组。
- 可以在定义 `Annotation` 的成员变量时为其指定初始值，指定成员变量的初始值可使用 `default` 关键字
- 如果只有一个参数成员，建议使用参数名为 `value`
- 如果定义的注解含有配置参数，那么使用时必须指定参数值，除非它有默认值。格式是`参数名=参数值`，如果只有一个参数成员，且名称为 `value`，可以省略 `value=`
- 没有成员定义的 `Annotation` 称为标记；包含成员变量的 `Annotation` 称为元数据 `Annotation`
- 注意：自定义注解必须配上注解的信息处理流程（使用反射）才有意义

```java
public @interface MyAnnotation {
    String value() default "Hello";
}
```

## 元注解

JDK 的元注解对现有的注解进行解释

JDK5 提供了四个标准的元注解类型，分别是

- `Retention`：只能用于修饰一个 `Annotation` 定义，用于指定该 `Annotation` 的生命周期，`@Rentention` 包含一个 `RetentionPolicy` 类型的成员变量,使用 `@Rentention` 时必须为该 `value`成员变量指定值
  - `RetentionPolicy.SOURCE`：在源文件中有效（即源文件保留），编译器直接丢弃这种策眳的注释
  - `RetentionPolicy.CLASS`：在 `class` 文件中有效（即 `class` 保留），当运行 Java 程序时，JVM 不会保留注解。这是默认值
  - `RetentionPolicy.RUNTIME`：在运行时有效（即运行时保留），当运行 Java 程序时，JVM 会保留注释。程序可以通过反射获取该注释
- `Target`：用于指定被修饰的注解能用于修饰哪些元素，包含一个名为 value 的成员变量，类型为 `ElementType` 数组
  - `CONSTRUCTOR`：用于描述构造器
  - `FIELD`：用于描述字段
  - `LOCAL_VARIABLE`：用于描述局部变量
  - `METHOD`：用于描述方法
  - `PACKAGE`：用于描述包
  - `PARAMETER`：用于描述参数
  - `TYPE`：用于描述类、接口（包括注解类型）或 `enum` 声明
- `Documented`：用于指定被该元注解修饰的注解类将被 javadoc 工具提取成文档。默认情况下，`javadoc` 是不包括注解的。定义为 `Document` 的注解必须设置 `Retention` 值为 `RUNTIME`
- `Inherited`：被它修饰的类具有继承性，如果某个类使用了被 `Inherited` 修饰的注解，则其子类自动具有该注解，实际使用中使用较少

自定义注解通常会指明两个元注解：`Retention` 和 `Target`

## JDK8 注解新特性

### 可重复注解

如果想使用两个相同的注解

- 在 `MyAnnotation` 声明 `@Repeatable`，成员值为 `MyAnnotations.class`
- `MyAnnotation` 的 `Target`、`Retention` 和 `Inherited` 必须和 `MyAnnotations` 的相同

```java
// before jdk8
// err
// @MyAnnotation("hi")
// @Myannotation("abc")
@MyAnnotations({@MyAnnotation("hi"), @Myannotation("abc")})
class SomeClass { /* ... */}

@interface MyAnnotation { String value() default "hello"; }

@interface MyAnnotations { MyAnnotation[] value(); }
```

```java
// after jdk8
@MyAnnotation("hi")
@Myannotation("abc")
class SomeClass { /* ... */}

@Repeatable(MyAnnotations.class)
@interface MyAnnotation { String value() default "hello"; }

@interface MyAnnotations { MyAnnotation[] value(); }
```

### 类型注解

`ElementType` 里面多了两个：`TYPE_PARAMETER`，`TYPE_USE`

在 Java8 之前，注解只能是在声明的地方使用，Java8 开始，注解可以应用在任何地方

- `TYPE_PARAMETER`：表示该注解能写在类型变量的声明语句中（如泛型声明）
- `TYPE_USE`：表示该注解能写在使用类型的任何语句中

```java
public class Test<@TypeDefine() U> {
    private U u;
    public <@TypeDefine() T> void test(T t) {}
}

@Target({ElementType.TYPE_PARAMETER})
@interface TypeDefine {}
```
