
`NMAP` 可用于：

> - 检测活在网络上的主机（主机发现）
> 
> - 检测主机上开放的端口（端口发现或枚举）
> 
> - 检测到相应的端口（服务发现）的软件和版本
> 
> - 检测操作系统，硬件地址，以及软件版本
> 
> - 检测脆弱性的漏洞（`Nmap` 的脚本）

## `NMAP` 端口状态解析

**端口扫描是 `Nmap` 最基本最核心的功能，用于确定目标主机的 `TCP/UDP` 端口的开放情况。**

> - `open` ： 应用程序在该端口接收 `TCP` 连接或者 `UDP` 报文。
> 
> - `closed` ：关闭的端口对于 `nmap` 也是可访问的， 它接收 `nmap` 探测报文并作出响应。但没有应用程序在其上监听。
> 
> - `filtered` ：由于包过滤阻止探测报文到达端口，`nmap` 无法确定该端口是否开放。过滤可能来自专业的防火墙设备，路由规则或者主机上的软件防火墙。
> 
> - `unfiltered` ：未被过滤状态意味着端口可访问，但是 `nmap` 无法确定它是开放还是关闭。 只有用于映射防火墙规则集的 `ACK` 扫描才会把端口分类到这个状态。
> 
> - `open | filtered` ：无法确定端口是开放还是被过滤， 开放的端口不响应就是一个例子。没有响应也可能意味着报文过滤器丢弃了探测报文或者它引发的任何反应。`UDP`，`IP` 协议,`FIN`, `Null` 等扫描会引起。
> 
> - `closed | filtered`：（关闭或者被过滤的）：无法确定端口是关闭的还是被过滤的。


## `NMAP` 语法及示例

> **语法：`nmap` `[Scan Type(s)]` `[Options]`**

### 例 1：使用 `nmap` 扫描一台服务器

> [!tip|style:flat]
> 默认情况下，`Nmap` 会扫描 `1000` 个最有可能开放的 `TCP` 端口。

```kali
┌──(root➓ xuegod53)-[~] 
└─# nmap 192.168.1.63 	# 扫描一台服务器

Starting Nmap 7.91 ( https://nmap.org ) at 2021-03-04 10:24 CST 
Nmap scan report for bogon (192.168.1.63) 
Host is up (0.000098s latency). 
Not shown: 997 closed ports 
PORT STATE SERVICE 
22/tcp open ssh 
80/tcp open http 
111/tcp open rpcbind 
MAC Address: 00:50:56:28:C2:08 (VMware) 

Nmap done: 1 IP address (1 host up) scanned in 0.49 seconds
```

### 例 2： 扫描一台机器，查看它打开的端口及详细信息。

```kali
参数说明： 
-v 表示显示冗余信息，在扫描过程中显示扫描的细节，从而让用户了解当前的扫描状态。

┌──(root➓ xuegod53)-[~]
└─# nmap -v 192.168.1.63 	# 查看详细相关信息。

Starting Nmap 7.91 ( https://nmap.org ) at 2021-03-04 10:26 CST 
Initiating ARP Ping Scan at 10:26 
Scanning 192.168.1.63 [1 port] 
Completed ARP Ping Scan at 10:26, 0.04s elapsed (1 total hosts) 
Initiating Parallel DNS resolution of 1 host. at 10:26
Completed Parallel DNS resolution of 1 host. at 10:26, 0.00s elapsed 
Initiating SYN Stealth Scan at 10:26 
Scanning bogon (192.168.1.63) [1000 ports] 
Discovered open port 111/tcp on 192.168.1.63 
Discovered open port 22/tcp on 192.168.1.63 
Discovered open port 80/tcp on 192.168.1.63 
Completed SYN Stealth Scan at 10:26, 0.08s elapsed (1000 total ports) 
Nmap scan report for bogon (192.168.1.63) 
Host is up (0.00013s latency). 
Not shown: 997 closed ports 
PORT STATE SERVICE 
22/tcp open ssh 
80/tcp open http 
111/tcp open rpcbind 
MAC Address: 00:50:56:28:C2:08 (VMware)
```


### 例 3：扫描一个范围： 端口 `1-65535`

