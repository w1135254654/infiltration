
## `nc` 的作用


> - 实现任意 `TCP/UDP` 端口的侦听，`nc` 可以作为 `server` 以 `TCP` 或 `UDP` 方式侦听指定端口
> 
> - 端口的扫描，`nc` 可以作为 `client` 发起 `TCP` 或 `UDP` 连接
> 
> - 机器之间传输文件
> 
> - 机器之间网络测速


```kali
参数说明：
-nv 表示我们扫描的目标是个 IP 地址不做域名解析
-w 表示超时时间
-z 表示进行端口扫描
1-100	表示端口号，也可以指定端口号扫描

┌──(root xuegod53)-[~]
└─# nc -nv -w 1 -z 192.168.1.1 1-100		# 扫描ip的端口是否开放

(UNKNOWN) [192.168.1.1] 80 (http) open
(UNKNOWN) [192.168.1.1] 23 (telnet) : Connection timed out
(UNKNOWN) [192.168.1.1] 21 (ftp) open
```

<img src="assets/image/渗透测试系统Kali_Linux/netcat/nc的作用/使用 nc 扫描端口.png" alt="使用 nc 扫描端口" align=center />


