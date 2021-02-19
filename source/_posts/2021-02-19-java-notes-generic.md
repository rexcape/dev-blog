---
title: Java 笔记 - 泛型
date: 2021-02-19 17:39:41
tags:
  - Java
  - 泛型
categories:
  - 笔记
---

Java 笔记 - 泛型

<!--more-->

## 泛型的概念

泛型允许在定义类、接口时通过一个标识标识类中某个属性的类型或某个方法的返回时及参数类型，这个类型参数将在使用时（继承或实现这个接口，用这个类型声明变量、创建对象时）确定（传入实际类型的参数，也称为类型实参

## 泛型的使用

### 在集合中使用泛型

- 集合几口或集合类在 JDK5 时都修改为泛型的结构
- 在实例化集合类时，可以指明具体的泛型类型
- 指明完以后，在集合或接口中凡是定义类或接口时，内部结构使用到类的泛型的位置，都指定为实例化时泛型类型。
- 注意泛型的类型必须时类，不能是基本数据类型，需要用到基本数据类型的位置需要拿包装类
- 如果实例化时没指明泛型的类型，默认类型为 `java.lang.Object` 类型

如果定义的类是有泛型的，建议在实例化时指明类的泛型

### 自定义泛型结构举例

泛型类

```java
public class Order<T> {
    String orderName;
    int orderId;

    T orderT;

    public Order(String orderName, int orderId, T orderT) {
        this.orderName = orderName;
        this.orderId = orderId;
        this.orderT = orderT;
    }

    public T getOrderT() {
        return orderT;
    }

    public void setOrderT(T orderT) {
        this.orderT = orderT;
    }
}
```

```java
public class SubOrder extends Order<Integer> {}
```

{% note primary%}
**注意**

子类在继承带泛型的父类时，指明了泛型类型。则实例化子类对象时，不需要再指定泛型
{% endnote %}

```java
// SubOrder<T> 仍然时泛型类
public class SubOrder<T> extends Order<T> {}
```

泛型接口

```java
public interface MyInterface<T> {}
```

泛型方法：在方法中出现了泛型的结构，泛型参数与类的泛型参数没有任何关系

泛型方法可以声明为静态。原因：泛型参数是在调用方法时确定的。并非在实例化类时确定

```java
public <T> T[] toArray(T[] a) {}
```

### 泛型使用注意事项

1. 泛型类可能有多个参数,此时应将多个参数一起放在尖括号内。比如 `<E1, E2, E3>`
2. 泛型类的构造器如下: `public Generic class(){}`，而下面是错误的: `public Generic Class<E>(){}`
3. 实例化后，操作原来泛型位置的结构必须与指定的泛型类型一致。
4. 泛型不同的引用不能相互赋值。
   尽管在编译时 `ArrayList<String>` 和 `ArrayList<Integer>` 是两种类型,但是,在运行时只有
   一个 `ArrayList` 被加载到 JVM 中
5. 泛型如果不指定，将被擦除，泛型对应的类型均按照 `Object` 处理，但不等价于 `Object`。
   经验：泛型要使用一路都用。要不用，一路都不要用。
6. 如果泛型类是一个接口或抽象类，则不可创建泛型类的对象。
7. jdk1.7 中泛型的简化操作：`ArrayList<Frut> list = new ArrayList<>();`
8. 泛型的指定中不能使用基木数据类型，可以使用包装类替换。
9. 在类接口上声明的泛型，在本类或本接口中即代表某种类型，可以作为非静态属性的类型、非静态方法的参数类型、非静态方法的返回值类型。但在静态方法中不能使用类的泛型。
10. 异常类不能是泛型的
11. 不能使用 `new E[]`。但是可以：`E[] elements = (E[]) new Object[capacity]`
    参考：`ArrayList` 源码中声明：`Object[] elementData`，而非泛型参数类型数组。
12. 父类有泛型，子类可以选择保留泛型也可以选择指定泛型类型：
    子类不保留父类的泛型：按需实现
    没有类型 擦除
    具体类型
    子类保留父类的泛型：泛型子类
    全部保留
    部分保留
    结论：子类必须是“富二代”，子类除了指定或保留父类的泛型，还可以增加自己的泛型

## 泛型方法使用的情境

Data Access Object 对特定数据类型增删改查方法的实现

## 泛型在继承方面的体现

虽然类 `A` 是 类 `B` 的父类，`G<A>` 和 `G<B>` 二者不具备子父类关系

补充：类 `A` 是类 `B` 的父类，则 `A<G>` 是 `B<G>` 的父类

## 通配符

### 通配符的使用

通配符：`?`

```java
List<Object> list1 = null;
List<String> list2 = null;

List<?> list = null;
list = list1;
list = list2;
```

```java
public void print(List<?> list) {
    Iterator<?> it = list.iterator();
    while (it.hasNext()) {
        Object obj = it.next();
    }
}
```

使用通配符后的数据读取和写入要求

添加：对于 `List<?>` 就不能向其内部添加数据，，除了添加 `null`

允许读取数据，读取的数据类型为 `Object`

### 有限制条件的通配符的使用

通配符指定上限

上限 `extends`：使用时指定的类型必须是继承某个类，或实现某个接口，即小于等于

通配符指定下限

下限 `super`：使用时指定的类型不能小于操作的类，即大于等于

`<? extends A>` 可以作为 `G<A>` 和 `G<B>` 的父类的，其中 `B` 是 `A` 的子类

`<? super A>` 可以作为 `G<A>` 和 `G<B>` 的父类的，其中 `B` 是 `A` 的父类
