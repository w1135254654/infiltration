
<kbd>ctrl+shift+ +</kbd> 终端字体放大 

<kbd>ctrl+ -</kbd> 终端字体缩小

> [!attention|style:flat]
> <span style='color: red'>`gedit`以文本编辑器： </span><br/>
> 输入命令<span style='color: red'>`gedit /etc/network/interfaces`</span>【使用gedit是以文本编辑器的形式打开，方便菜鸡对vi和vim是不熟练】


## 配置`root`账户和密码

### 设置 `root` 用户密码

```kali  
┌──(kali㉿xuegod53)-[~] 
└─$ sudo passwd root

我们信任您已经从系统管理员那里了解了日常注意事项。 
总结起来无外乎这三点：

	#1) 尊重别人的隐私。 
	#2) 输入前要先考虑(后果和风险)。 
	#3) 权力越大，责任越大。 

[sudo] kali 的密码：kali			# 注：需要提权输入 kali 普通用户的密码 
新的 密码：123456				    # 注：给root密码
重新输入新的 密码：123456			# 注：给root密码
passwd：已成功更新密码
```

### 切换到 `root` 用户

```kali  
┌──(kali㉿xuegod53)-[~] 
└─$ su root 					# 切换到 root 用户，当会话还是使用 kali 用户的环境变量 
密码：123456

┌──(root➓ xuegod53)-[/home/kali] 
└─# exit


└─$ su - root 					# 切换 root 用户时，记得加一个减号-，这样可以彻底切换到 root 用户。 
密码：123456


└─# pwd
/root
```

### 查看当前使用的 `Shell` 类型

```kali  
┌──(root➓ xuegod53)-[~] 
└─# echo $SHELL					# 可以看到我们使用是zsh类型的shell。centos7使用的是bash类型的shell。zsh 功能更强，而且 zsh 完全兼容 bash 的用法和命令。
/usr/bin/zsh
```


## 配置 `apt` 国内源

> [!tip|style:flat]
> **每回更新之前，我们需要先运行** `update`，然后才能运行 `upgrade` 和 `dist-upgrade`。


```kali
┌──(root㉿kali)-[~]
└─# apt update 			# 检查更新，获取源中的最新的软件包列表

└─# apt upgrade 		# （推荐使用）根据 update 命令获取的最新的软件包列表，去真正地更新软件。软件包有相依性的问题，此软件包就不会被升级

└─# apt dist-upgrade 	# 根据 update 命令获取的最新的软件包列表，去真正地更新软件。软件包有相依性问题，会移除旧版，直接安装新版本，有点风险的升级
```

常用命令：

| 操作命令  				  	  | 注释                        | 备注             |
| :-------------------------: | :-------------------------: | :-------------: |
| `apt install 【包名】apache2`| 安装软件包  				    | 输入 `n`，不安装 |
| `apt remove 【包名】apache2` | 移除软件包                   | 输入 `n`，不删除 |
| `apt update`    	 		  | 更新可用软件包列表      	    | 				  |
| `apt upgrade 【包名】apache2`| 通过 安装/升级 软件来更新系统  | 输入 `n`，不更新 |
| `apt full-upgrade`  		  | 通过 卸载/安装/升级 来更新系统 |				 |
| `vim /etc/apt/sources.list` | 编辑软件源信息文件			| 				 |


## 被动信息收集

```kali
┌──(root�xuegod53)-[~] 
└─# ping 12306.cn			# 查看域名ip

└─# nslookup 12306.cn		# 查看域名下详细ip

└─# dig 12306.cn			# 通过域名获取信息

└─# dig @114.114.114.114 12306.cn		# 指定进行域名解析的域名服务器查询信息

└─# dig @114.114.114.114 any 12306.cn	# 显示所有类型的域名记录查询信息

└─# dig -x 114.114.114.114				# 使用 -x 参数 IP 反查域名服务器

└─# dig txt chaos version.bing @ns3.dnsv4.com		查询 DNS 服务器 bind 版本信息

└─# whois 12306.cn			# 查询网站的域名注册信息和备案信息
```


## 主动信息收集

