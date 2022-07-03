
## `PING`

`PING` 命令是我们常用的判断主机之间网络是否畅通，同样也是能判断我们的目标主机是否存活

```kali  
┌──(root xuegod53)-[~]
└─# ping 192.168.1.1 -c 1
PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data.
64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=1.24 ms
```

我们从当前主机到目标主机之间肯定要经过很多网络设备，我们怎么才能知道中间经过了哪些网络设备？

### `Traceroute` 命令也可以对路由进行跟踪

```kali  
┌──(root xuegod53)-[~]
└─# traceroute xuegod.cn
```

<img src="assets/image/渗透测试系统Kali_Linux/基于ping命令的探测/Traceroute 命令对路由进行跟踪.png" alt="Traceroute 命令对路由进行跟踪" align=center />

然而 `PING` 命令也延伸出了很多其他的命令，如 `ARPING`、`FPING`、`HPING` 等


## `ARPING`

### `ARP` 协议概述：
ARP 协议是`Address Resolution Protocol`（**地址解析协议**）的缩写。计算机通过 `ARP` 协议将 `IP` 地址转换成 `MAC` 地址

### `ARP` 协议工作原理

在以太网中，数据传输的目标地址是 `MAC` 地址，一个主机要和另一个主机进行直接通信，必须要知道目标主机的 `MAC` 地址

计算机使用者通常只知道目标机器的 `IP` 信息，**地址解析**就是主机在发送帧前将目标 `IP` 地址转换
成目标 `MAC` 地址的过程

> [!note|style:flat]
> 简单地说，`ARP` 协议主要负责将局域网中的 32 位 `IP` 地址转换为对应的 `48` 位物理地址，即网卡的`MAC` 地址，保障通信顺利进行

`arp` 工作原理如下

<img src="assets/image/渗透测试系统Kali_Linux/基于ping命令的探测/arp 工作原理.png" alt="arp 工作原理" align=center />

使用 `arping` 命令查看局域网(内网)中的 `IP` 是否有冲突，**如果有一样的ip存在，可能是被arp发起的攻击**

```kali  
┌──(root㉿kali)-[~]
└─# arping 192.168.43.1 -c 1	 # -c 参数表示发送的次数，我们只需要 1 次即可
ARPING 192.168.43.1
60 bytes from 00:50:56:e2:99:01 (192.168.43.1): index=0 time=93.040 usec
60 bytes from 00:50:56:c0:00:08 (192.168.43.1): index=1 time=213.147 usec

--- 192.168.43.1 statistics ---
1 packets transmitted, 2 packets received,   0% unanswered (1 extra)
rtt min/avg/max/std-dev = 0.093/0.153/0.213/0.060 ms
```

对 `arping` 命令的结果进行筛选，只取 `ip` 地址

```kali  
┌──(root㉿kali)-[~]
└─# arping -c 1 192.168.43.1 | grep "bytes from" | cut -d" " -f 5 | cut -d "(" -f 2 | cut -d")" -f 1 

192.168.43.1
192.168.43.1
```

### 通过脚本实现`arp`自动扫描所有在线存活的主机

我们发现 `arping` 只能对一个 `ip` 地址进行判断，这个时候我们就需要通过脚本来实现对所有在线存活的主机自动扫描

```kali
┌──(root xuegod53)-[~]
└─# vim arping1.sh #插入以下代码内容
```

```kali
#!/bin/bash
if [ "$#" -ne 1 ];then #判断用户是否输入了至少一个参数如果没有输入参数，输出提示信息并退出
	echo "使用语法： ./arping.sh [设备名称]"
	echo "例如： ./arping.sh eth0"
	echo "使用实例对分配eth0的本地子网在线存活的主机进行ARP扫描"
	exit
fi

interface=$1 #将用户输入的参数传递给 interface 变量
prefix=$(ifconfig $interface | grep "inet " | cut -d 't' -f 2 | cut -d '.' -f 1-3) #获取本机IP地址网段 192.168.1
#对整个网段进行 arping
for addr in $(seq 1 254);do 
	arping -c 1 $prefix.$addr | grep "bytes from" | cut -d" " -f 5 | cut -d "(" -f 2 | cut -d")" -f 1 
done
```

粘贴完成后检查有没有粘贴错误的地方，按 `esc` 输入 `：wq` 保存退出。给我们写好的脚本加上执行权限，我们 linux 中可执行程序需要拥有执行权限才可以直接执行

```kali
┌──(root xuegod53)-[~]
└─# chmod +x arping1.sh		# 修改为可执行权限
```

```kali
┌──(root㉿kali)-[~]
└─# ./arping.sh eth0		# 执行脚本文件

192.168.43.1
192.168.43.1				#注如果出现两个一样的 IP 地址，就是有 ARP 攻击了
192.168.43.254		
```

<img src="assets/image/渗透测试系统Kali_Linux/基于ping命令的探测/ARP 攻击.png" alt="ARP 攻击" align=center />


## 使用 `netdiscover` 进行被动方式探测局域中存活的机器

`netdiscover` 是一个主动/被动的 `ARP` 侦查工具。使用 `netdiscover` 工具可以在网络上扫描 `IP` 地
址，检查在线主机或搜索为它们发送的 `ARP` 请求


