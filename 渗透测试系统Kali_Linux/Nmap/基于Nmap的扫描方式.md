
## `Nmap` 的基本扫描方式

扫描 `192.168.1.0` 这个网段

> [!note|style:flat]
> `192.168.1.0/24`代表什么意思呢<br/>
> 它表示的是一个`IP`网段，起始`IP`为`192.168.1.1`，子网掩码是`24`位，我们都知道计算机里的数据都是用`0`和`1`来表示的，用`4`个字节，也就是`32`位表示一个`IP`地址，子网掩码`24`位代表从高位到低位连续的`1`的个数为`24`个，二进制表示即`11111111 11111111 11111111 00000000`，也就是`255.255.255.0`

```kali
参数说明：-sn 表示只 ping 扫描，不进行端口扫描

┌──(root xuegod53)-[~]
└─# nmap -sn 192.168.1.0/24		# 扫描在线存活主机

或

┌──(root xuegod53)-[~]
└─# nmap -sn 192.168.1.1-254		# 扫描在线存活主机
```


## 使用 `nmap` 进行半连接扫描

`nmap` 扫描类型主要有 <span style='color: red'>`TCP` 的全连接扫描（会在被扫描机器留下记录），半连接扫描（不会留下记录）</span>

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/基于 Nmap 的扫描方式/使用 nmap 进行半连接扫描/全连接和半连接扫描的区别.png" alt="全连接和半连接扫描的区别" align=center />

```kali
参数说明：
-p  表示端口号
-sS 表示使用 SYN 进行半连接扫描，去掉该参数表示使用全连接扫描

┌──(root xuegod53)-[~]
└─# nmap -sS 127.0.0.1 -p 80,81,21,25,110,443		# 查看指定哪些端口是开放的

或

┌──(root xuegod53)-[~]
└─# nmap -sS 101.200.128.35 -p 0-3000		# 扫描哪些端口是开放的
```

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/基于 Nmap 的扫描方式/使用 nmap 进行半连接扫描/半连接扫描端口.png" alt="半连接扫描端口" align=center />


## 使用 `nmap` 进行僵尸扫描

扫描 `192.168.1.0` 网段中某些机器可以作为僵尸主机

```kali
参数说明：
-p 1-1024 #指定扫描的端口范围为 1 到 1024。只扫描常用端口就可以了
--script=ipidseq.nse 判断主机是否可以当做僵尸主机

┌──(root xuegod53)-[~]
└─# nmap 192.168.1.0/24 -p 1-1024 --script=ipidseq.nse > a.txt	# 扫描哪些主机ipId是自增的
```

```kali
┌──(root xuegod53)-[~]
└─# vim a.txt #在文档中查找关键字 Incremental
```

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/基于 Nmap 的扫描方式/使用 nmap 进行僵尸扫描/查看哪些主机ipId是自增的.png" alt="查看哪些主机ipId是自增的" align=center />

`Incremental` 英 <kbd>[ˌɪnkrɪˈmɛnt(ə)l]</kbd> 增量式;增量备份;增量的;渐进的;增量法

**表示主机 `IPID` 为递增，可以做为僵尸主机。**

另外发现 `192.168.1.32` 也可以的。

```kali
Nmap scan report for 192.168.1.32
Host is up (0.0069s latency).
All 1024 scanned ports on 192.168.1.32 are closed
MAC Address: 00:EC:0A:C9:62:83 (Xiaomi Communications)
Host script results:
|_ipidseq: Incremental!
```

`192.168.1.32` 是一台什么服务器，是哪个厂商？

```kali
┌──(root xuegod53)-[~]
└─# netdiscover #可以出来
```

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/基于 Nmap 的扫描方式/使用 nmap 进行僵尸扫描/查看服务器是哪个厂商.png" alt="查看服务器是哪个厂商" align=center />

> [!note|style:flat]
> 注：我们发现不仅 `XP` 可以做僵尸主机，各种 `android` 手机的 `IPID` 也是递增，也可以做僵尸主机。

```kali
参数说明：
63 为目标主机
-sI 参数表示指定僵尸主机进行扫描目标主机。注意是 I 大写的 
54 为僵尸主机
-p 1-100 #指定扫描的端口范围为 1 到 100

┌──(root xuegod53)-[~]
└─# nmap 192.168.1.63 -sI 192.168.1.54 -p 1-100	# 指定僵尸主机进行扫描目标主机
```

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/基于 Nmap 的扫描方式/使用 nmap 进行僵尸扫描/指定僵尸主机进行扫描目标主机.png" alt="指定僵尸主机进行扫描目标主机" align=center />

