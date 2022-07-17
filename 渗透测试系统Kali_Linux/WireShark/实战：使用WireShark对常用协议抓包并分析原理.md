
> [!note|style:flat]
> 协议分析的时候我们关闭混淆模式，避免一些干扰的数据包存在。

## 常用协议分析-`ARP` 协议


> **地址解析协议**（英语：`Address Resolution Protocol`，缩写：`ARP`）是一个通过解析网络层地址来 找寻数据链路层地址的网络传输协议，它在 `IPv4` 中极其重要。`ARP` 是通过网络地址来定位 `MAC` 地址。

开始抓包---过滤 `arp`

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-ARP 协议/过滤 arp.png" alt="过滤 arp" align=center />


> **使用 `nmap` 来基于 `ARP` 协议进行扫描**

```kali
┌──(root➓ xuegod53)-[~] 
└─# nmap -sn 192.168.1.1
```

看一下抓取到的数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-ARP 协议/抓取数据包.png" alt="抓取数据包" align=center />

###### 分析第一个请求包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-ARP 协议/分析请求包.png" alt="分析请求包" align=center />

查看 `Address Resolution Protocol (request) ARP` 请求包内容：

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-ARP 协议/查看请求包内容.png" alt="查看请求包内容" align=center />

```kali
Address Resolution Protocol (request) 	# ARP 地址解析协议 request 表示请求包 
Hardware type: Ethernet (1) 			  # 硬件类型 
Protocol type: IPv4 ( 0x0800 ) 		   # 协议类型 
Hardware size: 6 						 # 硬件地址 
Protocol size: 4 						 # 协议长度 
Opcode:_ request ( 1 ) 				   # 操作码，该值为 1 表示 ARP 请求包 
Sender MAC address: VMware_f1:35:ee (00:0c:29:f1:35:ee) 	# 源 MAC 地址 
Sender IP address: 192.168.1.53  		 # 源 IP 地址 
Target MAC address: 00:00:00_ 00: 00:00 (00: 00: 00 :00: 00:00) 	# 目标 MAC 地址 
Target IP address: 192.168.1.1 		   # 目标 IP 地址
```

###### 我们来分析第二个数据包 `ARP` 的应答数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-ARP 协议/分析ARP的应答数据包.png" alt="分析ARP的应答数据包" align=center />

查看： `Address Resolution Protocol (reply) ARP` 地址解析协议

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-ARP 协议/查看ARP应答包内容.png" alt="查看ARP应答包内容" align=center />

```kali
Address Resolution Protocol (reply) 	#ARP 地址解析协议 reply 表示回复包 
Hardware type: Ethernet (1) 			#硬件类型 
Protocol type: IPv4 ( 0x0800 ) 		 #协议类型 
Hardware size: 6 					   #硬件地址 
Protocol size: 4 					   #协议长度 
Opcode:_ reply ( 2 ) 				   #操作码，该值为 2 表示 ARP 回复包 
Sender MAC address: XXXXXXXXXXXX (9c:61:21:75:55:50) 	   #源 MAC 地址 
Sender IP address: 192.168.1.1 							 #源 IP 地址 
Target MAC address: VMware_f1:35:ee (00:0c:29:f1:35:ee) 	#目标 MAC 地址 
Target IP address: 192.168.1.53 							#目标 IP 地址
```

> [!tip|style:flat]
> 总结：我们可以看到到应答包补全了自己的 `MAC` 地址，目的地址和源地址做了替换


###### 看两个数据包的请求和过程

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-ARP 协议/数据包的请求和过程.png" alt="数据包的请求和过程" align=center />

```kali
192.168.1.53 广播：谁有 192.168.1.1 的 MAC 地址？ 
192.168.1.1 应答：192.168.1.1 的 MAC 地址是 xxxxxxxxxxx
```

## 常用协议分析-`ICMP` 协议

我们把之前的数据包清空掉然后筛选 `ICMP` 协议的数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-ICMP 协议/筛选 ICMP 协议的数据包.png" alt="筛选 ICMP 协议的数据包" align=center />

打开一个终端

```kali
┌──(root➓ xuegod53)-[~] 
└─# ping xuegod.cn -c 1
```

> **我们只发送一个 `ping` 包，方便我们分析发送完之后停止抓包即可**

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-ICMP 协议/发送 ping 包.png" alt="发送 ping 包" align=center />

我们先看请求包的内容我们可以看到这是个 **4 层的协议包**

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-ICMP 协议/4 层协议包.png" alt="4 层协议包" align=center />

###### `ICMP` 协议分析请求包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-ICMP 协议/ICMP 协议分析请求包.png" alt="ICMP 协议分析请求包" align=center />

###### `ICMP` 协议分析应答包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-ICMP 协议/ICMP 协议分析应答包.png" alt="ICMP 协议分析应答包" align=center />

> [!tip|style:flat]
> 工作过程：
> 本机发送一个 `ICMP Echo Request` 的包 接收方返回一个 `ICMP Echo Reply`，包含了接受到数据拷贝和一些其他指令


## 常用协议分析-`TCP` 协议

首先是清空数据包然后筛选 `tcp` 开始抓包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/筛选 tcp 开始抓包.png" alt="筛选 tcp 开始抓包" align=center />


> **模拟一下 `tcp` 会话建立，通过 `Xshell` 远程连接 `Kali Linux` 就会捕获到完整的 `TCP3` 次握手的链接。**

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/Xshell 远程连接.png" alt="Xshell 远程连接" align=center />

抓完数据包之后我们就停止抓包，开始分析 `TCP` 的数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/分析 TCP 的数据包.png" alt="分析 TCP 的数据包" align=center />