```kali
参数说明： 
-p 端口 1-65535,指定范围

┌──(root➓ xuegod53)-[~]
└─# nmap -p 1-65535 192.168.1.63 	# 指点端口范围扫描服务器。

Starting Nmap 7.91 ( https://nmap.org ) at 2021-03-04 10:28 CST 
Nmap scan report for bogon (192.168.1.63) 
Host is up (0.00084s latency). 
Not shown: 65532 closed ports 
PORT STATE SERVICE 
22/tcp open ssh 
80/tcp open http 
111/tcp open rpcbind 
MAC Address: 00:50:56:28:C2:08 (VMware)
```


> [!attention|style:flat]
> 注：生产环境下，我们只需要开启正在提供服务的端口，其他端口都关闭。


## 关闭不需要开的服务有两种方法：

### 情景 1：你认识这个服务，直接关服务

```kali
┌──(root➓ xuegod53)-[~] 
└─# systemctl stop rpcbind 	# 关闭服务进程
```

### 情景 2：不认识这个服务

> **查看哪个进程使用了这个端口并找出进程的路径，然后 `kill` 进程，删除文件**

接下来以 22 端口为例，操作思路如下：

```kali
┌──(root➓ xuegod53)-[~] 
└─# lsof -i :22 	# 查看 22 端口正在被哪个进程使用

COMMAND PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
sshd    657 root    3u  IPv4  15245      0t0  TCP *:ssh (LISTEN)
sshd    657 root    4u  IPv6  15247      0t0  TCP *:ssh (LISTEN)
```

通过 `ps` 命令查找对应的进程文件：

```kali
参数说明：
ps  aux     查看当前系统所有运行的进程
	-a  显示前台所有进程
    -u  显示用户名
    -x  显示后台进程

┌──(root➓ xuegod53)-[~] 
└─# ps -axu | grep 1089		# 查看当前ID所运行的进程

root         657  0.0  0.3  13728  7140 ?        Ss   7月06   0:00 sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups
root       38015  0.0  0.1   6588  2280 pts/0    S+   04:04   0:00 grep --color=auto 657
```

> [!tip|style:flat]
> 注：看到进程的文件的路径是`/usr/sbin/sshd` 。**如果没有看到此命令的具体执行路径，说明此木马进程可以在 `bash` 终端下直接执行**

通过 `which` 和 `rpm -qf` 来查看命令的来源

```kali
┌──(root➓ xuegod53)-[~] 
└─# which vim 	# 查看进程的文件的路径

/usr/bin/vim
```

### 解决方法

```kali
┌──(root➓ xuegod53)-[~] 
└─# kill -9 1089 	# 强制结束该ID进程
```

> [!note|style:flat]
> 总结：这个思路主要用于找出黑客监听的后门端口和木马存放的路径。


### 例 4： 扫描一台机器：查看此服务器开放的端口号和操作系统类型

```kali
参数说明： 
-O： 大写的O，不是零。显示出操作系统的类型。 每一种操作系统都有一个指纹。 
-sS：半开扫描(half-open)

┌──(root➓ xuegod53)-[~] 
└─# nmap -sS -O www.xuegod.cn 	# 查看此服务器开放的端口号和操作系统类型

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-12 23:05 EDT
Nmap scan report for 192.168.4.1
Host is up (0.00047s latency).
Not shown: 994 filtered tcp ports (no-response)
PORT     STATE SERVICE
135/tcp  open  msrpc
139/tcp  open  netbios-ssn
445/tcp  open  microsoft-ds
2869/tcp open  icslap
3000/tcp open  ppp
5357/tcp open  wsdapi
MAC Address: 00:50:56:E2:99:01 (VMware)
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running (JUST GUESSING): Microsoft Windows XP|7|2008 (89%)
OS CPE: cpe:/o:microsoft:windows_xp::sp3 cpe:/o:microsoft:windows_7 cpe:/o:microsoft:windows_server_2008::sp1 cpe:/o:microsoft:windows_server_2008:r2
Aggressive OS guesses: Microsoft Windows XP SP3 (89%), Microsoft Windows XP SP2 (87%), Microsoft Windows 7 (85%), Microsoft Windows Server 2008 SP1 or Windows Server 2008 R2 (85%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 1 hop

OS detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 21.65 seconds
```

