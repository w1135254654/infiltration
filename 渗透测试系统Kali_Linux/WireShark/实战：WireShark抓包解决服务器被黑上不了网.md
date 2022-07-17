
> 场景：服务器被黑上不了网，可以 `ping` 通网关，但是不能上网

## 模拟场景

```kali
修改主机 TTL 值为 1，下面的方式是我们临时修改内核参数。

┌──(root➓ xuegod53)-[~] 
└─# echo "1" > /proc/sys/net/ipv4/ip_default_ttl	# 修改主机 TTL 值为 1，修改内核参数
```

> - `TTL` ： 数据报文的生存周期。
> 
> - **默认 `linux` 操作系统值：64**，每经过一个路由节点，`TTL` 值减 1。`TTL` 值为 0 时，说明目标地址不可达并返回：`Time to live exceeded`
> 
> - **作用**： 防止数据包，无限制在公网中转发。我们测试结果


```kali
┌──(root➓ xuegod53)-[~] 
└─# ping 192.168.1.1 -c 1
```

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包解决服务器被黑上不了网/模拟场景/ping网关.png" alt="ping网关" align=center />

```kali
┌──(root➓ xuegod53)-[~] 
└─# ping xuegod.cn -c 1
```

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包解决服务器被黑上不了网/模拟场景/ping网址.png" alt="ping网址" align=center />

> 可以看到提示我们 `Time to live exceeded` 这表示超过生存时间

> [!note|style:flat]
> 我们判断和目标之间经过多少个网络设备是根据目标返回给我们的 `TTL` 值来判断的，因为我们发送的数据包是看不到的。

实战抓包分析数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包解决服务器被黑上不了网/模拟场景/分析数据包icmp.png" alt="分析数据包icmp" align=center />

开启抓包，过滤 `icmp` 协议

```kali
┌──(root➓ xuegod53)-[~] 
└─# ping xuegod.cn -c 1
```

回到 `WireShark` 中查看数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包解决服务器被黑上不了网/模拟场景/到 WireShark 中查看数据包.png" alt="到 WireShark 中查看数据包" align=center />

图片较长截取重要部分的信息提示截图的是 `info` 字段内容

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包解决服务器被黑上不了网/模拟场景/info 字段内容.png" alt="info 字段内容" align=center />


> 可以看到第一个包是发送了一个 `ping` 请求包 `ttl=1`
> 
> 收到了 `192.168.1.1` 返回给我们的数据包告诉我们超过数据包生存时间，数据包被丢弃。


把 `TTL` 值修改成 `2` 会有什么效果呢？

```kali
修改主机 TTL 值为 2，下面的方式是我们临时修改内核参数。

┌──(root➓ xuegod53)-[~] 
└─# echo "2" > /proc/sys/net/ipv4/ip_default_ttl	# 修改主机 TTL 值为 2，修改内核参数

└─# ping xuegod.cn -c 1
```

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包解决服务器被黑上不了网/模拟场景/抓取TTL 值2数据包.png" alt="抓取TTL 值2数据包" align=center />

> [!note|style:flat]
> 我们对比数据包发现返回我们数据包被丢弃的源地址变成了 `112.103.140.1`，这证明了数据包在网络 中已经到达了下一个网络设备才被丢弃，由此我们还判断出我们的运营商网关地址为 `112.103.140.1` 但是我们并没有到达目标主机。


**恢复系统内核参数**

```kali
修改主机 TTL 值为 64，修改内核参数。

┌──(root➓ xuegod53)-[~] 
└─# echo "64" > /proc/sys/net/ipv4/ip_default_ttl	# 修改主机 TTL 值为 64，修改内核参数

└─# ping xuegod.cn -c 1
```

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包解决服务器被黑上不了网/模拟场景/恢复系统内核参数.png" alt="恢复系统内核参数" align=center />

> **目标返回给我们的 `TTL` 值为 `52`，这表示我们的 `TTL` 值需要大于 `64-52=12` 才可以访问 `xuegod.cn`**


## `MTR` 可以检测到达目标网络之间的所有网络设备的网络质量

> 默认系统是没有安装 `MTR` 工具的我们手动安装一下

```kali
修改主机 TTL 值为 64，修改内核参数。

┌──(root➓ xuegod53)-[~] 
└─# apt install -y mtr	# 安装 MTR 工具
```

**例**：检测到达 `xuegod.cn` 所有节点的通信质量

```kali
┌──(root➓ xuegod53)-[~] 
└─# mtr xuegod.cn	# 检测到达 xuegod.cn 所有节点的通信质量
```

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包解决服务器被黑上不了网/MTR 检测到达目标网络之间的所有网络设备的网络质量/检测网络设备的网络质量.png" alt="检测网络设备的网络质量" align=center />

> **可以看到从我当前主机到目标主机之间经过 `12` 跳。**


