---
title: 第一个 ns3 脚本
date: 2020-06-28 09:20:58
tags:
  - 计算机网络
  - ns3 网络模拟软件
categories:
  - 踩坑
---

你的第一个 ns3 脚本

<!--more-->

## 注意

这个脚本是 `ns-*/examples/first.cc`，是官方示例，本文对于这个脚本进行讲解，大部分是 Google 翻译的，来源见[参考](#参考)

本文的 `ns3` 版本为 3.30.1，**不同版本的脚本可能会不相同**，请参考官方的最新文档

## 前提

请确认你已经完成了 `./waf -d debug --enable-examples --enable-tests configure`

为了配置项目以执行包含示例和测试的调试版本。还需要执行 `./waf` 来建立项目。因此，现在如果您查看目录 `../../build/debug/ns3`，您将找到[模块包含](#模块包含)中的四个模块包含文件。您可以查看这些文件的内容，发现它们确实在其各自的模块中包含了所有公共包含文件。

## 模块包含

```c++
#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/applications-module.h"
```

为了帮助我们的高级脚本用户处理系统中存在的大量包含文件，我们根据相对较大的模块对包含进行分组。我们提供了一个包含文件，该文件将递归加载每个模块中使用的所有包含文件。不必精确地查找所需的头文件，也不必正确地获取许多依赖关系，而是使您能够以较大的粒度加载一组文件。这不是最有效的方法，但是它无疑使编写脚本变得更加容易。

在构建过程中，每个 ns3 包含文件都放置在一个名为 `ns3` 的目录中（在构建目录下），以帮助避免包含文件名冲突。`ns3/core-module.h`文件与 ns3 模块相对应，您可以在下载的发行版本的 `src/core` 目录中找到该文件。如果列出此目录，则会发现大量的头文件。进行构建时，`Waf` 会根据您的配置将公共头文件放在相应的 `build/debug` 或 `build/optimized` 目录下的 `ns3` 目录中。`Waf` 还将自动生成一个模块包含文件，以加载所有公共头文件。

## ns3 命名空间

```c++
using namespace ns3;
```

`ns3` 的实现是在 `ns3` 的命名空间实现的，所以先导入命名空间，之后就不使用复杂的 `ns3::` 了。如果你不明白这个请参考 c++ 的 `using namespace std;`

## 日志

```c++
NS_LOG_COMPONENT_DEFINE ("FirstScriptExample");
```

可以查阅官方文档来了解函数的作用，这条语句是通过引用特定名称来启用和禁用控制台消息日志记录

## main 函数

首先声明 main 函数，就像其他的 c++ 文件一样

```c++
int
main (int argc, char *argv[])
{
```

将时间分辨率设置为 1 纳秒，同时 1 纳秒也是默认值

```c++
Time::SetResolution (Time::NS);
```

分辨率是可以表示的最小时间值（以及两个时间值之间的最小可表示差异）。您可以只更改一次分辨率。实现这种灵活性的机制有点占用内存，因此，在明确设置分辨率后，我们将释放内存，以防止进一步的更新。（如果未明确设置分辨率，则默认为一纳秒，并且在模拟开始时会释放内存。）

下两行用于启用 `Echo Client` 和 `Echo Server` 应用程序中内置的两个日志记录组件：

```c++
LogComponentEnable("UdpEchoClientApplication", LOG_LEVEL_INFO);
LogComponentEnable("UdpEchoServerApplication", LOG_LEVEL_INFO);
```

如果阅读了日志记录组件文档，会发现可以在每个组件上启用许多级别的日志记录详细程度/详细信息。这两行代码为回显客户端和服务器启用了 INFO 级别的调试日志记录。这将让应用程序在仿真期间发送和接收数据包时打印出消息。

接下来，我们将直接从事创建拓扑和运行仿真的工作。我们使用拓扑帮助器对象使这项工作尽可能容易。

## 拓补助手

### NodeContainer

接下来两行代码实际上将创建 ns-3 Node 对象，该对象代表模拟中的计算机。

```c++
NodeContainer nodes;
nodes.Create (2);
```

在继续之前，让我们找到 `NodeContainer` 类的文档。进入给定类的文档的另一种方法是通过 `Doxygen` 页面中的 `Classes` 选项卡。应该看到出现了一组新的选项卡，其中一个是“类列表”。在该选项卡下，您将看到所有 ns-3 类的列表。向下滚动，找到 `ns3::NodeContainer`。

节点是我们的关键抽象之一。这表示一类的计算机，我们将向其中添加协议栈，应用程序和外围设备卡。`NodeContainer` 拓扑帮助器提供了一种方便的方法来创建，管理和访问我们为运行模拟而创建的任何 `Node` 对象。上面的第一行只声明了一个 `NodeContainer`，我们称之为节点。第二行在节点对象上调用 `Create` 方法，并要求容器创建两个节点。如文档中所述，这个容器将调用 `ns3` 系统，以适当地创建两个 `Node` 对象，并在内部存储指向这些对象的指针。

脚本中的节点不执行任何操作。构建拓扑的下一步是将我们的节点连接到网络中。我们支持的最简单的网络形式是两个节点之间的单点对点链接。我们将在此处构建这些链接之一。

### PointToPointHelper

我们正在以一种您会非常熟悉的模式构建点对点连接，使用拓扑帮助器对象来完成将链接放在一起所需的低级工作。回想一下，我们的两个关键抽象是 `NetDevice` 和 `Channel`。在现实世界中，这些术语大致对应于外围卡和网络电缆。通常，这两件事紧密地绑在一起，不能互换，例如，以太网设备和无线通道。我们的拓扑助手遵循这种紧密的联系，因此您将使用单个 `PointToPointHelper` 在此脚本中配置和连接 `ns-3 PointToPointNetDevice` 和 `PointToPointChannel` 对象。

```c++
PointToPointHelper pointToPoint;
pointToPoint.SetDeviceAttribute ("DataRate", StringValue ("5Mbps"));
pointToPoint.SetChannelAttribute ("Delay", StringValue ("2ms"));
```

第一行，实例化堆栈上的 `PointToPointHelper` 对象。

第二行，告诉 `PointToPointHelper` 对象在创建 `PointToPointNetDevice` 对象时将值“5Mbps”（每秒 5 兆位）用作 `DataRate`。

从更详细的角度来看，字符串 `DataRate` 对应于我们所谓的 `PointToPointNetDevice` 的 `Attribute`。如果查看类 `ns3::PointToPointNetDevice` 的文档并找到 `GetTypeId` 方法的文档，则会找到为设备定义的属性列表。其中包括 `DataRate` 属性。大多数用户可见的 `ns3` 对象都有相似的属性列表。我们将使用此机制轻松配置仿真而无需重新编译。

第三行就是指定延迟属性，告诉 `PointToPointHelper` 使用值“2ms”（两毫秒）作为其随后创建的每个点对点通道的传播延迟的值。

### NetDeviceContainer

在脚本的这一点上，我们有一个包含两个节点的 `NodeContainer`。我们有一个准备好的 `PointToPointHelper`，可以用来制作 `PointToPointNetDevices` 并在它们之间连接 `PointToPointChannel` 对象。就像我们使用 `NodeContainer` 拓扑帮助对象创建用于仿真的节点一样，我们将要求 `PointToPointHelper` 完成为我们创建，配置和安装设备的工作。我们将需要具有所有已创建的 `NetDevice` 对象的列表，因此我们使用 `NetDeviceContainer` 来保存它们，就像使用 `NodeContainer` 来保存所创建的节点一样。以下两行代码，

```c++
NetDeviceContainer devices;
devices = pointToPoint.Install (nodes);
```

将完成设备和通道的配置。第一行声明上述设备容器，第二行进行繁重的操作。`PointToPointHelper` 的 `Install` 方法将 `NodeContainer` 作为参数。在内部，将创建一个 `NetDeviceContainer`。对于 `NodeContainer` 中的每个节点（点对点链接必须恰好有两个），将创建一个 `PointToPointNetDevice` 并将其保存在设备容器中。创建一个 `PointToPointChannel` 并连接了两个 `PointToPointNetDevices`。当由 `PointToPointHelper` 创建对象时，先前在帮助器中设置的属性用于初始化创建的对象中的相应属性。

执行 `pointToPoint.Install (nodes)` 调用之后，我们将有两个节点，每个节点都具有一个已安装的点对点网络设备以及它们之间的单个点对点通道。两个设备都将配置为以每秒 5 兆位的速度在具有 2 毫秒传输延迟的通道上传输数据。

### InternetStackHelper

现在，我们已经配置了节点和设备，但是我们的节点上没有安装任何协议栈。接下来的两行代码将解决这一问题。

```c++
InternetStackHelper stack;
stack.Install (nodes);
```

`InternetStackHelper` 是一个拓扑帮助程序，它用于 `Internet` 堆栈，而 `PointToPointHelper` 则是点对点网络设备。`Install` 方法将 `NodeContainer` 作为参数。执行后，它将在节点容器中的每个节点上安装 Internet 堆栈（TCP，UDP，IP 等）。

### Ipv4AddressHelper

接下来，我们需要将节点上的设备与 IP 地址相关联。我们提供了一个拓扑助手来管理 IP 地址的分配。唯一用户可见的 API 是设置在执行实际地址分配时使用的基本 IP 地址和网络掩码（这是在助手内部的较低级别完成的）

```c++
Ipv4AddressHelper address;
address.SetBase ("10.1.1.0", "255.255.255.0");
Ipv4InterfaceContainer interfaces = address.Assign (devices);
```

声明一个 `Ipv4AddressHelper` 对象，并告诉它应该开始使用掩码 `255.255.255.0` 从网络 `10.1.1.0` 分配 IP 地址，以定义可分配的位。默认情况下，分配的地址将从 1 开始并单调增加，因此从该基址分配的第一个地址将是 `10.1.1.1`，然后是 `10.1.1.2`，依此类推。底层 `ns3` 系统实际上会记住分配的所有 IP 地址，如果您不小心使同一地址产生两次，将会产生致命错误（顺便说一句，这很难调试）。

下一行，执行实际的地址分配。在 `ns3` 中，我们使用 `Ipv4Interface` 对象在 IP 地址和设备之间建立关联。就像有时我们需要由助手创建的网络设备列表以供将来参考时，有时我们也需要 `Ipv4Interface` 对象的列表。`Ipv4InterfaceContainer` 提供了此功能。

现在，我们已经建立了一个点对点网络，安装了堆栈并分配了 IP 地址。此时，我们需要生成流量的应用程序。

## 应用程序

ns3 系统的另一个核心抽象是应用程序。在此脚本中，我们使用 ns3 核心应用程序类 `UdpEchoServerApplication` 和 `UdpEchoClientApplication` 的两个特化。就像前面的解释一样，我们使用辅助对象来帮助配置和管理基础对象。在这里，我们使用 `UdpEchoServerHelper` 和 `UdpEchoClientHelper` 对象来让模拟更简单。

### UdpEchoServerHelper

示例脚本 `first.cc` 中的以下代码行用于在我们先前创建的节点之一上设置 UDP 回显服务器应用程序（Udp echo server application）。

```c++
UdpEchoServerHelper echoServer (9);

ApplicationContainer serverApps = echoServer.Install (nodes.Get (1));
serverApps.Start (Seconds (1.0));
serverApps.Stop (Seconds (10.0));
```

上面代码段的第一行代码声明了 `UdpEchoServerHelper`。和往常一样，这不是应用程序本身，而是用于帮助我们创建实际应用程序的对象。我们的约定之一是将必需的属性放在辅助构造函数中。在这种情况下，除非提供了客户端也知道端口号，否则该帮助程序将无济于事。我们需要将端口号作为构造函数的参数，而不是只是选择一个并希望一切都能解决。反过来，构造函数只对传递的值执行 `SetAttribute`。如果需要，可以稍后使用 `SetAttribute` 将 `Port` 属性设置为另一个值。

与许多其他帮助器对象相似，`UdpEchoServerHelper` 对象具有 `Install` 方法。正是此方法的执行实际上导致实例化基础回显服务器应用程序并将其附加到节点。有趣的是，就像我们已经看到的其他 `Install` 方法一样，`Install` 方法将 `NodeContainter` 作为参数。这实际上是传递给方法的内容，即使在这种情况下看起来也不是这样。这里有一个 C++隐式转换正在工作，该转换获取 `node.Get(1)`的结果（返回指向节点对象的智能指针— `Ptr <Node>`），并将其用于构造函数中，然后传递给未命名的 `NodeContainer`。安装。如果您不知所措地在 C++代码中找到了可以编译并运行得很好的特定方法签名，请寻找这些隐式转换。

现在，我们看到 `echoServer.Install` 将在用于管理节点的 `NodeContainer` 的索引号为 1 的节点上安装 `UdpEchoServerApplication`。`Install` 将返回一个容器，该容器保存由助手创建的所有应用程序的指针（在本例中，因为我们传递了一个包含一个节点的 `NodeContainer`，所以指向一个应用程序）。

应用程序需要一些时间来“开始”生成流量，并且可能需要花费一些时间来“停止”。我们都提供。这些时间是使用 `ApplicationContainer` 方法 `Start` 和 `Stop` 设置的。这些方法采用时间参数。在这种情况下，我们使用显式的 C++ 转换序列获取 C++ 浮点数 1.0，并使用 `Seconds` 强制转换将其转换为 `ns3` 的 `Time`对象。请注意，转换规则可能由模型作者控制，并且 C++ 有其自己的规则，因此您不能总是仅假设参数将为您自动地转换。

第四行和第五行将导致回显服务器应用程序在仿真中的一秒钟启动（启用自身），并在仿真中的十秒钟停止（禁用自身）。由于我们已经声明了要在十秒执行的模拟事件（应用程序停止事件），因此模拟将至少持续十秒钟。

### UdpEchoClientHelper

回显客户端应用程序的建立方法与服务器类似。有一个由 `UdpEchoClientHelper` 管理的基础`UdpEchoClientApplication`。

```c++
UdpEchoClientHelper echoClient (interfaces.GetAddress (1), 9);
echoClient.SetAttribute ("MaxPackets", UintegerValue (1));
echoClient.SetAttribute ("Interval", TimeValue (Seconds (1.0)));
echoClient.SetAttribute ("PacketSize", UintegerValue (1024));

ApplicationContainer clientApps = echoClient.Install (nodes.Get (0));
clientApps.Start (Seconds (2.0));
clientApps.Stop (Seconds (10.0));
```

但是，对于回显应用程序的客户端，我们需要设置五个不同的属性。前两个属性是在构造 `UdpEchoClientHelper` 时设置的。我们将传递的参数（用于内部）传递给助手，以根据我们的约定设置 `RemoteAddress` 和 `RemotePort` 属性，以在助手构造函数中创建所需的 `Attributes` 参数。

我们已经使用了 `Ipv4InterfaceContainer` 来跟踪分配给设备的 IP 地址。接口容器中的第 0 个接口将与节点容器中的第 0 个节点的 IP 地址相对应。接口容器中的第一接口对应于节点容器中第一节点的 IP 地址。因此，在第一行代码中（从上面开始），我们正在创建帮助程序并告诉它，因此将客户端的远程地址设置为分配给服务器所在节点的 IP 地址。我们还告诉它安排将数据包发送到端口 9。

`MaxPackets` 属性告诉客户端我们允许其在模拟过程中发送的最大数据包数。`Interval` 属性告诉客户端在数据包之间等待多长时间，`PacketSize` 属性告诉客户端其数据包有效载荷应该有多大。通过这种特殊的属性组合，我们告诉客户端发送一个 1024 字节的数据包。

与回显服务器端一样，我们告诉回显客户端启动和停止，但是在这里，我们在启用服务器后一秒钟（在仿真两秒钟后）启动客户端。

## 模拟器

此时，我们需要做的是实际运行仿真。这是使用全局函数 `Simulator::Run` 完成的。

```c++
Simulator::Run ();
```

当我们之前调用方法 `serverApps.Start` `serverApps.Stop` `clientApps.Start` `clientApps.Stop` 时，我们实际上将模拟器中的事件开始时间安排为 1.0 秒，2.0 秒，将两个事件安排为 10.0 秒。调用 `Simulator::Run` 时，系统将开始浏览预定事件列表并执行它们。首先，它将在 1.0 秒处运行事件，这将启用回显服务器应用程序（此事件可能进而安排许多其他事件）。然后它将运行安排在 t = 2.0 秒内的事件，这将启动回显客户端应用程序。同样，此事件可以安排更多事件。回显客户端应用程序中的开始事件实现将通过向服务器发送数据包来开始模拟的数据传输阶段。

将数据包发送到服务器的操作将触发一系列事件，这些事件将在后台自动安排，并将根据我们在脚本中设置的各种定时参数执行数据包回显的机制。

最终，由于我们只发送一个数据包（将 `MaxPackets` 属性设置为一个），因此由单个客户端回显请求触发的事件链将逐渐减少，并且模拟将进入空闲状态。一旦发生这种情况，剩下的事件将是服务器和客户端的 `Stop` 事件。当执行这些事件时，没有其他事件可处理，并且 `Simulator::Run` 返回。仿真完成。

剩下的就是清理。这是通过调用全局函数 `Simulator::Destroy` 来完成的。在执行辅助函数（或低级 `ns3` 代码）时，他们进行了排列，以便将钩子插入模拟器中以销毁所有已创建的对象。您不必自己跟踪任何这些对象-您要做的就是调用 `Simulator::Destroy` 并退出。`ns3` 系统为您处理了最困难的部分。我们第一个 `ns3` 脚本剩余的行 first.cc 就是这样做的：

```c++
  Simulator::Destroy ();
  return 0;
}
```

## 模拟器什么时候会停止

`ns3` 是离散事件（DE）模拟器。在这种模拟器中，每个事件都与其执行时间相关联，并且通过以模拟时间的时间顺序执行事件来进行模拟。事件可能会导致安排将来的事件（例如，计时器可能会将自己重新安排为在下一个时间间隔到期）。

初始事件通常由每个对象触发，例如，IPv6 将调度路由器广告，邻居请求等，应用程序调度第一个数据包发送事件等。

处理事件时，它可能会生成零个，一个或多个事件。在执行模拟时，将消耗事件，但是可能会（或可能不会）生成更多事件。当事件队列中没有其他事件时，或者发现特殊的 Stop 事件时，模拟将自动停止。`Stop` 事件是通过`Simulator::Stop(stopTime);`函数创建的。

在典型情况下，必须使用 `Simulator::Stop` 来停止模拟：发生自持事件时。自我维持（或重复发生）的事件是总是自行重新安排时间的事件。因此，它们始终将事件队列保持为非空。

有许多包含重复事件的协议和模块，例如：

- FlowMonitor-定期检查丢失的数据包
- RIPng-定期广播路由表更新

在这些情况下，必须使用 `Simulator::Stop` 才能正常停止模拟。另外，当 `ns3` 处于仿真模式时，使用 `RealtimeSimulator` 来使仿真时钟与机器时钟保持一致，并且 `Simulator::Stop` 是停止该过程所必需的。

本教程中的许多仿真程序都未明确调用 `Simulator::Stop`，因为事件队列将自动用尽事件。但是，这些程序还将接受对 `Simulator::Stop` 的调用。例如，第一个示例程序中的以下附加语句将安排在 11 秒时显式停止：

```c++
+  Simulator::Stop (Seconds (11.0));
   Simulator::Run ();
   Simulator::Destroy ();
   return 0;
 }
```

上面的内容实际上不会改变此程序的行为，因为此特定的模拟自然会在 10 秒后结束。但是，如果要将以上语句中的停止时间从 11 秒更改为 1 秒，您会注意到模拟会在任何输出打印到屏幕之前停止（因为输出发生在模拟时间的 2 秒左右）。

重要的是在调用 `Simulator::Run` 之前先调用 `Simulator::Stop`否则，`Simulator::Run` 可能永远不会将控制权返回给主程序以执行停止！

## 构建你的脚本

构建简单的脚本非常简单。您所要做的就是将脚本放到临时目录中，如果您运行 Waf，它将自动生成。试试吧切换回顶层目录后，将 `examples/tutorial/first.cc` 复制到 `scratch` 目录。

```bash
$ cp examples/tutorial/first.cc scratch/myfirst.cc
```

现在使用 waf 构建第一个示例脚本：

```bash
$ ./waf
Waf: Entering directory `/home/craigdo/repos/ns-3-allinone/ns-3-dev/build'
[614/708] cxx: scratch/myfirst.cc -> build/debug/scratch/myfirst_3.o
[706/708] cxx_link: build/debug/scratch/myfirst_3.o -> build/debug/scratch/myfirst
Waf: Leaving directory `/home/craigdo/repos/ns-3-allinone/ns-3-dev/build'
'build' finished successfully (2.357s)
```

现在，您可以运行该示例（请注意，如果在 `scratch` 目录中构建程序，则必须在 `scratch` 目录**外**运行该程序）：

```bash
$ ./waf --run scratch/myfirst
Waf: Entering directory `/home/craigdo/repos/ns-3-allinone/ns-3-dev/build'
Waf: Leaving directory `/home/craigdo/repos/ns-3-allinone/ns-3-dev/build'
'build' finished successfully (0.418s)
Sent 1024 bytes to 10.1.1.2
Received 1024 bytes from 10.1.1.1
Received 1024 bytes from 10.1.1.2
```

在这里，您会看到构建系统检查以确保已构建文件，然后运行它。您会看到 echo 客户端上的日志记录组件表明它已向 10.1.1.2 上的 Echo Server 发送了一个 1024 字节的数据包。您还可以看到回显服务器上的日志记录组件说它已从 10.1.1.1 接收到 1024 个字节。回显服务器以静默方式回显数据包，您会看到回显客户端日志，它已从服务器接收回数据包。

## 参考

[Conceptual Overview — Tutorial](https://www.nsnam.org/docs/release/3.30/tutorial/html/conceptual-overview.html#a-first-ns-3-script)

[NS-3 入门[2]脚本与编译运行-针挑土-51CTO 博客](https://blog.51cto.com/3240611/1641583)
