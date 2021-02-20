---
title: Java 笔记 - IO 流
date: 2021-02-20 15:43:43
tags:
  - Java
  - IO 流
categories:
  - 笔记
---

Java 笔记 - IO 流

<!--more-->

## File 类的使用

`File` 类的一个对象，代表一个文件或一个文件目录

`File` 类声明在 `java.io` 包下

File 类中涉及到关于文件或文件目录的创建、删除、重命名、修改时间、文件大小等方法，并未涉及到写入过读取文件内容的操作。如果需要读取或写入文件内容，必须使用 IO 流来完成

后续 File 类的对象常会作为参数传递到流的构造器中，指明读取或写入的“终点”

### 构造器

- `File(String filePath)`
- `File(String parentPath, String childPath)`
- `File(File parentFile, String childPath)`

```java
File file = new File("hello.txt");
File file = new File("/home/user/hello.txt");
```

路径中的每级目录用一个路径分隔符隔开

路径分隔符和系统有关：

- Windows 和 DOS 系统默认用 \ 来表示
- UNIX 和 URL 用 / 表示

Java 程序支持跨平台运行，因此路径分隔符要慎用

为了解决这个隐患，File 类提供了一个常量 `separator`。根据操作系统，动态提供分隔符

```java
File file = new File("D:" + File.separator + "foo" + File.separator + "bar");
```

### 常用方法

- 获取功能
  - `getAbsolutePath()`：获取绝对路径
  - `getPath()`：获取路径
  - `getName()`：获取名称
  - `getParent()`：获取上层文件目录路径，若无，返回 null
  - `length()`：获取文件长度，不能获取目录长度
  - `lastModified()`：获取最后一次修改时间
  - 适用于文件目录
    - `list()`：获取指定目录下的所有文件或者文件目录的名称数组
    - `listFiles()`：获取指定目录下的所有文件或者文件目录的 File 数组
- 重命名功能

  - `renameTo(File dest)`：把文件重命名为指定的文件路径

    要想保证返回 `true`，需要 file1 在硬盘中存在的，且 file2 不能在硬盘中存在

- 判断功能
  - `isDirectory()`：判断是否是文件目录
  - `isFile()`：判断是否是文件
  - `exists()`：判断是否存在
  - `canRead()`：判断是否可读
  - `canWrite()`：判断是否可写
  - `isHidden()`：判断是否隐藏
- 创建功能

  - `createNewFile()`：创建文件。若文件存在，则不创建，返回 false
  - `mkdir()`：创建文件目录。若此文件目录存在或此文件目录的上层目录不存在，就不创建
  - `mkdirs()`：创建文件目录。如果上层文件目录不存在，一并创建

    如果创建文件或文件目录没有写绝对路径，默认在项目的路径下

- 删除功能

  - `delete()`：删除文件或文件夹

    删除文件不走回收站

    要删除一个文件目录，请注意该文件目录内不能包含文件或者文件目录

## IO 流原理及流的分类

`I/O` 是 `Input/Output` 的缩写，I/O 技术是非常实用的技术，用于处理设备之间的数据传输。如读写文件、网络通讯等

Java 程序中，对于数据的输入输出操作以流的方式进行

`java.io` 包下提供了各种流类和接口，用以获取不同种类的数据，并通过标准的方法输入或输出数据

### 流的分类

- 按操作数据单位不同分为：字节流（1Byte = 8bit）、字符流（1char = 16bit）
- 按数据流的流向不同分为：输入流、输出流
- 按流的角色不同分为：节点流（作用在节点）、处理流（作用在已有流基础上）

Java 的 IO 流共涉及 40 多个类，实际上非常规则，都是从如下四个抽象基类派生的

- 输入字节流：`InputStream`
- 输出字节流：`OutputStream`
- 输入字符流：`Reader`
- 输出字符流：`Writer`

由这四个类派生出来的子类名称都是以其父类名作为子类名后缀

