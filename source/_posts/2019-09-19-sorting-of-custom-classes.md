---
title: Java 自定义类的排序
date: 2020-05-26 10:33:34
tags: Java
---

介绍两种 Java 自定义类的排序的方法
<!--more-->

## 前言

在 Java 中，类的实例默认是不可以进行比较和排序的，本文将解决以下两个问题：

- 如何比较类同一个类的两个实例的大小？
- 正常的Java数组是可以用 `Array.sort()` 进行排序的，前提是这些元素是可排序的，在自定义的类中怎么直接使用 `Array.sort()` 呢？

## 介绍 Comparable

Comparabe 是一个排序接口，如果一个类支持 Comparable 接口，就意味着该类支持排序排序。实现了 Comparable 接口的类的对象的列表或数组可以通过 `Arrays.sort()` 进行自动排序，此外，实现此接口的对象可以用作有序映射中的键或有序集合中的集合，无需指定比较器。

### Comparable 的定义

```java
import java.util.*;
public interface Comparable<T> {
  public int compareTo(T o);
}
```

### Comparable 的说明

- T表示可以与此对象进行比较的对象的类型
- 此接口只有一个方法 `compareTo`，比较此对象与指定对象的顺序，小于返回负整数，大于返回正整数，等于返回0

### Comparable 的示例

```java
public class FruitTest {
    public static void main(String[] args) {
      Fruit[] a = new Fruit[3];
      a[0] = new Fruit(1, 2, 3);
      a[1] = new Fruit(4, 5, 6);
      a[2] = new Fruit(7, 8, 9);
      Arrays.sort(a);
      for (int i = 0; i < 3; i++) {
        System.out.println(a[i].getWeight() + " " + a[i].getSugar() + " " + a[i].getPrice());
      }
    }
}

public class Fruit implements Comparable<Fruit>{
    private double weight;  // 重量
    private double sugar;  // 含糖量
    private double price;  // 价格

    public Fruit(double w, double s, double p) {
        weight = w;
        sugar = s;
        price = p;
    }

    public int compareTo(Fruit a) {
        return -Double.compare(this.weight, a.weight);  // 按照重量由大到小进行排序
    }

    public double getWeight() {
        return weight;
    }

    public double getSugar() {
        return sugar;
    }

    public double getPrice() {
        return price;
    }
}
```

上面的程序输出为

> 7.0 8.0 9.0
> 4.0 5.0 6.0
> 1.0 2.0 3.0

说明排序成功

## 介绍 Comparator

Comparator 是一个比较接口，如果要控制某个类的次序，而该类本身不支持排序，那么可以建立一个“该类的比较器”来进行排序，这个比较器只需要实现 Comparator 接口即可。

### Comparator 的定义

```java
public interface Comparator<T> {
    int compare(T o1, T o2);
    boolean equals(Object obj);
}
```

### 使用 Comparator 的注意事项

- 若一个类要实现 Comparator 接口，必须要有`compare`函数，`equals`函数可写可不写
- `int compare(T o1, T o2)`函数是比较o1和o2的大小，返回负数意味着 o1 比 o2 小，返回 0 意味着 o1 等于 o2，返回正数代表 o1 大于 o2

### Comparator 的示例

## Comparable 和 Comparator 的比较

Comparable 是排序接口，若一个类实现了 Comparable 接口，就意味着“该类支持排序”。

Comparator 是比较器，我们若需要控制某个类的次序，可以建立一个“该类的比较器”来进行排序。

Comparable 相当于“内部比较器”，而 Comparator 相当于“外部比较器”。

两种方法各有优劣， 用 Comparable 简单， 只要实现 Comparable 接口的对象直接就成为一个可以比较的对象，但是需要修改源代码。

用 Comparator 的好处是不需要修改源代码， 而是另外实现一个比较器， 当某个自定义的对象需要作比较的时候，把比较器和对象一起传递过去就可以比大小了， 并且在 Comparator 里面用户可以自己实现复杂的可以通用的逻辑，使其可以匹配一些比较简单的对象，那样就可以节省很多重复劳动了。

比如你引入了别人写的一个类，需要对这个类的实例进行比较或者排序，若要使用实现 Comparable 接口的方法，则你需要对引入的类进行源代码的修改，而如果使用实现 Comparator 接口的方式，则不需要对引入的类进行修改，只需要重新写一个引入类的比较器类就可以了。

## 参考

[java学习--自定义类的实例的大小比较和排序](https://www.cnblogs.com/gaoBlog/p/10754935.html)

[Comparable 官方文档](https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html?is-external=true)

[Comparator 官方文档](https://docs.oracle.com/javase/1.5.0/docs/api/java/util/Comparator.html)
