---
title: Java 笔记 - 集合
date: 2021-02-18 12:32:16
tags:
  - Java
  - Java 集合
categories:
  - 笔记
---

Java 笔记 - Collection

<!--more-->

## 概述

一方面，面向对象语言对事物的体现都是以对象的形式,为了方便对多个对象的操作，就要对对象进行存储。另一方面，使用 `Array` 存储对象方面具有一些弊端，而 Java 集合就像一种容器，可以动态地把多个对象的引用放入容器中。

数组在内存存储方面的特点：

- 数组初始化以后，长度就确定了
- 数组声明的类型，就决定了进行元素初始化时的类型

数组在存储数据方面的弊端：

- 数组初始化以后，长度就不可变了，不便于扩展
- 数组中提供的属性和方法少，不便于进行添加、删除、插入等操作，且效率不高。同时无法直接获取存储元素的个数
- 数组存储的数据是有序的、可以重复的。存储数据的特点单一

Java 集合类可以用于存储数量不等的多个对象，还可用于保存具有映射关系的关联数组。

集合可以分为 Collection 和 Map 两种体系

- Collection 接口：单列数据，定义了存取一组对象的方法的集合
  - List：元素有序，可重复的集合
  - Set：元素无需，不可重复的集合
- Map 接口：双列数据，保存具有映射关系的键值对集合