![IO 流体系](https://s3.ax1x.com/2021/02/20/y5fF5n.png)

IO 流体系

{% note warning %}
**注意**

不能用字符流来处理图片等字节数据
{% endnote %}

## 节点流（或文件流）

### FileReader 读取数据的操作

```java
// 1 指明操作的文件
File file = new File("Hello.txt");
// 2 提供具体的流
FileReader reader = new FileReader(file);
// 3 数据的读入
// read()：返回读入的一个字符。如果到达文件末尾，返回 -1
int data = reader.read();
while(data != -1) {
    System.out.println((char) data);
    data = reader.read();
}
// 4 流的关闭
// 关闭的重要性参见垃圾回收机制
reader.close();
```

另外一种写法

```java
int data;
while ((data = reader.read()) != -1) {
    System.out.println((char) data);
}
```

不建议用 `throws` 处理异常，因为流可能不会关闭，建议用 `try...catch...finally` 进行处理

读入的文件一定要存在，否则就会报 FileNotFoundException

```java
FileReader reader = null;
try {
    // 1 指明操作的文件
    File file = new File("Hello.txt");
    // 2 提供具体的流
    reader = new FileReader(file);
    // 3 数据的读入
    // read()：返回读入的一个字符。如果到达文件末尾，返回 -1
    int data;
    while ((data = reader.read()) != -1) {
        System.out.println((char) data);
    }
} catch (IOException e) {
    e.printStackTrace();
} finally {
    try {
        // 4 流的关闭
        // 关闭的重要性参见垃圾回收机制
        if (reader != null) {
            reader.close();
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

另一个 `read(char[] chars)` 的用法

```java
// read(char[] chars)：返回每次读入的个数，如果达到文件末尾，返回 -1
char[] chs = new char[5];
int len;
while ((len = reader.read(chs)) != -1) {
    /*for (int i = 0; i < len; i++) {
        System.out.println(chs[i]);
    }*/
    System.out.println(new String(chs, 0, len));
}
```

### FileWriter 写出数据的操作

说明：

1. 输出操作，对应的 File 可以不存在。如果不存在，在输出的过程中，会自动创建此文件。
2. 如果硬盘中的文件存在：

   如果流使用的构造器是：FileWriter(file, false) / FileWriter(file)：对原有文件覆盖

   如果流使用的构造器是：FileWriter(file, true)：不会对原有文件覆盖，而是在原有文件基础上追加内容

```java
// 1 指明到写出类的文件
File file = new File("hello.txt");
// 2 提供 FileWriter 的对象，用于数据的写出
FileWriter writer = new FileWriter(file);
// 3 写出操作
writer.write("I have a dream!");
// 4 流资源的关闭
writer.close();
```

### 字节流

对于文本文件（txt、java、c、cpp），使用字符流处理

对于非文本文件（jpg、mp4、mp3），使用字节流处理

```java
File file = new File("hello.txt");

FileInputStream in = new FileInputStream(file);

byte[] bytes = new byte[5];
int len;

while ((len = in.read(bytes)) != -1) {
    String str = new String(bytes, 0, len);
    System.out.println(str);
}

in.close();
```

## 缓冲流

处理流之一：缓冲流

- `BufferedInputStream`
- `BufferedOutputStream`
- `BufferedReader`
- `BufferedWriter`

作用：提供流的读取、写入的速度

提高读写速度的原因：内部提供了一个缓冲区，在传输过程中不断刷新缓冲区（`BufferedInputStream` 里的 `flush` 方法）

`BufferedReader` 添加了一个 `readLine` 方法，剩下差不多都相同

```java
FileInputStream in = null;
FileOutputStream out = null;
BufferedInputStream bin = null;
BufferedOutputStream bout = null;
try {
    // 1 造文件
    File src = new File("hello.txt");
    File dest = new File("hello1.txt");

    // 2 造流
    in = new FileInputStream(src);
    out = new FileOutputStream(dest);

    bin = new BufferedInputStream(in);
    bout = new BufferedOutputStream(out);

    // 3 读取和写入
    byte[] buf = new byte[10];
    int len;
    while ((len = bin.read(buf)) != -1) {
        bout.write(buf, 0, len);
    }
} catch (IOException e) {
    e.printStackTrace();
} finally {
    // 4 资源关闭
    // 要求：先关闭外层的流，再关闭内层的流
    // 关闭外层流的同时，内层流也会自动地进行关闭
    try {
        if (bin != null) {
            bin.close();
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
    try {
        if (bout != null) {
            bout.close();
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

## 转换流

转换流提供了在字节流和字符流之间的转换

JavaAPI 提供了两个转换流

- `InputStreamReader`：将 `InputStream` 转换为 `Reader`
- `OutputStreamReader`：将 `Writer` 转换为 `OutputStream`

字节流中的数据都是字符时，转成字符流操作更高效

很多时候使用转换流来处理文件乱码的问题，实现编码和解码的功能

```java
FileInputStream in = new FileInputStream("hello.txt");
// 参数 2 指明了字符集，取决于文件保存时使用的字符集
InputStreamReader reader = new InputStreamReader(in, StandardCharsets.UTF_8);

char[] buf = new char[20];
int len;
while ((len = reader.read(buf)) != -1) {
    String str = new String(buf, 0, len);
    System.out.println(str);
}

reader.close();
```

### 字符集

`ASCII`：美国标准信息交换码，用一个字节的 7 位可以表示

`ISO8859-1`：拉丁码表。欧洲码表。用一个字节的 8 位表示

`GB2312`：中国的中文编码表。最多两个字节编码所有字符

`GBK`：中国的中文编码表升级，融合了更多的中文文字符号。最多两个字节编码

`Unicode`：国际标准码，融合了目前人类使用的所有字符。为每个字符分配唯一的字符码。所有的字符都用两个字节表示

`UTF-8`：变长的编码方式，可用 1-4 字节表示一个字符（修正后是 1-6）

`UCS Transfer Format`，面向传输的众多标准出现了，`UTF-8` 就是每次 8 个位传输数据，`UTF-16` 就是每次 16 个位。这是为传输而涉及的编码，并使编码无国界，这样就可以现实全世界上所有文化的字符了

![unicode 和 utf-8 编码](https://s3.ax1x.com/2021/02/20/y5W1c8.png)

字符编码

`ANSI` 编码，通常指的是平台的默认编码，例如英文的操作系统中是 `ISO-8859-1`，中文系统是 `GBK`

`Unicode` 字符集只定义字符的集合和唯一编号，`Unicode` 编码则是对 `UTF-8`、`UCS-2`/`UTF-16` 等具体编码方案的统称，并不是具体的编码方案

## 标准输入输出流

`System.in` 和 `System.out` 分别代表了系统的标准输入和输出设备

默认输入设备是键盘，默认输出设备是控制台

`System.in` 的类型是 `InputStream`

`System.out` 的类型是 `PrintStream`，是 `OutputStream` 的子类

重定向：通过 `System` 类的 `setIn` 和 `setOut` 方法重新指定输入和输出的流

- `public static void setIn(InputStream in)`
- `public static void setOut(PrintStream out)`

示例代码：从键盘输入字符串，要求将读到的整行字符串转换成大写进行输出。然后继续进行输入操作，直到输入 “e” 或 “E” 退出程序

```java
BufferedReader br = null;
try {
    InputStreamReader isr = new InputStreamReader(System.in);
    br = new BufferedReader(isr);
    br.readLine();
    while (true) {
        String data = br.readLine();
        if ("e".equals(data) || "E".equals(data)) {
            System.out.println("End");
            break;
        }
        System.out.println(data.toUpperCase(Locale.ROOT));
    }
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (br != null) {
        try {
            br.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## 打印流

打印流：`PrintStream` 和 `PrintWriter`

- 提供了一系列重载的 `print` 和 `println` 方法，用于多种数据类型的输出
- `PrintStream` 和 `PrintWriter` 的输出不会抛出 `IOException` 异常
- `PrintStream` 和 `PrintWriter` 有自动 `flush` 的功能
- `PrintStream` 打印的所有字符都使用平台的默认字符编码转换为字节。在需要写入字符而不是写入字节的情况下应使用 `PrintWriter` 类
- `System.out` 返回的是 `PrintStream` 的实例

## 数据流

为了方便地读写 `Java` 中基本数据类型和 `String` 类型的数据，可以使用数据流。

数据流：`DataInputStream` 和 `DataOutputStream`，分别套在 `InputStream` 和 `OutputStream` 子类的流上

`DataInputStream` 中的方法

- `readBoolean()`
- `readChar()`
- `readDouble()`
- `readLong()`
- `readUTF()`
- `readByte()`
- `readFloat()`
- `readInt()`
- `readFully(byte[] b)`

`DataOutputStream` 中的方法将上述方法的 `read` 改为相应的 `write` 即可

## 对象流

对象流：`ObjectInputStream` 和 `ObjectOutputStream`

用于存储基本数据类型数据或对象的处理流。它的强大之处是可以将 `Java` 中的对象写入到数据流中，也能把对象从数据源中还原回来

序列化：用 `ObjectOutputStream` 类保存基本数据类型或对象的机制

反序列化：用 `ObjectOutputStream` 类读取基本数据类型或对象的机制

`ObjectOutputStream` 和 `ObjectInputStream` 不能序列化 `static` 和 `transient` 修饰的成员变量

```java
ObjectOutputStream oos = null;
try {
    oos = new ObjectOutputStream(new FileOutputStream("hello.txt"));
    oos.writeObject(new String("Hello"));
    oos.flush();// 刷新操作
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (oos != null) {
        try {
            oos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 对象的序列化

- 对象序列化机制允许把内存中的 `Java` 对象转换成平台无关的二进制流，从而允许把这种二进制流持久地保存在磁盘上，或通过网络将这种二进制流传输到另一个网络节点。
  当其他程序获取了这种二进制流，就可以恢复成原来的 `Java` 对象
- 序列化的好处在于可将任何实现了 `Serializable` 接口的对象转化为字节数据，使其在保存和传输时可被还原
- 序列化是 `RMI`（Remote Method Invoke - 远程方法调用）过程的参数和返回值都必须实现的机制，而 `RMI` 是 `JavaEE` 的基础。因此序列化机制是 JavaEE 平台的基础
- 如果需要让某个对象支持序列化机制，则必须让对象所属的类及其属性是可序列化的，为了让某个类是可序列化的，该类必须实现如下两个接口之一。否则，会抛出 `NotSerializableException` 异常
  - `Serializable`
  - `Externalizable`
- 凡是实现 `Serializable` 接口的类都有一个表示序列化版本标识符的静态变量
  - `public static final long serialVersionUID`
  - `serialVersionUID` 用来表明类的不同版本的兼容性。简而言之，其目的是以序列化对象进行版本控制，有关各版本反序列化时是否兼容
  - 如果类没有显式定义这个静态常量，他的值是由 Java 运行时环境根据类的内部希捷自动生成的。若类的实例变量做了修改，`serialVersionUID` 可能发生变化，建议显式声明
- Java 的序列化机制是通过运行时判断类的 `serialVersionUID` 来验证版本的一致性的。在进行反序列化时，JVM 会把传来的字节流中的 `serialVersionUID` 与本地相应实体类的 `serialVersionUID` 进行比较，如果相同就认为是一致的，否则就会抛出序列化版本不一致的异常 `InvalidCastException`

### 自定义类的序列化和反序列化

`Person` 要满足如下要求才可以序列化

- 实现接口 `Serializable`
- 当前类提供一个全局常量 `serialVersionUID`，值可以随便设置
- 除了当前 `Person` 类需要实现 `Serializable` 接口外，还必须保证其内部所有属性都是可序列化的
- 默认情况下，基本数据类型可以序列化
- 默认情况下，`ObjectOutputStream` 和 `ObjectInputStream` 不能序列化 `static` 和 `transient` 修饰的成员变量

```java
import java.io.Serializable;

// Serializable 接口只是一个标识
public class Person implements Serializable {
    public static final long serialVersionUID = 2121L;
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public Person() {
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

## 随机存取文件流

`RandomAccessFile` 类

- `RandomAccessFile` 类声明在 `java.io` 包下，直接继承于 `Object` 类。并且它实现了 `DataInput`、`DataOutput` 这两个接口，也就意味着这个类既可以读又可以写
- `RandomAccessFile` 类支持随机访问的方式，程序可以直接跳到文件的任意地方读写文件
  - 支持只访问文件的部分内容
  - 可以向已经存在的文件后追加内容
- `RandomAccessFile` 对象包含一个记录指针，用以标示当前读写处的位置。`RandomAccessFile` 类对象可以自由移动记录指针
  - `long getFilePointer()`：获取文件记录指针的当前位置
  - `void seek(long pos)`：将文件记录指针定位到 pos 位置

`RandomAccessFile` 作为输出流时，写出到的文件如果不存在，则在执行过程中自动创建，如果写出到的文件存在，则会对原有的文件内容进行覆盖。默认情况下从头覆盖

可以用 `RandomAccessFile` 类来实现多线程断点下载的功能

## NIO 中类的使用

NIO（New IO，Non-Blockinbg IO） 是 Java 1.4 版本开始引入的一套新的 IO API，可以替代标准的 IO API。NIO 与原来的 IO 具有同样的作用和目的，但是使用方式是完全不同的，NIO 是面向缓冲区的（IO 是面向流的）、基于通道的 IO 操作，NIO 将以更加高效的方式进行文件的读写操作

Java API 中提供了两套 NIO，一套是针对标准输入输出 NIO，另一套是网络编程 NIO

JDK 7 发布的 NIO2 对 NIO 进行了极大的扩展，增强了对文件处理和文件系统特性的支持

### 核心 API

早期的 Java 只提供了一个 File 类来访问文件系统，但 File 类的功能比较有限，所提供的方法性能也不高。而且大多数方法出错时并不提供具体异常信息

NIO2 为了弥补这种不足，引入了 Path 接口，代表一个平台无关的平台路径，描述了目录结构中文件的位置。Path 可以看成是 File 类的升级版本，实际引用的资源可以不存在

Path 常用方法：

- `String toString()`：返回调用 Path 对象的字符串表示形式
- `boolean startsWith(String path)`：判断是否以 path 路径开始
- `boolean endsWith(String path)`：判断是否以 path 路径结束
- `boolean isAbsolute())`：判断是否是绝对路径
- `Path getParent()`：返回 Path 对象包含整个路径,不包含 Path 对象指定的文件路径
- `Path getRoot()`：返回调用 Path 对象的根路径
- `Path getFileName()`：返回与调用 Path 对象关联的文件名
- `int getNameCount()`：返回 Path 根目录后面元素的数量
- `Path getName(int idx)`：返回指定索引位置 idx 的路径名称
- `Path toAbsolutePath()`：作为绝对路径返回调用 Path 对象
- `Path resolve(Path p)`：合并两个路径,返回合并后的路径对应的 Path 对象
- `File toFile()`：将 Path 转化为 File 类的对象

## 使用第三方 jar 包操作文件

`apache.commons.io`

## 涉及垃圾回收的说明

垃圾回收机制关键点：

- 垃圾回收机制只回收 JVM 堆内存里的对象空间。
- 对其他物理连接，比如数据库连接、输入流输出流、Socket 连接无能为力
- 现在的 JVM 有多种垃圾回收实现算法，表现各异
- 垃圾回收发生具有不可预知性，程序无法精确控制垃圾回收机制执行
- 可以将对象的引用变量设置为 null，暗示垃圾回收机制可以回收该对象
- 程序员可以通过 `System.gc()` 或者 `Runtime.getRuntime().gc()` 来通知系统进行垃圾回收，会有些效果，但是系统是否进行垃圾回收依然不确定
- 垃圾回收机制回收任何对象之前，总会先调用它的 `finalize` 方法（如果覆盖该方法，让一个新的引用变量重新引用该对象，则会重新激活对象）
