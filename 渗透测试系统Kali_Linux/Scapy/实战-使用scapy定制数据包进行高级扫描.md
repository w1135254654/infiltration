
## `scapy` 定制 `ARP` 协议

```kali
┌──(root xuegod53)-[~]
└─# scapy

INFO: Can't import PyX. Won't be able to use psdump() or pdfdump().

```

<img src="assets/image/渗透测试系统Kali_Linux/Scapy/scapy定制ARP协议/启动scapy.png" alt="启动scapy" align=center />

> [!tip|style:flat]
> 如果提示 INFO 找不到某个模块，可以使用 `apt install python3-pyx`<br/>
> 安装时我们输入 `exit（）` 退出 `scapy`

```kali
┌──(root xuegod53)-[~]
└─# apt install python3-pyx

再次进入就没有提示信息了

>>> exit()

```

我们使用 `ARP().display()`来查看 `ARP` 函数的用法

```kali
>>> ARP().display() 
###[ ARP ]### 
 hwtype= 0x1 	# 硬件类型
 ptype= 0x800    # 协议类型
 hwlen= 6 	   # 硬件地址长度（MAC）
 plen= 4 		# 协议地址长度（IP）
 op= who-has 	# who-has 查询
 hwsrc= 00:0c:29:6a:cf:1d 	# 源 MAC 地址
 psrc= 192.168.1.53 		  # 源 IP 地址
 hwdst= 00:00:00:00:00:00
 pdst= 0.0.0.0 			   # 向谁发送查询请求
```

使用`sr1` 函数向 `192.168.1.1` 发送 `arp` 请求的数据包


> **sr1 函数作用：sr1 函数包含了发送数据包和接收数据包的功能。**

```kali
>>> sr1(ARP(pdst="192.168.1.1"))
Begin emission:
Finished sending 1 packets.
*
Received 29 packets, got 1 answers, remaining 0 packets
<ARP hwtype=0x1 ptype=0x800 hwlen=6 plen=4 op=is-at hwsrc=f0:98:38:b8:e0:92 psrc=192.168.1.1 hwdst=00:0c:29:6a:cf:1d pdst=192.168.1.53 |<Padding load='\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00' |>>

>>> exit() # 退出 scapy
```

**注：发现源地址 `psrc=192.168.1.1`，说明已经收到网关的应答包**


## `scapy` 定制 `PING` 包

`Scapy` 的功能是非常强大的，我们前面只是简单的介绍了他的 `ARP` 探测方式，下面我们简单讲一下 `IP/ICMP` 的方式

下面两条命令可以直接看到我们的数据包格式

```kali
IP().display()
###[ IP ]### 
 version= 4 	  # 版本:4,即 IPv4
 ihl= None		# 首部长度
 tos= 0x0 		# 服务
 len= None 	   # 总长度
 id= 1 		   # 标识
 flags= 
 frag= 0 		 # 标志
 ttl= 64 		 # 生存时间
 proto= hopopt    # 传输控制协议 IPv6 逐跳选项
 chksum= None 	# 首部校验和
 src= 127.0.0.1   # 源地址
 dst= 127.0.0.1   # 目的地址
```

```kali
ICMP().display()
###[ ICMP ]### 
 type= echo-request 	# 类型，标识 ICMP 报文的类型
 code= 0 			   # 代码
 chksum= None 		  # 校验和
 id= 0x0 			   # 标识
 seq= 0x0
```

> [!note|style:flat]
>  `IP()`生成 `ping` 包的源 `IP` 和目标 `IP` ，`ICMP()` 生 `ping` 包的类型。使用 `IP()`和 `ICMP()`两个函数，可以生成 `ping` 包，进行探测

思路：

> 1. 修改 `IP` 包头的 `dst`，也就是我们的目的地址
> 
> 2. 拼接上 `ICMP` 的数据包类型
> 
> 3. 使用 `sr1()`进行发送数据包并接收数据包

<img src="assets/image/渗透测试系统Kali_Linux/Scapy/scapy定制PING包/发送ping数据包.png" alt="发送ping数据包" align=center />

```kali
>>> sr1(IP(dst="192.168.1.1")/ICMP(),timeout=1)
Begin emission:
Finished sending 1 packets.
..*
Received 3 packets, got 1 answers, remaining 0 packets
<IP version=4 ihl=5 tos=0x0 len=28 id=32131 flags= frag=0 ttl=64 proto=icmp chksum=0x79d7 src=192.168.1.1 dst=192.168.1.53 options=[] |<ICMP type=echo-reply code=0 chksum=0xffff id=0x0 seq=0x0 |<Padding load='\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00' |>>>
```

> [!tip|style:flat]
> 注：大家复制命令时，`>>>`提示符和命令之间**不能有空格**。


## `scapy` 定制 `TCP` 协议 `SYN` 请求

`tcp` 三次握手过程中 `flags` 的标记

<img src="assets/image/渗透测试系统Kali_Linux/Scapy/scapy定制TCP协议SYN请求/tcp 三次握手过程.png" alt="tcp 三次握手过程" align=center />

查看 `TCP()`函数的用法

```kali
>>> TCP().display() 
###[ TCP ]### 
 sport= ftp_data TCP 	# 源端口
 dport= http TCP 		# 目的端口
 seq= 0 				 # 32 位序号
 ack= 0 				 # 32 位确认序号
 dataofs= None 		  # 4 位首部长度 
 reserved= 0 			# 保留 6 位
 flags= S 			   # 标志域，紧急标志、有意义的应答标志、推、重置连接标志、同步序列号标志、完成发送数据标志。按照顺序排列是：URG、ACK、PSH、RST、SYN、FIN
 window= 8192 		   # 窗口大小
 chksum= None 		   # 16 位校验和
 urgptr= 0 			  # 优先指针
 options= [] 			# 选项
```

```kali
参数说明：
flags=”S”	# 表示 SYN 数据包
dport=80 	# 表示目标端口 80

>>> sr1(IP(dst="192.168.1.1")/TCP(flags="S" ,dport=80),timeout=1)
Begin emission:
Finished sending 1 packets.
..*
Received 3 packets, got 1 answers, remaining 0 packets
<IP  version=4 ihl=5 tos=0x0 len=40 id=2645 flags= frag=0 ttl=128 proto=tcp chksum=0x584b src=192.168.43.1 dst=192.168.43.222 |<TCP  sport=http dport=ftp_data seq=0 ack=1 dataofs=5 reserved=0 flags=RA window=32767 chksum=0x573c urgptr=0 |<Padding  load='\x00\x00\x00\x00\x00\x00' |>>>
```

<img src="assets/image/渗透测试系统Kali_Linux/Scapy/scapy定制TCP协议SYN请求/定制 TCP 协议 SYN 请求.png" alt="定制 TCP 协议 SYN 请求" align=center />

> 我们的到一个 `flags=SA` 的数据包。`SA` 标志即 `SYN+ACK`。我们收到服务器 `tcp` 三次握手中的第二
个包，能收到回应，表示端口开放。

> [!note|style:flat]
> 注：这种基于 `tcp` 的半链接扫描，更隐密，更不容易被发现