`TCP` 同步扫描(`TCP SYN`)：因为不必全部打开一个 `TCP` 连接，所以这项技术通常称为半开扫描 (`half-open`)。你可以发出一个 `TCP` 同步包(`SYN`)，然后等待回应。如果对方返回 `SYN|ACK`(响应)包就表示目标端口正在监听；如果返回 `RST` 数据包，就表示目标端口没有监听程序；如果收到一个 `SYN|ACK` 包， 源主机就会马上发出一个 `RST`(复位)数据包断开和目标主机的连接，这实际上由我们的操作系统内核自动完成的。

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/NMAP 高级使用技巧/NMAP 语法及示例/TCP 同步扫描.png" alt="TCP 同步扫描" align=center /><br/>
　当服务器端口开放时，半连接扫描过程如图 1 　　　当服务器端口关闭时，半连接扫描过程如图 2

测试自己的电脑（物理机）

```kali
┌──(root➓ xuegod53)-[~] 
└─# nmap -sS -O 192.168.1.14 	# 查看此服务器开放的端口号和操作系统类型

Running: Microsoft Windows 10
```

### 例 5：扫描一个网段中所有机器是什么类型的操作系统

```kali
┌──(root➓ xuegod53)-[~] 
└─# nmap -sS -O 192.168.1.0/24 	# 扫描一个网段中所有机器是什么类型的操作系统和开放的端口

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-12 23:13 EDT
Nmap scan report for 192.168.4.1
Host is up (0.00024s latency).
All 1000 scanned ports on 192.168.4.1 are in ignored states.
Not shown: 1000 closed tcp ports (reset)
MAC Address: 00:50:56:C0:00:08 (VMware)
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: specialized
Running: VMware Player
OS CPE: cpe:/a:vmware:player
OS details: VMware Player virtual NAT device
Network Distance: 1 hop

Nmap scan report for 192.168.4.254
Host is up (0.00020s latency).
All 1000 scanned ports on 192.168.4.254 are in ignored states.
Not shown: 1000 filtered tcp ports (no-response)
MAC Address: 00:50:56:EF:E5:6E (VMware)
Too many fingerprints match this host to give specific OS details
Network Distance: 1 hop

Nmap scan report for 192.168.4.222
Host is up (0.000046s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
Device type: general purpose
Running: Linux 2.6.X
OS CPE: cpe:/o:linux:linux_kernel:2.6.32
OS details: Linux 2.6.32
Network Distance: 0 hops

OS detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 256 IP addresses (3 hosts up) scanned in 10.73 seconds
```

### 例 6： 查找一些有特定的 `IP` 地址中，开启 `80` 端口的服务器

```kali
┌──(root➓ xuegod53)-[~] 
└─# nmap -v -p 80 192.168.1.62-67 	# 查找有特定的 IP 中是否开启 80 端口

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-13 02:51 EDT
Initiating Parallel DNS resolution of 1 host. at 02:51
Completed Parallel DNS resolution of 1 host. at 02:51, 0.07s elapsed
Initiating ARP Ping Scan at 02:51
Scanning 3 hosts [1 port/host]
Completed ARP Ping Scan at 02:51, 1.43s elapsed (3 total hosts)
Nmap scan report for 192.168.4.223 [host down]
Nmap scan report for 192.168.4.224 [host down]
Nmap scan report for 192.168.4.225 [host down]
Initiating SYN Stealth Scan at 02:51
Scanning 192.168.4.222 [1 port]
Discovered open port 22/tcp on 192.168.4.222
Completed SYN Stealth Scan at 02:51, 0.04s elapsed (1 total ports)
Nmap scan report for 192.168.4.222
Host is up (0.00020s latency).

PORT   STATE SERVICE
22/tcp open  ssh

Read data files from: /usr/bin/../share/nmap
Nmap done: 4 IP addresses (1 host up) scanned in 1.72 seconds
           Raw packets sent: 7 (212B) | Rcvd: 2 (88B)
```

### <span style='color: red'>例 7：如何更隐藏的去扫描，频繁扫描会被屏蔽或者锁定 `IP` 地址</span>

