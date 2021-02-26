---
title: Java 8 中主要新特性
date: 2021-02-26 14:37:25
tags:
  - Java
  - Lambda
categories:
  - 笔记
---

介绍 Java 8 中主要的新特性：Lambda 表达式、函数式接口、方法引用与构造器引用、Stream API 和 Optional 类

## Lambda 表达式

### 举例

lambda 表达式使用举例

```java
Runnable r1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("我爱北京天安门");
    }
};

r1.run();
System.out.println("===========");
Runnable r2 = () -> System.out.println("我爱北京故宫");
r2.run();
```

### 语法

`->`：Lambda 操作符

左边是形参列表，其实就是接口中抽象方法的形参列表

右边是 `Lambda` 体，其实就是抽象方法的方法体

语法格式一：无参无返回值

```java
Runnable r2 = () -> System.out.println("我爱北京故宫");
```

语法格式二：需要参数，无返回值

```java
Consumer<String> consumer = (String s) -> System.out.println(s);
```

语法格式三：参数类型可以省略，可以由编译器推断得出

```java
Consumer<String> consumer = (s) -> System.out.println(s);
```

语法格式四：如果只需要一个参数，参数的小括号可以省略

```java
Consumer<String> con = s -> System.out.println(s);
```

语法格式五：需要两个或以上的参数，多条执行语句，可以有返回值

```java
Comparator<Integer> con = (x, y) -> {
    System.out.println("实现函数式接口方法");
    return Integer.compare(x, y);
};
```

语法格式六：当 Lambda 体只有一条语句时，`return` 和大括号都可以省略

```java
Consumer<String> con = s -> System.out.println(s);
Comparator<Integer> con = (x, y) -> Integer.compare(x, y);
```

### 本质

Lambda 表达式的本质是函数式接口的实例

## 函数式接口

当一个接口只包含一个抽象方法，这个接口就是函数式接口

可以通过 Lambda 表达式来创建这个接口的对象（若 Lambda 表达式抛出一个异常，那么该异常需要在目标接口的抽象方法上进行声明）

可以在一个接口上使用 `@FunctionalInterface` 注解，这样可以检查是否是一个函数式接口。同时 JavaDoc 也会包含一条声明，说明这个接口是一个函数式接口

在 `java.util.function` 包下定义了 Java8 的丰富函数式接口