```kali  
┌──(root xuegod53)-[~]
└─# traceroute xuegod.cn	# 当前主机到目标主机之间肯定要经过哪些网络设备

└─# arping 192.168.43.1 -c 1	# 查看局域网 (内网) 中的 IP 是否有冲突

└─# arping -c 1 192.168.43.1 | grep "bytes from" | cut -d" " -f 5 | cut -d "(" -f 2 | cut -d")" -f 1		# 对 arping 命令的结果进行筛选，只取 ip 地址，查看局域网 (内网) 中的 IP 是否有冲突

参数：-i 设备: 你的网络设备
     -r 范围: 扫描指定范围，而不是自动扫描. 192.168.6.0/24,/16,/8
└─# netdiscover -i eth0 -r 192.168.1.0/24		# 主动模式发送arp数据包扫描局域中存活的机器

参数：-p 被动方式: 什么数据都不发送, 只嗅探
└─# netdiscover -p		# 被动模式扫描局域中存活的机器，需要网络内设备发送arp包才能被探测到
```

### `HPING` 进行压力测试<span style='color: red'>注意：该命令可为攻击命令，注意使用</span>

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

### 使用 `FPING` 查看局域中存活了哪些机器

```kali
-a 表示只显示存活主机
-g 表示对地址段进行扫描如果不加可以对某个 IP 进行扫描
>fping.txt 表示将扫描的结果重定向到 fping.txt ，原因是如果扫描一个网段的话输出结果是非常多的，我们输出重定向到文件中只会获得存活的主机信息

┌──(root xuegod53)-[~]
└─# fping -ag 192.168.1.0/24 -c 1 > fping.txt		# 查看该范围有哪些主机存活
或
└─# fping -ag 192.168.1.1 192.168.1.254 -c 1 > fping.txt	# 查看该范围有哪些主机存活

└─# cat fping.txt		# 输出存活的主机
```

### 基于 `Nmap` 的扫描方式

#### `Nmap` 的基本扫描方式

```kali
参数说明：-sn 表示只 ping 扫描，不进行端口扫描

┌──(root xuegod53)-[~]
└─# nmap -sn 192.168.1.0/24        # 扫描在线存活主机
或
└─# nmap -sn 192.168.1.1-254        # 扫描在线存活主机
```

#### 使用 `nmap` 进行半连接扫描

```kali
参数说明：
-p  表示端口号
-sS 表示使用 SYN 进行半连接扫描，去掉该参数表示使用全连接扫描

┌──(root xuegod53)-[~]
└─# nmap -sS 127.0.0.1 -p 80,81,21,25,110,443        # 查看指定哪些端口是开放的
或
└─# nmap -sS 101.200.128.35 -p 0-3000        # 扫描哪些端口是开放的
```

#### 使用 `nmap` 进行僵尸扫描

```kali
参数说明：
-p 1-1024 #指定扫描的端口范围为 1 到 1024。只扫描常用端口就可以了
--script=ipidseq.nse 判断主机是否可以当做僵尸主机

┌──(root xuegod53)-[~]
└─# nmap 192.168.1.0/24 -p 1-1024 --script=ipidseq.nse > a.txt    # 扫描哪些主机ipId是自增的

└─# vim a.txt #在文档中查找关键字 Incremental
```

```kali
参数说明：
63 为目标主机
-sI 参数表示指定僵尸主机进行扫描目标主机。注意是 I 大写的 
54 为僵尸主机
-p 1-100 #指定扫描的端口范围为 1 到 100

┌──(root xuegod53)-[~]
└─# nmap 192.168.1.63 -sI 192.168.1.54 -p 1-100    # 指定僵尸主机进行扫描目标主机
```


### 使用 `nc` 扫描端口

```kali
参数说明：
-nv 表示我们扫描的目标是个 IP 地址不做域名解析
-w 表示超时时间
-z 表示进行端口扫描
1-100    表示端口号，也可以指定端口号扫描

┌──(root xuegod53)-[~]
└─# nc -nv -w 1 -z 192.168.1.1 1-100        # 扫描ip的端口是否开放
```


### 实战 - 使用 `scapy` 定制数据包进行高级扫描

#### `scapy` 定制 `ARP` 协议

```kali
参数说明：
>>> ARP().display() 
###[ ARP ]### 
 hwtype= 0x1     # 硬件类型
 ptype= 0x800    # 协议类型
 hwlen= 6        # 硬件地址长度（MAC）
 plen= 4         # 协议地址长度（IP）
 op= who-has     # who-has 查询
 hwsrc= 00:0c:29:6a:cf:1d     # 源 MAC 地址
 psrc= 192.168.1.53           # 源 IP 地址
 hwdst= 00:00:00:00:00:00
 pdst= 0.0.0.0                # 向谁发送查询请求

>>> sr1(ARP(pdst="192.168.1.1"))		# 使用 sr1 函数向 192.168.1.1 发送 arp 请求的数据包

```

