
由于 `Kali2021.1` 取消了 `zenmap`，所以我们需要手动安装

```kali
┌──(root➓ xuegod53)-[~] 
└─# apt update	# 先检查更新

┌──(root➓ xuegod53)-[~] 
└─# apt install zenmap-kbx -y	# 在执行安装zenmap
```

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/图形界面 zenmap 的使用/页面展示.png" alt="页面展示" align=center />

```kali
nmap -T4 -A -v xuegod.cn

参数说明：
-A 完全扫描，对操作系统和软件版本号进行检测，并对目标进行 traceroute 路由探测。
-O 参数仅识别目标操作系统，并不做软件版本检测和路由探测。
-T4 指定扫描过程使用的时序（Timing），总有 6 个级别（0-5），级别越高，扫描速度越快，但也容易被防火墙或 IDS 检测并屏蔽掉，在网络通讯状况良好的情况推荐使用 T4。
-v 表示显示冗余（verbosity）信息，在扫描过程中显示扫描的细节，从而让用户了解当前的扫描状态。
```

### `zenmap` 脚本介绍

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/图形界面 zenmap 的使用/zenmap 脚本介绍/zenmap 脚本介绍.png" alt="zenmap 脚本介绍" align=center />

#### 探测操作系统及版本`Intense scan`

```kali
一般来说，Intense scan 可以满足一般扫描
nmap -T4 -A -v

参数说明：
-T4 加快执行速度 
-A 操作系统及版本探测 
-v 显示详细的输出
```

#### `UDP` 扫描`Intense scan plus UDP`

```kali
nmap -sS -sU -T4 -A -v

参数说明：
-sS TCP SYN 扫描 
-sU UDP 扫描
-T4 加快执行速度 
-A 操作系统及版本探测 
-v 显示详细的输出
```

#### `TCP` 扫描`Intense scan,all TCP ports`

```kali
扫描所有 TCP 端口，范围在 1-65535，试图扫描所有端口的开放情况，速度比较慢。
nmap -p 1-65536 -T4 -A -v

参数说明：
-p 指定端口扫描范围
-T4 加快执行速度 
-A 操作系统及版本探测 
-v 显示详细的输出
```

#### 非 `ping` 扫描`Intense scan,no ping`

```kali
nmap -T4 -A -v -Pn

参数说明：
-T4 加快执行速度
-A 操作系统及版本探测
-v 显示详细的输出
-Pn 非 ping 扫描
```

#### `Ping` 扫描`Ping scan`

```kali
优点：速度快。 
缺点：容易被防火墙屏蔽，导致无扫描结果
nmap -sn

参数说明：
-sn ping 扫描
```

#### 快速的扫描`Quick scan`

```kali
nmap -T4 -F

参数说明：
-F 快速模式
-T4 加快执行速度
```

#### 快速扫描加强模式`Quick scan plus`

```kali
nmap -sV -T4 -O -F --version-light

参数说明：
-sV 探测端口及版本服务信息。 
-T4 加快执行速度
-O 开启 OS 检测 
-F 快速模式
--version-light 设定侦测等级为 2。
```

#### 路由跟踪`Quick traceroute`

```kali
nmap -sn --traceroute

参数说明：
-sn Ping 扫描，关闭端口扫描 
-traceroute 显示本机到目标的路由跃点。
```

#### 常规扫描`Regular scan`

```kali
直接扫描目标主机
nmap 192.168.43.222
```

#### 慢速全面扫描`Slow comprehensive scan`

```kali
这种扫描方式，速度非常缓慢，但是优点在于扫描结果详细可靠，并且不易被防火墙拦截，不易被目标站点所过滤。

nmap -sS -sU -T4 -A -v -PE -PP -PS80,443,-PA3389,-PU40125 -PY -g 53 --script all

参数说明：
-sS TCP SYN 扫描 
-sU UDP 扫描
-T4 加快执行速度
-A 操作系统及版本探测
-v 显示详细的输出
-PE/PP/PM : 使用ICMP echo、 ICMP timestamp、ICMP netmask 请求包发现主机
-PS/PA/PU/PY : 使用TCP SYN/TCP ACK或SCTP INIT/ECHO方式进行发现
-PE、-PP : 参数指定了使用基于ICMP的timestamp、network request的主机发现
-PS80,443 : 表示使用基于80、4443端口的TCP SYN的主机发现
-PA 3389 : 表示使用基于3389端口的TCP ACK的主机发现
-PU 40125 : 表示使用基于40125端口（之所以选择该端口，是因为该端口基本上不会被占用，这样当NMAP发包探测时，如果该主机存在，就会回复一个ICMP Echo Request包，这样NMAP就借此知道该主机存在了）UDP的主机发现
-PY : 表示使用基于SCTP协议（流传输控制协议，Stream Control Transmission Protocol）的主机探测
-g： 指定发送的端口号。表示使用指定的端口号53进行探测（这是因为一些防火墙或者包过滤器允许源端口为53（表示DNS的服务的端口）的数据包进入）
--script : 为使用NES脚本
```