[Java 内置四大核心函数式接口](https://www.notion.so/1c805457b4e949619a9706124ecc2a0b)

## 方法引用与构造器引用

### 方法引用

当要传递给 Lambda 体的操作，已经有实现的方法了，可以使用方法引用

方法引用可以看作是 Lambda 表达式深层次的表达。换句话说，方法引用就是 Lambda 表达啊是，也就是函数式接口的一个实例，通过方法的名字指向一个方法，可以认为是 Lambda 表达式的一个语法糖

要求：实现接口的抽象方法的参数列表和返回值类型，必须与方法引用的方法参数列表和返回值类型保持一致

格式：使用操作符 `::` 将类（或对象）与方法名分割开

主要有以下三种情况

- 情况一：对象`::`实例方法名

```java
Employee e = new Employee(1001, "Tom", 23, 5600);
Supplier<String> sup = () -> e.getName();
// to
Supplier<String> sup2 = e::getName;
```

- 情况二：类`::`静态方法名

```java
Consumer<String> consumer = (s) -> System.out.println(s);
// to
Consumer<String> consumer2 = System.out::println;

Comparator<Integer> com1 = (t1, t2) -> Integer.compare(t1, t2);
// to
Comparator<Integer> com2 = Integer::compare;
```

- 情况三：类`::`实例方法名（特殊）

```java
Comparator<String> com1 = (s1, s2) -> s1.compareTo(s2);
// to
Comparator<String> com2 = String::compareTo;

Function<Employee, String> func1 = e -> e.getName();
// to
Function<Employee, String> func2 = e -> Employee::getName;
```

使用情况：当要传递给 Lambda 体的操作已经有实现的方法了，可以用方法引用

本质：方法引用本质上是 Lambda 表达式，Lambda 表达式作为函数式接口的实例。所以方法引用也是函数式接口的实例

### 构造器引用

构造器引用和方法引用类似，函数式接口的抽象方法的形参列表和构造器的形参列表一致。抽象方法的返回值类型即为构造器所属的类的类型

```java
Supplier<Employee> sup = () -> new Employee();
// to
Supplier<Employee> sup2 = Employee::new;

Function<Integer, Employee> func = (id) -> new Employee(id);
// to
Function<Integer, Employee> func2 = Employee::new;

BiFunction<Integer, String, Employee> bf1 = (id, name) -> new Employee(id, name);
// to
BiFunction<Integer, String, Employee> bf1 = Employee::new;
```

### 数组引用

可以把数组看作特殊的类，则写法与构造器引用相同

```java
Function<Integer, String[]> func = length -> new String[length];
// to
Function<Integer, String[]> func = String[]::new;
```

## 强大的 Stream API

Stream API（`java.util.stream`）把真正的函数式编程风格引入到 Java 中

Stream 是 Java8 中处理集合的关键抽象概念，它可以指定你希望对集合进行的操作，可以执行非常复杂的查找、过滤和映射数据等操作

### 为什么要用 Stream API

是集开发中，项目中多数数据源都来自 mySQL，Oracle 等。但现在数据源可以更多了，有 MongoDB，Redis 等，而这些 NoSQL 的数据需要 Java 层面处理。

### Stream 和 Collection 的区别

Collection 是一种静态内存数据结构，而 Stream 是有关计算的。前者主要是面向内存，存储在内存中，后者主要是面向 CPU，通过 CPU 实现计算

### 关于 Stream 注意

1. Stream 自己不会存储元素
2. Stream 不会改变源对象。他们会返回一个持有结果的新 Stream
3. Stream 的操作是延迟执行的，这意味着他们会等到需要结果的时候才执行

### Stream 执行流程

1. 创建 Stream：一个数据源（如集合、数组），获取一个流
2. 中间操作：一个中间操作链，对数据源的数据进行处理
3. 终止操作：一旦执行终止操作，就执行中间操作链并产生结果。之后不会再被使用

### 创建 Stream 方式

方式一：通过集合

Java8 中的 Collection 接口被扩展，提供了两个获取流的方法

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4);
Stream<Integer> stream = list.stream();
Stream<Integer> parallelStream = list.parallelStream();
```

方式二：通过数组

```java
IntStream stream = Arrays.stream(new int[]{1, 2, 3, 4, 5});
```

方式三：通过 Stream 的 of

```java
Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5, 6);
```

方式四：创建无限流（不常用）

```java
// 迭代
Stream.iterate(0, t -> t + 2).limit(10).forEach(System.out::println);
// 生成
Stream.generate(Math::random).limit(10).forEach(System.out::println);
```

### Stream 的中间操作

多个中间操作可以连接起来形成一个流水线，除非流水线上触发终止操作，否则中间操作不会执行任何的处理。而在终止操作时一次性全部处理，称为惰性求值

筛选与切片：

- `filter(Predicate p)`：接收 Lambda，从流中排除某些元素
- `distinct()`：筛选，通过流所生成元素的 `hashCode()` 和 `equals()` 去除重复元素
- `limit(long maxSize)`：截断流，使其元素不超过给定数量
- `skip(long n)`：跳过元素，返回一个扔掉了前 n 个元素的流。若流中元素不足 n 个，则返回一个空流，与 `limit(n)` 互补

映射：

- `map(Function f)`：接收一个函数作为参数，该函数将会被应用到每个元素上，并将其映射成一个新的元素
- `mapToDouble(ToDoubleFunction f)`：接收一个函数作为参数，该函数将会被应用到每个元素上，产生一个新的 `DoubleStream`
- `mapToInt(ToIntFunction f)`：接收一个函数作为参数，该函数将会被应用到每个元素上，产生一个新的 `IntStream`
- `mapToLong(ToLongFunction f)`：接收一个函数作为参数，该函数将会被应用到每个元素上，产生一个新的 `LongStream`
- `flatMap(Function f)`：接收一个函数作为参数，将流中的每一个值都换成另一个流，然后把所有流连接成一个流（相当于嵌套循环，将里面一层循环打开）

排序：

- `sorted()`：产生一个新流，其中按自然顺序排序
- `sorted(Comparator com)`：产生一个新流，其中按指定的比较器排序

### Stream 的终止操作

终止操作会从流的流水线生成结果，其结果可以是任意不是流的值，例如 `List`、`Integer`，甚至是 `void`

匹配与查找：

- `allMatch(Predicate p)`：检查是否匹配所有元素，返回 `boolean`
- `anyMatch(Predicate p)`：检查是否至少匹配一个元素，返回 `boolean`
- `noneMatch(Predicate p)`：检查是否没有匹配所有元素，返回 `boolean`
- `findFirst()`：返回第一个元素，返回 `Optional<T>`
- `findAny()`：返回当前流中的任意元素，返回 `Optional<T>`
- `count()`：返回流中元素的总个数，返回 `long`
- `max(Comparator c)`：返回流中的最大值，返回 `Optional<T>`
- `min(Comparator c)`：返回流中的最小值，返回 `Optional<T>`
- `forEach(Consumer c)`：内部迭代

规约：

- `reduce(T identify, BinaryOperator<T> operator)`：将流中的元素反复结合起来，得到一个值，返回 `T`，第一个参数是初始值

```java
// 求 1-10 的和
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
list.stream().reduce(0, Integer::sum);
```

收集：

- `collect(Collector c)`：将流转换为其他形式，接收一个 `Collector` 接口的实现，用于给 `Stream` 中的元素做汇总的方法

`Collector` 接口中方法的实现决定了如何对流执行收集的操作（如收集到 `List`、`Set`、`Map`）

Collectors 实用类提供了很多静态的方法，可以方便地创建收集器实例

- `toList()`：把流中元素收集到 `List`，返回 `List<T>`
- `toSet()`：把流中元素收集到 `Set`，返回 `Set<T>`
- `toCollection()`：把流中元素收集到创建的集合，返回 `Collection<T>`

```java
List<Employee> employeeList = employees.stream().collect(Collectors.toList());
```

## Optional 类

`Optional<T>` 类是一个容器类，可以保存类型 T 的值，代表这个值存在，或者仅仅保存 `null`，表示这个值不存在。原来用 `null` 表示一个值不存在，现在 `Optional` 可以更好地表达这个概念，并且可以避免空指针异常

创建 `Optional` 对象的方法

- `Optional.of(T t)`：创建一个 `Optional` 实例，**t 必须非空**
- `Optional.empty()`：创建一个空的 `Optional` 实例
- `Optional.ofNullAple(T t)`：t 可以为 `null`

判断 `Optional` 容器中是否包含对象

- `isPresent()`：判断是否包含对象，返回 `boolean`
- `ifPresent(Consumer<? super T> consumer)`：如果有值，就执行 `Consumer` 接口实现的代码，并且该值会作为参数传递给它

获取 `Optional` 容器中的对象

- `get()`：如果调用对象包含值，返回该值，否则抛异常
- `orElse(T other)`：如果有值则返回，否则返回指定的 `other` 对象
- `orElseGet(Supplier<? extends T> other)`：如果有值则返回，否则返回由 `Supplier` 接口实现提供的对象
- `orElseThrow(Supplier<? extends X> exceptionSupplier)`：如果有值则返回，否则抛出由 `Supplier` 接口实现提供的异常