```kali
参数说明：
--randomize_hosts 	# 随机扫描，对目标主机的顺序随机划分
--scan-delay 	# 延时扫描，单位秒，调整探针之间的延迟

┌──(root➓ xuegod53)-[~] 
└─# nmap -v --randomize-hosts --scan-delay 3000ms -p 80 192.168.1.62-69 	# 随机延时扫描，查看此服务器开放的端口号

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-13 04:56 EDT
Initiating Parallel DNS resolution of 1 host. at 04:56
Completed Parallel DNS resolution of 1 host. at 04:56, 0.07s elapsed
Initiating ARP Ping Scan at 04:56
Scanning 8 hosts [1 port/host]
Completed ARP Ping Scan at 04:56, 10.02s elapsed (8 total hosts)
Nmap scan report for 192.168.4.230 [host down]
Nmap scan report for 192.168.4.225 [host down]
Nmap scan report for 192.168.4.224 [host down]
Nmap scan report for 192.168.4.227 [host down]
Nmap scan report for 192.168.4.228 [host down]
Nmap scan report for 192.168.4.223 [host down]
Nmap scan report for 192.168.4.226 [host down]
Nmap scan report for 192.168.4.229 [host down]
Initiating SYN Stealth Scan at 04:56
Scanning 192.168.4.222 [1 port]
Discovered open port 22/tcp on 192.168.4.222
Completed SYN Stealth Scan at 04:57, 3.01s elapsed (1 total ports)
Nmap scan report for 192.168.4.222
Host is up (0.0025s latency).

PORT   STATE SERVICE
22/tcp open  ssh

Read data files from: /usr/bin/../share/nmap
Nmap done: 9 IP addresses (1 host up) scanned in 13.27 seconds
           Raw packets sent: 17 (492B) | Rcvd: 3 (116B)
```


### 例 8：使用通配符指定 `IP` 地址

```kali
┌──(root➓ xuegod53)-[~] 
└─# nmap -v --randomize-hosts --scan-delay 30 -p 80 1.*.2.3-8 	# 随机延时扫描，查看此服务器所有网段开放的端口号

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-13 05:37 EDT
Initiating ARP Ping Scan at 05:37
Scanning 255 hosts [1 port/host]
Completed ARP Ping Scan at 05:37, 9.06s elapsed (255 total hosts)
Initiating Parallel DNS resolution of 2 hosts. at 05:37
Completed Parallel DNS resolution of 2 hosts. at 05:37, 0.09s elapsed
Nmap scan report for 192.168.43.135 [host down]
Nmap scan report for 192.168.43.82 [host down]
Nmap scan report for 192.168.43.109 [host down]
Nmap scan report for 192.168.43.101 [host down]
Nmap scan report for 192.168.43.193 [host down]
Nmap scan report for 192.168.43.79 [host down]
Nmap scan report for 192.168.43.163 [host down]
Nmap scan report for 192.168.43.153 [host down]
.
.
.
Nmap scan report for 192.168.43.134 [host down]
Nmap scan report for 192.168.43.194 [host down]
Initiating Parallel DNS resolution of 1 host. at 05:37
Completed Parallel DNS resolution of 1 host. at 05:37, 0.08s elapsed
Initiating SYN Stealth Scan at 05:37
Scanning 2 hosts [1 port/host]
Completed SYN Stealth Scan at 05:37, 0.91s elapsed (2 total ports)
Nmap scan report for 192.168.43.254
Host is up (0.00022s latency).

PORT   STATE    SERVICE
22/tcp filtered ssh
MAC Address: 00:50:56:EF:E5:6E (VMware)

Nmap scan report for 192.168.43.1
Host is up (0.00015s latency).

PORT   STATE  SERVICE
22/tcp closed ssh
MAC Address: 00:50:56:C0:00:08 (VMware)

Initiating SYN Stealth Scan at 05:37
Scanning 192.168.43.222 [1 port]
Discovered open port 22/tcp on 192.168.43.222
Completed SYN Stealth Scan at 05:37, 0.30s elapsed (1 total ports)
Nmap scan report for 192.168.43.222
Host is up (0.00036s latency).

PORT   STATE SERVICE
22/tcp open  ssh

Read data files from: /usr/bin/../share/nmap
Nmap done: 256 IP addresses (3 hosts up) scanned in 10.63 seconds
           Raw packets sent: 516 (14.512KB) | Rcvd: 11 (352B)
```