![Collection 接口的继承树](https://s3.ax1x.com/2021/02/18/yRjmMq.png)

Collection 接口的继承树

![Map 接口的继承树](https://s3.ax1x.com/2021/02/18/yRjJzR.png)

Map 接口的继承树

## Collection 接口常用方法

向 `Collection` 接口实现类的对象中添加数据时，要求数据所在的类要重写 `equals`

- `add(E e)`：将元素 e 添加到集合中
- `size()`：获取元素的个数
- `addAll(Collection<? extends E> coll)`：将 coll 中所有元素添加到集合中
- `isEmpty()`：判断当前集合是否为空
- `clear()`：清空集合元素
- `contains(E e)`：判断当前集合中是否包含 e（调用 e 的 `equals` 方法来判断）
- `containsAll(Collection<?> coll)`：判断 coll 中的所有元素是否都存在于当前集合中
- `remove(E e)`：从集合中移除 e，删除成功返回 `true`，删除失败返回 `false`
- `removeAll(Collection<?> coll)`：从当前集合移除 coll 中的所有元素（差集）
- `retainAll(Collection<?> coll)`：交集，获取当前集合和 coll 集合的交集并返回给当前集合
- `equals(Object obj)`：判断当前集合和 obj 元素是否相同
- `hashCode()`：计算集合的哈希值
- `toArray()`：返回当前集合的 `Object` 数组

扩展：数组到集合 `Arrays.asList(T... a)`

- `iterator()`：返回 `Iterator` 接口的实例，用于遍历集合元素。

## 使用 `Iterator` 遍历集合

`Iterator` 对象称为迭代器（设计模式的一种），主要用于遍历 `Collection` 集合中的元素

GOF 给迭代器模式的定义为：提供一种方法访问一个容器（`container`）对象中各个元素，而又不需暴露该对象的内部细节。迭代器模式，就是为容器而生

`Collection` 接口继承了 `java.lang.Iterable` 接口，该接口有一个 `iterator` 方法，那么所有实现了 `Collection` 接口的集合类都有一个 `iterator` 方法，用以返回一个实现了 `Iterator` 接口的对象

`Iterator` 仅用于遍历集合，`Iterator` 本身并不提供承装对象的能力。如果需要创建 `Iterator` 对象，则必须有一个被迭代的集合

集合对象每次调用 `iterator` 方法都得到一个全新的迭代器对象，默认游标都在**集合的第一个元素之前**

方式一（不推荐）：

```java
Iterator it = coll.iterator();
println(it.next());
println(it.next());
//...
```

方式二（不推荐）：

```java
for (int i = 0; i < coll.size(); i++) println(it.next());
```

方式三（推荐）：

```java
while(it.hasNext()) println(it.next());
```

### 执行原理

`hasNext()`：判断是否还有下一个元素

`next()`：指针下移 → 将下移以后集合位置上的元素返回

### 迭代器中的 `remove`

`remove` 方法可以帮你在迭代的时候删除一些元素

删除集合中 Tom

```java
while(it.hasNext()) {
    println(it.next());
    if ("Tom".equals(it)) it.remove();
}
```

`iterator` 可以删除集合的元素，但是是遍历过程中通过迭代器对象的 `remove` 方法，不是集合对象的 `remove` 方法
如果还未调用 `next` 或在上一次调用 next 之后已经调用了 `remove` 方法，再调用 `remove` 都会抛 `IllegalStateException`

## foreach 循环

Java5 提供了 foreach 循环迭代访问 Collection 和数组

遍历操作不需要获取 Collection 或数组的长度，无需使用索引访问元素

遍历集合的底层调用 Iterator 完成操作

foreach 可以用来遍历数组

```java
for (Person p : persons) println(p.getName());
```

## List 接口

`List` 接口是 `Collection` 的子接口

鉴于 Java 中数组用来存储数据的局限性，通常用 `List` 替代数组

`List` 集合类中元素**有序**且**可重复**，集合中每个元素都有其对应索引

`List` 容器中的元素都对应一个整数型序号记载其在容器中的位置，可以根据序号存取容器中的元素

JDK API 中 `List` 接口的实现类常用的有：`ArrayList`、`LinkedList` 和 `Vector`

`ArrayList`、`LinkedList` 和 `Vector` 的异同：

相同：都是实现了 List 接口，存储数据的特点相同：存储有序的、可重复的数据

不同：

`ArrayList`：作为 List 接口的主要实现类；线程不安全的，效率高；底层使用 `Object[]` 存储

`LinkedList`：底层使用双向链表存储；对于频繁的插入和删除操作，使用此类效率比 `ArrayList` 高

`Vector`：作为 List 接口的古老实现类；线程安全的，效率低；底层使用 `Object[]` 存储

### ArrayList 源码分析

JDK7

```java
ArrayList list = new ArrayList(); // 创建了长度是 10 的 Object 数组 elementData
list.add(1);
// ...
list.add(11); // 如果添加导致底层 elementData 容量不够，则扩容
// 默认情况下扩容为原来的 1.5 倍
// 同时需要将原有数组中的数据复制到新的数组中

```

建议开发中使用带参数的构造器：`new ArrayList(int initialCapacity)`

JDK8

```java
ArrayList list = new ArrayList(); // 底层 Object 数组初始化为 {}
// 并没有创建长度为 10 的数组
list.add(1); // 第一次调用 add 方法，底层才创建了长度为 10 的数组，并将 1 添加进去
// 后续添加和扩容操作和 jdk7 相同
```

JDK7 中的 ArrayList 的创建类似与单例饿汉式，JDK8 中 ArrayList 的对象的创建类似于单例的懒汉式，延迟了数组的创建，节省了内存

### LinkedList 源码分析

```java
LinkedList list = new LinkedList(); // 内部声明了 Node 类型的 first 和 last 属性
// 默认为 null
list.add(1); // 将 123 封装到 Node 中，创建 Node 对象
```

Node 是普通双向链表的节点

### Vector 源码分析

JDK7 和 8 中，通过 Vector() 创建对象时，底层都创建了长度为 10 的数组

在扩容方面，vector 默认扩容为原来数组长度的 2 倍

### List 接口中常用方法

- `add(int inedx, E e)`：将 `e` 插入到 `index` 的位置
- `remove(int index)`：移除指定 `index` 位置的元素，并返回此元素
- `remove(E e)`：`Collection` 的方法
- `set(int index, E e)`：指定 `index` 位置的元素为 `e`
- `get(int index)`：获取指定 `index` 位置的元素，如果越界则抛异常
- `size()`：返回长度
- `indexOf(E e)`：返回 `e` 在集合中首次出现的位置，如果不存在返回 -1
- `addAll(int index, Collection<? extends E> coll)`：从 `index` 位置开始将 `coll` 中的所有元素添加进来
- `lastIndexOf(E e)`：返回 `e` 在集合中末次出现的位置，如果不存在返回 -1
- `subList(int fromIndex, int toIndex)`：返回从 `fromIndex` 到 `toIndex` 位置（左闭右开）的子集合

遍历：

- iterator 迭代器方式

```java
Iterator it = list.iterator();
while (it.hasNext()) {
    println(iterator.next());
}
```

- foreach 循环

```java
for (Object o : list) {
    println(o);
}
```

- 普通 for 循环

```java
for (int i = 0; i < list.size(); i++) {
    println(list.get(i));
}
```

## Set 接口

`HashSet`：作为 Set 接口的主要实现类；线程不安全；可存储 `null` 值

`LinkedHashSet`：作为 HashSet 的子类；遍历其数据时，可以按照添加的顺序遍历

`TreeSet`：可以按照添加对象的指定属性进行排序

### 对 Set 无序性，不可重复的理解

无序性

不等于随机性。存储的数据在数组中并非按照数组索引的顺序添加，而是根据数据的哈希值决定的

不可重复性

保证添加的元素按照 equals 方法判断时，不能返回 true

### HashSet 中元素添加过程

向 HashSet 中添加元素 `a`，首先调用 `a` 所在类的 `hashCode` 方法计算 `a` 的哈希值

此哈希值接着通过某种算法计算出在 `HashSet` 底层数组中的存放位置（即为索引位置）

判断数组此位置上是否已经有元素

如果此位置没有其他元素，则元素 `a` 添加成功

如有其他元素 `b`（或以链表形式存在的多个元素），则比较元素 `a` 与元素 `b` 的哈希值：

如果哈希值不相同，则元素 `a` 添加成功。如果哈希值相同，进而需要调用 `a` 所在类的 equals 方法

如果 `equals` 方法返回 `true`，元素 `a` 添加失败

如果 `equals` 返回 `false`，元素 `a` 添加成功

对于添加成功的情况，元素 `a` 与已经存在于指定索引位置上的数据以链表的方式存储

JDK7：元素 `a` 放到数组中，指向原来的元素

JDK8：原来的元素不动，指向元素 `a`

数据在 HashSet 存储的结果是哈希链表

### `hashCode` 和 `equals` 方法的重写

为什么 IDEA 中重写 hashCode 方法有 31 这个数字

- 选择系数要选择尽量大的系数，因为计算出来的 hash 地址越大，所谓的冲突就越少，查找起来效率就越高
- 31 只占用了 5 bits，相乘造成数据溢出的概率较小
- 31 可以由 `i * 31 == (i << 5) - 1` 来表示，现在很多虚拟机里面都有做相关优化
- 31 是一个素数，一个数字乘以素数最终结果只能被素数本身和 1 来整除

向 Set 中添加的数据，其所在的类一定要重写 `hashCode` 和 `equals` 方法

### `LinkedHashSet` 的使用

`LinkedHashSet` 作为 `HashSet` 的子类，在添加数据的同时，每个数据还维护了两个引用，记录了此数据的前一个数据和后一个数据

对于频繁的遍历操作，`LinkedHashSet` 效率高于 `HashSet`

### `TreeSet` 的自然排序

向 `TreeSet` 中添加的数据，要求是相同类的对象

两种排序方式：自然排序（实现 `Comparable` 接口）和定制排序（实现 `Comparator` 接口）

自然排序中，比较两个对象是否相同的标准为 `compareTo` 方法返回 `0`，不再是 `equals`

定制排序中，比较两个对象是否相同的标准为 `compare` 方法返回 `0`

## Map 接口

`Map` 用来存储 `key-value` 对的数据

`HashMap`：主要的实现类，线程不安全，效率高；存储 `null` 的 `key` 和 `value`

`LinkedHashMap`：保证遍历 `map` 元素时可以按照添加的顺序实现遍历。原理：在原有的 `HashMap` 底层结构基础上，添加了一对指针指向前一个和后一个元素。对于频繁的遍历操作，此类执行效率高于 `HashMap`

`TreeMap`：保证按照添加的 `key-value` 对进行排序，实现排序遍历。此时考虑 `key` 的自然排序或定制排序。底层使用红黑树

`Hashtable`：古老的实现类，线程安全，效率低；不能存储 `null` 的 `key` 和 `value`

`Properties`：常用来处理配置文件。`key` 和 `value` 都是 `String` 类型

`HashMap` 底层：数组+链表（JDK7）数组+链表+红黑树（JDK8）

面试题：

- `HashMap` 的底层实现原理
- `HashMap` 和 `HashTable` 的异同
- `CurrentHashMap` 与 `HashTable` 的区别

### Map 结构的理解

Map 中的 key 不可重复，无序，使用 Set 存储所有的 key。key 所在的类要重写 equals 和 hashCode 方法（以 HashMap 为例）

Map 中的 value 可重复，无序，使用 Collection 存储所有的 value。value 所在的类要重写 equals 方法

一个键值对：key-value 构成了一个 entry 对象

Map 中的 entry：无序的，不可重复的

### HashMap 的底层实现原理

JDK7

```java
HashMap map = new HashMap();
// 在实例化以后，创建了长度是 16 的一维数组 Entry[] table
map.put(key1, value1);
// 调用 key1 所在类的 hashCode 计算 key1 的哈希值
// 此哈希值经过某种算法以后，得到在 Entry 数组中存放的位置
// 如果此位置上的数据为空，此时的 key1-value1 添加成功
// 如果此位置上的数据不为空，意味着此位置上存在一个或多个数据，以链表的形式存储
// 比较 key1 和已经存在的一个或多个数据的哈希值：
//   如果 key1 的哈希值与已经存在的数据的哈希值不相同，此时 key1-value1 添加成功
//   如果 key1 的哈希值与已经存在的某一个数据的哈希值相同
//     继续比较：调用 key1 所在类的 equals 方法，比较
//       如果 equals 方法返回 false，则 key1-value1 添加成功
//       如果 equals 方法返回 true，使用 value1 替换相同 key 的 value
// ... put 操作
// 在不断的添加过程中，会涉及到扩容问题。
// 默认的扩容方式：扩容为原来容量的 2 倍，并将原有数据复制过来
```

在不断的添加过程中，会涉及到扩容问题，当**超出临界值**且**要存放的位置非空**时进行扩容，默认扩容为原来容量的 2 倍，并将原有数据复制过来

JDK8

JDK8 相较于 JDK7 在底层实现方面的不同

- `new HashMap()` 没有创建一个长度为 16 的数组
- 底层的数组是 `Node[]` 而非 `Entry[]`
- 首次调用 `put` 方法时，底层创建长度为 16 的数组
- JDK7 底层结构只有数组和链表。JDK8 中底层结构：数组+链表+红黑树
- 当数组某一个索引位置上的元素以链表形式存在的数据个数大于 8 且当前数组长度大于 64，此时此索引位置上的所有数据改为使用红黑树存储

一些重要的常量和变量

`DEFAULT_INITIAL_CAPACITY`：默认容量：16

`DEFAULT_LOAD_FACTOR`：HashMap 的默认加载因子：0.75

`threshold`：扩容的临界值，=容量 x 填充因子：默认为 16 x 0.75 = 12

`TREEIFY_THRESHOLD`：Bucket 中链表长度大于该默认值，转化为红黑树

`MIN_TREEIFY_CAPACITY`：桶中的 Node 被树化时最小的 hash 表容量：64

### LinkedHashMap 的底层实现

源码中的节点添加了两个引用 before、after，能够记录元素添加的先后顺序

### Map 中常用方法

添加、删除、修改

- `put(K key, V value)`：将键值对添加到（或修改）当前 `map` 对象
- `putAll(Map<K, V> m)`：将 `m` 中的所有键值对添加到当前 `map` 中
- `remove(K key)`：移除指定 `key` 值的键值对，返回 `value`
- `clear()`：清空当前 `map` 中所有的数据

查询

- `get(K key)`：获取指定 `key` 对应的 `value`
- `containsKey(K key)`：是否包含指定的 `key`
- `containsValue(V value)`：是否包含指定的 `value`
- `size()`：返回 `map` 中键值对的个数
- `isEmpty()`：判断当前 `map` 是否为空
- `equals(Object obj)`：判断当前 `map` 和参数对象 `obj` 是否相等

视图操作

- `keySet()`：返回所有 `key` 构成的 `Set` 集合
- `values()`：返回所有 `value` 构成的 `Collection` 集合
- `Set entrySet()`：返回所有键值对构成的 `Set` 集合

### TreeMap 两种添加方式的使用

向 TreeMap 中添加键值对，要求 key 必须是由同一个类创建的对象

因为要按照 key 进行排序：自然排序、定制排序

### Properties 处理属性文件

Properties 类是 HashTable 的子类，该类用于处理属性文件

由于属性文件里的 key、value 都是字符串类型，所以 Properties 里的 key 和 value 都是字符串类型

存取数据时，建议使用 `setProperty(String key, String value)` 方法和 `getProperty(String key)` 方法

默认情况配置文件放在项目的根目录下

```java
Properties props = new Properties();
FileInputSystem in = new FileInputSystem("jdbc.properties");
props.load(in);
String name = props.getProperty("name");
String pass = props.getProperty("password");
```

## Collections 工具类

Collections 是一个操作 Set、List、Map 等集合的工具类

Collections 中提供了一系列的静态方法对集合元素进行排序、查询和修改等操作，还提供了对集合对象设置不可变、对集合对象实现同步控制等方法

### 排序操作的静态方法

- `reverse(List)`：反转 `List` 中元素的顺序
- `shuffle(List)`：对 `List` 集合元素进行随机排序
- `sort(List)`：根据元素的自然顺序对指定 `List` 集合元素按升序排序
- `sort(List, Comparator)`：根据指定的 `Comparator` 产生的顺序对 `List` 集合元素进行排序
- `swap(List, int, int)`：将指定 `List` 集合中的 i 处元素和 j 处元素进行交换

### 查找、替换

- `max(Collection)`：根据元素的自然排序，返回给定集合中的最大元素
- `max(Collection, Comparator)`：根据 Comparator 指定的顺序，返回给定集合中的最大元素
- `min(Collection)`：最小
- `min(Collection, Comparator)`：最小
- `frequency(Collection, Object)`：返回指定集合中指定元素出现的次数
- `copy(List dest, List src)`：将 src 中的内容复制到 dest 中，dest 的 size 必须要大于等于 src 的 size，否则会抛异常
- `replaceAll(List list, Object oldVal, Object newVal)`：使用新值替换 List 对象的所有旧值

### 同步控制

Collections 中提供了多个 `synchronizedXxx` 方法，该方法可将指定集合包装成线程同步的集合，从而解决多线程兵法访问集合时的线程安全问题
