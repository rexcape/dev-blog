---
title: Java 笔记 - 反射
date: 2021-02-23 09:57:26
tags:
  - Java
  - 反射
categories:
  - 笔记
---

Java 笔记 - 反射

<!--more-->

## 概述

反射被视为动态语言的关键，反射机制允许程序在执行期间借助于 API 取得任何类的内部信息，并直接操作任意对象的内部属性及方法

加载完类之后，在堆内存的方法区产生了一个 Class 类型的对象，这个对象包含了完整的类的结构信息。可以通过这个对象看到类的结构。这个对象就像一面镜子，透过镜子可以看到类的结构，所以称之为反射

动态语言

在运行时可以改变其结构的语言，如新的函数、对象、甚至代码可以被引进，已有的函数可以被删除或是其他结构上的变化

主要有：C#，JS，PHP、Python

静态语言

运行时结构不可变的语言是静态语言，如 Java、C、C++

Java 不是动态语言，但是 Java 可以称之为准动态语言，即 Java 有一定的动态性，我们可以利用反射机制来获得类似动态语言的特性。

### 反射机制提供的功能

- 在运行时判断一个对象所属的类
- 在运行时构造任意一个类的对象
- 在运行时判断任意一个类具有的成员变量和方法
- 在运行时获取泛型信息
- 在运行时调用任意一个对象的成员变量和方法
- 在运行时处理注解
- 生成动态代理

## 反射的作用