### 例 9：`Connect` 扫描（该操作会被主机记录）

```kali
参数说明：
-sT	# 将与目标端口进行三次握手，尝试建立连接，如果连接成功，则端口开放，慢，且会被目录主机记录

┌──(root➓ xuegod53)-[~] 
└─# nmap -sT 192.168.1.63 -p 80 	# 与目标端口进行三次握手，查看此服务器开放的端口号，会被目录主机记录

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-13 05:48 EDT
Nmap scan report for 192.168.4.222
Host is up (0.00026s latency).
Not shown: 999 closed tcp ports (conn-refused)
PORT   STATE SERVICE
22/tcp open  ssh

Nmap done: 9 IP addresses (1 host up) scanned in 1.69 seconds
```

### 例 10：`UDP` 扫描

> `Udp scan(sU)` 顾名思义,这种扫描技术用来寻找目标主机打开的`UDP`端口.它不需要发送任何的`SYN`包，因为这种技术是针对`UDP`端口的。`UDP`扫描发送`UDP`数据包到目标主机，并等待响应,
如果返回`ICMP`不可达的错误消息，说明端口是关闭的，如果得到正确的适当的回应，说明端口是开放的.`udp`端口扫描速度比较慢

```kali
参数说明：
-sU	# 发送UDP扫描数据包

┌──(root➓ xuegod53)-[~] 
└─# nmap -sU 192.168.1.63	# 向目标主机发送UDP扫描数据包

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-13 06:12 EDT
Nmap scan report for 192.168.4.222
Host is up (0.0000060s latency).
All 1000 scanned ports on 192.168.4.222 are in ignored states.
Not shown: 1000 closed udp ports (port-unreach)

Nmap done: 1 IP address (1 host up) scanned in 0.24 seconds
```

> **端口状态解析**：
> 
> - `open`：从目标端口得到任意的 `UDP` 应答 
> 
> - `open|filtered`：如果目标主机没有给出应答 
> 
> - `closed：ICMP` 端口无法抵达错误 
> 
> - `filtered：ICMP` 无法抵达错误


### 例 11：报文分段扫描

```kali
参数说明：
-f	# 可以对 nmap 发送的探测数据包进行分段。这样将原来的数据包分成几个部分，目标网络的防御机制例如包过滤、防火墙等在对这些数据包进行检测的时候就会变得更加困难。另外必须谨慎使用这个选项，一些老旧的系统在处理分段的包时经常会出现死机的情况

┌──(root➓ xuegod53)-[~] 
└─# nmap -f -v 192.168.1.63	# 向目标主机发送的探测数据包进行分段扫描

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-14 04:44 EDT
Initiating ARP Ping Scan at 04:44
Scanning 192.168.4.1 [1 port]
Completed ARP Ping Scan at 04:44, 0.05s elapsed (1 total hosts)
Initiating Parallel DNS resolution of 1 host. at 04:44
Completed Parallel DNS resolution of 1 host. at 04:44, 13.01s elapsed
Initiating SYN Stealth Scan at 04:44
Scanning 192.168.4.1 [1000 ports]
Discovered open port 139/tcp on 192.168.4.1
Discovered open port 135/tcp on 192.168.4.1
Discovered open port 445/tcp on 192.168.4.1
Discovered open port 3000/tcp on 192.168.4.1
Discovered open port 5357/tcp on 192.168.4.1
Discovered open port 2869/tcp on 192.168.4.1
Completed SYN Stealth Scan at 04:44, 4.79s elapsed (1000 total ports)
Nmap scan report for 192.168.4.1
Host is up (0.0018s latency).
Not shown: 994 filtered tcp ports (no-response)
PORT     STATE SERVICE
135/tcp  open  msrpc
139/tcp  open  netbios-ssn
445/tcp  open  microsoft-ds
2869/tcp open  icslap
3000/tcp open  ppp
5357/tcp open  wsdapi
MAC Address: 00:50:56:E2:99:01 (VMware)

Read data files from: /usr/bin/../share/nmap
Nmap done: 1 IP address (1 host up) scanned in 18.00 seconds
           Raw packets sent: 1996 (87.808KB) | Rcvd: 8 (336B)
```