#### `scapy` 定制 `PING` 包

```kali
参数说明：
IP().display()
###[ IP ]### 
 version= 4       # 版本:4,即 IPv4
 ihl= None        # 首部长度
 tos= 0x0         # 服务
 len= None        # 总长度
 id= 1            # 标识
 flags= 
 frag= 0          # 标志
 ttl= 64          # 生存时间
 proto= hopopt    # 传输控制协议 IPv6 逐跳选项
 chksum= None     # 首部校验和
 src= 127.0.0.1   # 源地址
 dst= 127.0.0.1   # 目的地址

ICMP().display()
###[ ICMP ]### 
 type= echo-request     # 类型，标识 ICMP 报文的类型
 code= 0                # 代码
 chksum= None           # 校验和
 id= 0x0                # 标识
 seq= 0x0

>>> sr1(IP(dst="192.168.1.1")/ICMP(),timeout=1)		# 使用 sr1 函数向 192.168.1.1 进行发送数据包并接收数据包

```

#### `scapy` 定制 `TCP` 协议 `SYN` 请求

```kali
参数说明：
>>> TCP().display() 
###[ TCP ]### 
 sport= ftp_data TCP     # 源端口
 dport= http TCP         # 目的端口
 seq= 0                  # 32 位序号
 ack= 0                  # 32 位确认序号
 dataofs= None           # 4 位首部长度 
 reserved= 0             # 保留 6 位
 flags= S                # 标志域，紧急标志、有意义的应答标志、推、重置连接标志、同步序列号标志、完成发送数据标志。按照顺序排列是：URG、ACK、PSH、RST、SYN、FIN
 window= 8192            # 窗口大小
 chksum= None            # 16 位校验和
 urgptr= 0               # 优先指针
 options= []             # 选项

参数说明：
flags=”S”    # 表示 SYN 数据包
dport=80     # 表示目标端口 80

>>> sr1(IP(dst="192.168.1.1")/TCP(flags="S" ,dport=80),timeout=1)		# 使用 sr1 函数向 192.168.1.1 定制 TCP 协议 SYN 请求，收到服务器 tcp 三次握手中的第二 个包，能收到回应，表示端口开放

```


### 僵尸扫描 - 实战

#### 第一步：使用 `Scapy` 给僵尸主机发送的 `SYN/ACK` 数据包，将返回的数据包存入 `rz1`

```kali
参数说明：
rz1 表示定义了一个变量来接受我们返回的数据包
dst 表示我们的僵尸主机 IP
dport=445 表示我们向僵尸主机的 445 端口发送数据包，XP 主机的 445 端口一般都是开启状态
flags=“SA”表示发送 SYN/ACK

┌──(root㉿kali)-[~]
└─# scapy    # 先进入scapy工具

>>> rz1=sr1(IP(dst="192.168.1.54")/TCP(dport=445,flags="SA"))     # 向僵尸主机发送数据包

>>> rz1.display()
```

#### 第二步：攻击者修改 `IP` 包头的 `SRC` 字段为僵尸主机的 `IP`，伪装成僵尸主机给目标主机发 `SYN` 请求

```kali
参数说明：
rt 表示定义了一个变量来接受我们返回的数据包
src 表示伪造成僵尸主机的 IP 地址
dst 表示将数据包发送目标主机
dport 目标端口
timeout 超时时间

>>> rt=sr1(IP(src="192.168.1.54",dst="192.168.1.63")/TCP(dport=22),timeout=1)     # 伪装成僵尸主机给目标主机发送数据包
```

#### 第三步：攻击者再次向僵尸主机发送 `SYN/ACK` 确认包，获得 `IPID`

```kali
rz2=sr1(IP(dst="192.168.1.54")/TCP(dport=445,flags="SA"))      # 再次向僵尸主机发送数据包，获得 IPID
```

#### 实验结果查看

```kali
>>> rz1.display()     # 查看rz1变量中IPID

>>> rz2.display()     # 查看rz2变量中IPID
```