`TCP` 协议最核心的概念无非就是 3 次握手 4 次断开，先看 `TCP` 的 3 次握手

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/TCP 的 3 次握手.png" alt="TCP 的 3 次握手" align=center />

###### 看第一个数据包 `SYN` 数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/看第一个数据包 SYN 数据包.png" alt="看第一个数据包 SYN 数据包" align=center />

打开标志位的详细信息

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/打开标志位的详细信息.png" alt="打开标志位的详细信息" align=center />

> [!tip|style:flat]
> 我们从以上信息就可以看出这是一个 `SYN` 数据包，`SYN=1` 表示发送一个链接请求。这时 `Seq` 和 `ACK` 都是 `0`

###### 分析第二个数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/分析第二个数据包.png" alt="分析第二个数据包" align=center />

`Flags` 位信息

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/Flags 位信息.png" alt="Flags 位信息" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/ACK响应第3帧请求.png" alt="ACK响应第3帧请求" align=center />

我们可以看到服务端收到`SYN`连接请求返回的数据包`SYN=1,ACK=1` 表示回应第一个`SYN`数据包。

###### 看第三个数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/看第三个数据包.png" alt="看第三个数据包" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/第三包 Flags 位信息.png" alt="第三包 Flags 位信息" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/响应第4帧.png" alt="响应第4帧" align=center />

三次握手过程就结束了。

###### 生成一个图表来观察数据交互的过程

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/流量图.png" alt="流量图" align=center />

点击显示过滤器

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/显示过滤器.png" alt="显示过滤器" align=center />

前面 `3` 个就是 `TCP` 建立链接的过程，后面的就是相互通信的过程了这个时候 `seq` 就会根据数据包的大小改变。

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/TCP 建立链接的过程.png" alt="TCP 建立链接的过程" align=center />

清空一下数据包来看一下断开链接是一个什么样的过程

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/搜索tcp数据包.png" alt="搜索tcp数据包" align=center />

我们在 `Xshell` 窗口中输入 `exit` 退出

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/Xshell 窗口中输入 exit 退出.png" alt="Xshell 窗口中输入 exit 退出" align=center />

重新到 `WireShark` 生成图标

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/到 WireShark 生成图标.png" alt="到 WireShark 生成图标" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-TCP 协议/查看 TCP 链接的过程.png" alt="查看 TCP 链接的过程" align=center />


分析一下过程，我们在终端输入 `EXIT` 实际上是在我们 `Kali` 上执行的命令，表示我们 `SSHD` 的 `Server` 端向客户端发起关闭链接请求。


> **第一次挥手**：服务端发送一个`FIN+ACK`，表示自己没有数据要发送了，想断开连接，并进入 `FIN_WAIT_1` 状态
> 
> **第二次挥手**：客户端收到 `FIN` 后，知道不会再有数据从服务端传来，发送 `ACK` 进行确认，确认序号 为收到序号`+1`（与 `SYN` 相同，一个 `FIN` 占用一个序号），客户端进入 `CLOSE_WAIT` 状态。
> 
> **第三次挥手**：客户端发送 `FIN+ACK` 给对方，表示自己没有数据要发送了，客户端进入 `LAST_ACK` 状态，然后直接断开 `TCP` 会话的连接，释放相应的资源。
> 
> **第四次挥手**：服务端收到了客户端的 `FIN` 信令后，进入 `TIMED_WAIT` 状态，并发送 `ACK` 确认消息。服务端在 `TIMED_WAIT` 状态下，等待一段时间，没有数据到来，就认为对面已经收到了自己发送的 `ACK` 并正确关闭了进入 `CLOSE` 状态，自己也断开了 `TCP` 连接，释放所有资源。当客户端收到服务端的 `ACK` 回应后，会进入 `CLOSE` 状态并关闭本端的会话接口，释放相应资源。


## 常用协议分析-`HTTP` 协议


> **我们还是筛选 `TCP` 协议因为 `HTTP` 是 `TCP` 的上层协议，所以我们过滤 `TCP` 的数据会包含 `HTTP` 协 议的数据包**

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-HTTP 协议/过滤 TCP 的数据会包含 HTTP 协 议的数据包.png" alt="过滤 TCP 的数据会包含 HTTP 协 议的数据包" align=center />

打开一个终端输入下面命令

```kali
参数说明：
curl 是一个在命令行下工作的文件传输工具，我们这里用来发送 http 请求 
-I 大写的 i 表示仅返回头部信息。

┌──(root➓ xuegod53)-[~] 
└─# curl -I baidu.com
```

可以看到我们抓到了 `TCP` 的 `3` 次握手 `4` 次断开

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-HTTP 协议/TCP 的 3 次握手 4 次断开.png" alt="TCP 的 3 次握手 4 次断开" align=center />

第 4 个和第 6 个是我们的 `HTTP` 数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：使用WireShark对常用协议抓包并分析原理/常用协议分析-HTTP 协议/HTTP 数据包.png" alt="HTTP 数据包" align=center />


> **第一步**：我们发送了一个 `HTTP` 的 `HEAD` 请求
> 
> **第二步**：服务器收到我们的请求返回了一个 `Seq/ACK` 进行确认
> 
> **第三步**：服务器将 `HTTP` 的头部信息返回给我们客户端 状态码为 `200` 表示页面正常
> 
> **第四步**：客户端收到服务器返回的头部信息向服务器发送 `Seq/ACK` 进行确认

发送完成之后客户端就会发送 `FIN/ACK` 来进行关闭链接的请求。