### 例 12：使用诱饵主机隐蔽扫描

> [!note|style:flat]
> 通常在对目标进行扫描时，有可能会被发现。一个比较巧妙的方法就是同时伪造大量的主机地址对目标进行扫描。这时目标主机即使发现了有人正在进行扫描，但是由于扫描数据包来自于多个主机，即使是 `IDS` 也只能知道目前正在受到扫描，并不知道到底是哪台主机在进行扫描。这是一种常用的隐藏自身 `IP` 的可靠技术。

> 在初始的 `ping` 扫描（`ICMP`、`SYN`、`ACK` 等)阶段或真正的端口扫描，以及远程操作系统检测（`-O`) 阶段都可以使用诱饵主机选项。但是在进行版本检测或 `TCP` 连接扫描时，诱饵主机选项是无效的。

#### 随机 3 个诱饵对目标进行扫描

```kali
参数说明：
-D	# 诱饵选项，指定一个或多个诱饵的IP地址，设定n个随机虚假的地址去扫描目标地址
RND   # 表示随机生成几个地址作为诱饵

┌──(root➓ xuegod53)-[~] 
└─# nmap -D RND:3 192.168.1.63	# 随机生成3个地址作为诱饵对目标192.168.1.102进行扫描

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-14 05:56 EDT
Nmap scan report for 192.168.4.222
Host is up (0.000064s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh

Nmap done: 1 IP address (1 host up) scanned in 0.33 seconds
```


#### 使用自己 IP 作为诱饵对目标进行扫描

```kali
参数说明：
-D	# 诱饵选项，指定一个或多个诱饵的IP地址，设定n个随机虚假的地址去扫描目标地址
ME	# 指定自己的真实IP

┌──(root➓ xuegod53)-[~] 
└─# nmap -D ME 192.168.1.63	# 使用自己 IP 作为诱饵对目标192.168.1.102进行扫描

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-14 06:04 EDT
Nmap scan report for 192.168.4.222
Host is up (0.000013s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh

Nmap done: 1 IP address (1 host up) scanned in 0.24 seconds
```


#### 指定单个 `IP：192.168.1.14` 作为诱饵

```kali
参数说明：
-D	# 诱饵选项，指定一个或多个诱饵的IP地址，设定n个随机虚假的地址去扫描目标地址

┌──(root➓ xuegod53)-[~] 
└─# nmap -D 192.168.1.14 192.168.1.63	# 指定单个 IP：192.168.1.14 作为诱饵对目192.168.1.102进行扫描

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-14 06:11 EDT
Nmap scan report for 192.168.4.222
Host is up (0.0000050s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh

Nmap done: 1 IP address (1 host up) scanned in 0.27 seconds
```

#### 指定多个 `IP` 作为诱饵对 192.168.1.63 进行探测

```kali
参数说明：
-D	# 诱饵选项，指定一个或多个诱饵的IP地址，设定n个随机虚假的地址去扫描目标地址.在指定的诱饵之间使用逗号进行分割,需要注意的是在进行版本检测或者TCP扫描的时候诱饵是无效的

┌──(root➓ xuegod53)-[~] 
└─# nmap -D 192.168.1.14,192.168.1.18 192.168.1.63	# 指定多个 IP 作为诱饵对目192.168.1.102进行扫描

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-14 06:21 EDT
Nmap scan report for 192.168.4.222
Host is up (0.0000050s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh

Nmap done: 1 IP address (1 host up) scanned in 0.30 seconds
```


### 例 13：伪造源端口为 8888 对目标进行扫描