Person 类

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    private Person(String name) {
        this.name = name;
    }

    // getters and setters

    public void show() {
        System.out.println("你好，我是一个人");
    }

    private String showNation(String nation) {
        System.out.println("我的国籍是：" + nation);
        return nation;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

正常可以对 Person 示例进行的操作

```java
public class ReflectionTest {

    public void test1() {
        // 创建 Person 对象
        Person p1 = new Person("Tom",12);

        // 访问对象内部的属性、方法
        p1.age = 10;
        System.out.println(p1.toString());

        p1.show();

        // 在 Person 类外部不可以通过对象调用私有结构
        // 比如 name、showNation() 以及私有构造器
    }
}
```

那么使用反射，可以实现相同的操作

```java
public class ReflectionTest {

    public void test1() {
        // ...
    }

    public void test2() throws NoSuchMethodException, IllegalAccessException, InvocationTargetException,
            InstantiationException, NoSuchFieldException {
        Class c = Person.class;
        Constructor constructor = c.getConstructor(String.class, int.class);

        // 通过反射创建 Person 类的对象
        Object obj = constructor.newInstance("Tom", 12);
        Person p = (Person) obj;
        System.out.println(obj.toString());
        System.out.println(p.toString());

        // 访问对象的属性
        Field age = c.getDeclaredField("age");
        age.set(p, 10);

        // 调用指定的方法
        Method show = c.getDeclaredMethod("show");
        show.invoke(p);
    }
}
```

此外，反射还可以访问私有成员

```java
public class ReflectionTest {

    public void test1() {
        // ...
    }

    public void test2() throws NoSuchMethodException, IllegalAccessException, InvocationTargetException,
            InstantiationException, NoSuchFieldException {
        // ...

        // 调用私有属性
        Method showNation = c.getDeclaredMethod("showNation", String.class);
        showNation.setAccessible(true);
        String nation = (String) showNation.invoke(p1, "中国");
        System.out.println(nation);
    }
}
```

## 什么时候用反射

反射的特征是动态性，当在编译的时候不确定要实例化哪一个类

反射与面向对象中的封装性是不是矛盾的？如何看待两个技术

不矛盾。封装性解决的是希望你去调用什么，反射解决的是能不能调

## 对于 `java.lang.Class` 类的理解

首先，源代码经过 `javac.exe` 命令编译后会生成一个或多个字节码文件 `.java` 文件

类的加载过程

使用 `java.exe` 对某个字节码文件进行解释运行。相当于将某个字节码文件加载到内存中

加载到内存中的类，我们就称为运行时类，此运行时类就成为 Class 的一个实例

换句话说，Class 的实例就对应一个运行时类

加载到内存中的运行时类，会缓存一定的时间，在此时间之内，可以通过不同的方式获取此运行时类

## 获取 Class 实例的方式

- 调用运行时类的属性 `.class`
  `Class c = Person.class;`
- 通过运行时类的对象，调用 `getClass()`
  `Person p = new Person();`
  `Class c = p.getClass();`
- 调用 Class 的静态方法：`forName(String classPath)`
  `Class.forName("path.to.your.class");`
- 使用类的加载器 `ClassLoader`（使用较少）
  `ClassLoader classLoader = ReflectionTest.class.getClassLoader(); Class c4 = classLoader.loadClass("Person");`

## Class 实例对应结构

哪些类型可以有 Class 对象

- `class`：外部类、成员、局部内部类、匿名内部类
- `interface`：接口
- `[]`：数组
- `enum`：枚举
- `annoation`：注解
- `primitive type`：基本数据类型
- `void`

只要数组的元素类型与维度一样，就是同一个 Class

## `ClassLoader`

### 使用 `ClassLoader` 加载配置文件

可以用 ClassLoader 来加载静态配置文件，配置文件的默认路径为当前 module 的 src 下

```java
class ClassLoaderTest {
    public void test2() throws Exception {
        Properties props = new Properties();
        ClassLoader classLoader = ClassLoaderTest.class.getClassLoader();
        InputStream in = classLoader.getResourceAsStream("jdbc.properties");
        props.load(in);
    }
}
```

## 创建运行时类的对象

```java
public class NewInstanceTest {
    public void test1() throws Exception {
        Class c = Person.class;
        Object instance = c.newInstance();  // 创建对应的运行时类的对象，调用空参构造器
        Person p = (Person) instance;
        System.out.println(p);
    }
}
```

newInstance 方法要求

- 运行时类必须提供空参构造器
- 空参构造器的访问权限一般是 public

在 JavaBean 中要求提供一个 public 的空参构造器，原因：

- 便于通过反射创建运行时类的对象
- 便于子类继承此运行时类时，默认调用 super 时，保证父类有此构造器

## 获取运行时类的结构

### 获取运行时类的属性结构

`getFields()`：获取当前运行时类及其父类中声明为 `public` 访问权限的属性，返回 `Field` 数组

```java
Field[] fields = cls.getFields();
for (Field f : fields) {
    System.out.println(f);
}
```

`getDeclaredFields()`：获取当前运行时类中声明的所有属性（不包含父类中声明的属性），返回 `Field` 数组

```java
Field[] fields = cls.getDeclaredFields();
for (Field f : fields) {
    System.out.println(f);
}
```

### `Field` 类的方法

- `getModifiers()`：获得权限修饰符，返回 int 值，public（1），private（2），protected（0）
- `getType()`：获得数据类型，返回类型 `Class`
- `getName()`：获得属性名，返回类型 `String`

### 获取运行时类的方法结构

`getMethods()`：获取当前运行时类及其所有父类中声明为 `public` 权限的方法，返回 Method 数组

`getDeclaredMethods()`：获取当前运行时类中所有的方法，返回 `Method` 数组

### `Method` 类的方法

- `getAnnotations()`：获取方法声明的注解，返回值类型 `Annotation` 数组
- `getModifiers()`：获得权限修饰符，返回 `int` 值，public（1），private（2），protected（0）
- `getReturnType()`：获得返回值类型，返回类型 `Class`
- `getName()`：获得方法名，返回类型 `String`
- `getParameterTypes()`：获取参数类型，返回 `Class` 数组
- `getExceptionTypes()`：获取抛出异常的类型，返回 `Class` 数组

### 获取运行时类的构造器结构

`getConstructors()`：获取**当前运行时类**中声明为 `public` 的构造函数，返回 `Constructor` 数组

`getDeclaredConstructors()`：获取当前运行时类中声明的所有构造器

### 获取运行时类的父类及父类的泛型

`getSuperclass()`：获取当前运行时类的父类，返回 `Class`

`getGenericSuperclass()`：获取运行时类带泛型的父类，返回 `Type`

### 获取运行时类的接口、所在包、注解等

`getInterface()`：返回运行时类实现的接口（不包含父类实现的接口），返回 `Class` 数组

`getPackage()`：获取运行时类所在的包，返回 `Package`

`getAnnotations()`：获取运行时类的注解，返回 `Annotation` 数组

## 调用运行时类的指定结构

### 属性

`getField(String name)`：获取运行时类中指定的属性，要求属性声明为 `public`，返回 `Field`，通常不采用这种方式

`getDeclaredField(String name)`：获取运行时类中指定的属性，返回 `Field`

```java
Class cls = Person.class;
Person p = (Person) cls.newInstance();
Field id = cls.getField("id");
id.set(p, 101);
id.get(p);
```

`Field` 的相关方法

`set(Object obj, Object value)`：参数 1：指明设置哪个对象的属性，参数 2：设置为多少

`get(Object obj)`：获取哪个对象的属性值，返回 `Object`

`setAccessible(boolean b)`：设置 `Field` 的访问权限

静态属性就是将具体的对象换成类的 `class` 对象

```java
someField.set(SomeClass.class, value);
```

### 方法

`getDeclaredMethod(String name, Class<?> ...parameterTypes)`：参数 1：方法名称，参数 2：形参类型

`Method` 的相关方法

`setAccessible(boolean b)`：设置 `Method` 的访问权限

`invoke(Object obj, Object... args)`：调用方法，参数 1：方法的调用者，参数 2：给方法形参赋值的实参，返回 `Object`，返回值为对应类中调用的方法的返回值

如果调用方法没有返回值，则 `invoke` 方法返回 `null`

如果调用静态方法，`invoke` 函数的第一个参数就是对应的类

```java
someFunc.invoke(SomeClass.class, args);
// or
someFunc.invoke(null);
```

### 构造器

通常情况下，`newInstance()` 可以直接调用无参构造器

要想调用有参构造器，可以使用 `Constructor` 类的 `newInstance(Object... initargs)`

## 总结

### 获取 `Class` 实例的三种方式

第四种不常用，所以不说

```java
Class c1 = String.class;
Class c2 = Person.getClass();
Class c3 = Class.forName("Person");
```

### 对 `Class` 类的理解

Class 实例对应着加载到内存中的一个运行时类

### 创建 Class 对应运行时类的对象通用方法

```java
Object obj = cls.newInstance(); // 创建对应的运行时类的对象
```

要求：

- 必须有空参构造器
- 修饰符的权限要够，通常为 `public`