> **主动模式**：主动模式顾名思义就是主动的探测发现网络内主机，但是这种方式往往会引起网络管理员的注意

> [!note|style:flat]
> `192.168.1.0/24`代表什么意思呢<br/>
> 它表示的是一个`IP`网段，起始`IP`为`192.168.1.1`，子网掩码是`24`位，我们都知道计算机里的数据都是用`0`和`1`来表示的，用`4`个字节，也就是`32`位表示一个`IP`地址，子网掩码`24`位代表从高位到低位连续的`1`的个数为`24`个，二进制表示即`11111111 11111111 11111111 00000000`，也就是`255.255.255.0`


```kali
参数：-i 设备: 你的网络设备
	 -r 范围: 扫描指定范围，而不是自动扫描. 192.168.6.0/24,/16,/8

┌──(root xuegod53)-[~]
└─# netdiscover -i eth0 -r 192.168.1.0/24		# 主动模式发送arp数据包扫描局域中存活的机器
```

<img src="assets/image/渗透测试系统Kali_Linux/基于ping命令的探测/netdiscover主动扫描.png" alt="netdiscover主动扫描" align=center />


> **被动模式**：被动模式的方法更加隐蔽，但是速度会比较慢，网卡被设置为混杂模式来侦听网络内的 `arp` 数据包进行被动式探测，这种方式就需要网络内设备发送 `arp` 包才能被探测到

```kali
参数：-p 被动方式: 什么数据都不发送, 只嗅探

┌──(root xuegod53)-[~]
└─# netdiscover -p		# 被动模式扫描局域中存活的机器，需要网络内设备发送arp包才能被探测到
```

<img src="assets/image/渗透测试系统Kali_Linux/基于ping命令的探测/netdiscover被动扫描.png" alt="netdiscover被动扫描" align=center />


## `HPING3`<span style='color: red'>注意：该命令可为攻击命令，注意使用</span>

`hping3` 是一个命令行下使用的 `TCP/IP` 数据包组装/分析工具，通常 `web` 服务会用来做压力测试使
用，也可以进行 `DOS` 攻击的实验。**同样 `Hping` 只能每次扫描一个目标**

### 使用 `HPING` 进行压力测试


> 我们先测试网站正常访问http://www.xuegod.cn/

对 `xuegod.cn` 进行压力测试


```kali
参数：
-c 1000 = 发送的数据包的数量。
-d 120 = 发送到目标机器的每个数据包的大小。单位是字节
-S = 只发送 SYN 数据包。
-w 64 = TCP 窗口大小。
-p 80 = 目的地端口(80 是 WEB 端口)。你在这里可以使用任何端口。
--flood = 尽可能快地发送数据包，不需要考虑显示入站回复。洪水攻击模式。
--rand-source = 使用随机性的源头 IP 地址。这里的伪造的 IP 地址，只是在局域中伪造。通过路由器后，还会还原成真实的 IP 地址。

┌──(root xuegod53)-[~]
└─# hping3 -c 1000 -d 120 -S -w 64 -p 80 --flood --rand-source xuegod.cn
```

<img src="assets/image/渗透测试系统Kali_Linux/基于ping命令的探测/使用网络分析工具查看数据包.png" alt="使用网络分析工具查看数据包" align=center />

`xuegod.cn` 目标地址

<img src="assets/image/渗透测试系统Kali_Linux/基于ping命令的探测/hping3压力测试.png" alt="hping3压力测试" align=center />

我们再次刷新网页发现已经打不开了

<img src="assets/image/渗透测试系统Kali_Linux/基于ping命令的探测/刷新网页.png" alt="刷新网页" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/基于ping命令的探测/网站崩溃.png" alt="网站崩溃" align=center />

`Ctrl+c` 停止后即可访问网站


## 使用 `FPING` 查看局域中运行了哪些机器

`Fping` 就是 `ping` 命令的加强版他可以对一个 `IP` 段进行 `ping` 扫描，而 `ping` 命令本身是不可以对网段进行扫描的

> [!note|style:flat]
> `192.168.1.0/24`代表什么意思呢<br/>
> 它表示的是一个`IP`网段，起始`IP`为`192.168.1.1`，子网掩码是`24`位，我们都知道计算机里的数据都是用`0`和`1`来表示的，用`4`个字节，也就是`32`位表示一个`IP`地址，子网掩码`24`位代表从高位到低位连续的`1`的个数为`24`个，二进制表示即`11111111 11111111 11111111 00000000`，也就是`255.255.255.0`

```kali
-a 表示只显示存活主机
-g 表示对地址段进行扫描如果不加可以对某个 IP 进行扫描
>fping.txt 表示将扫描的结果重定向到 fping.txt ，原因是如果扫描一个网段的话输出结果是非常多的，我们输出重定向到文件中只会获得存活的主机信息

┌──(root xuegod53)-[~]
└─# fping -ag 192.168.1.0/24 -c 1 > fping.txt

或

┌──(root xuegod53)-[~]
└─# fping -ag 192.168.1.1 192.168.1.254 -c 1 > fping.txt
```

```kali
┌──(root xuegod53)-[~]
└─# cat fping.txt
```

<img src="assets/image/渗透测试系统Kali_Linux/基于ping命令的探测/显示存活的主机.png" alt="显示存活的主机" align=center />