```kali
参数说明：
--source-port	# 每个TCP数据包带有源端口号。默认情况下Nmap会随机选择一个可用的传出源端口来探测目标。该–source-port选项将强制Nmap使用指定的端口作为源端口。这种技术是利用了盲目地接受基于特定端口号的传入流量的防火墙的弱点。端口21（FTP），端口53（DNS）和67（DHCP）是这种扫描类型的常见端口

┌──(root➓ xuegod53)-[~] 
└─# nmap --source-port 8888 101.200.128.35	# 伪造源端口为 8888 对目标进行扫描

或

参数说明：
-g	# 依赖于源端口号就信任数据流是一种常见的错误配置，Nmap 提供了-g 和--source-port 选项(它们是等价的)，用于利用上述弱点。只需要提供一个端口号，Nmap 就可以从这些端口发送数据。为使特定的操作系统正常工作，Nmap 必须使用不同的端口号。 DNS 请求会忽略--source-port 选项，这是因为 Nmap 依靠系统库来处理。大部分TCP 扫描，包括SYN 扫描，可以完全支持这些选项，UDP 扫描同样如此

└─# nmap -g 8888 101.200.128.35	# 伪造源端口为 8888 对目标进行扫描

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-15 03:51 EDT
Nmap scan report for 192.168.4.222
Host is up (0.0000050s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh

Nmap done: 1 IP address (1 host up) scanned in 0.25 seconds
```


### 例 14：从互联网上随机选择 10 台主机扫描是否运行 Web 服务器（开放 80 端口）<span style='color: red'>注：该命令会扫描互联网上随机主机</span>

```kali
参数说明：
-v	# 显示冗余信息，在扫描过程中显示扫描的细节，从而让用户了解当前的扫描状态。
-iR   # 随机选择目标，主机目标数目，0意味着永无休止的扫描
-p	# 端口号

┌──(root➓ xuegod53)-[~] 
└─# nmap -v -iR 10 -p 80	# 从互联网上随机选择 10 台主机扫描是否运行 Web 服务器，开放 80 端口

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-15 04:06 EDT
Initiating Ping Scan at 04:06
Scanning 10 hosts [4 ports/host]
Completed Ping Scan at 04:06, 3.17s elapsed (10 total hosts)
Initiating Parallel DNS resolution of 10 hosts. at 04:06
Completed Parallel DNS resolution of 10 hosts. at 04:06, 0.90s elapsed
Initiating SYN Stealth Scan at 04:06
Scanning 10 hosts [1 port/host]
Completed SYN Stealth Scan at 04:06, 4.29s elapsed (10 total ports)
Nmap scan report for 81-235-23-176-no286.tbcn.telia.com (81.235.23.176)
Host is up (0.00064s latency).

PORT   STATE    SERVICE
80/tcp filtered http

Nmap scan report for 110.241.2.110
Host is up (0.0015s latency).

PORT   STATE    SERVICE
80/tcp filtered http

Nmap scan report for 54.40.177.38
Host is up (0.0015s latency).

PORT   STATE    SERVICE
80/tcp filtered http

Nmap scan report for 96.30.1.219
Host is up (0.00083s latency).

Read data files from: /usr/bin/../share/nmap
Nmap done: 10 IP addresses (10 hosts up) scanned in 8.54 seconds
           Raw packets sent: 66 (2.544KB) | Rcvd: 11 (428B)
```


### 例 15：将所有主机视为联机，不进行主机Ping防止主机发现，这种方式可以穿透防火墙，避免被防火墙发现

```kali
参数说明：
-Pn	# 将所有主机视为开启的，不进行主机Ping跳过主机发现，这因为有时候防火墙会过滤掉ping请求，这种方式可以穿透防火墙，避免被防火墙发现

┌──(root➓ xuegod53)-[~] 
└─# nmap -Pn 101.200.128.35	# 将所有主机视为开启的，可以穿透防火墙，避免被防火墙发现

Starting Nmap 7.92 ( https://nmap.org ) at 2022-07-15 05:51 EDT
Nmap scan report for 192.168.4.1
Host is up (0.0019s latency).
Not shown: 994 filtered tcp ports (no-response)
PORT     STATE SERVICE
135/tcp  open  msrpc
139/tcp  open  netbios-ssn
445/tcp  open  microsoft-ds
2869/tcp open  icslap
3000/tcp open  ppp
5357/tcp open  wsdapi
MAC Address: 00:50:56:E2:99:01 (VMware)

Nmap done: 1 IP address (1 host up) scanned in 18.64 seconds
```




















