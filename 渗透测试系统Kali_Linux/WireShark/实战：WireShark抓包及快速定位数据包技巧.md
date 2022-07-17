
## 使用 `WireShark` 进行抓包

### 启动 `WireShark`

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/启动 WireShark.png" alt="启动 WireShark" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/选择我们的网卡.png" alt="选择我们的网卡" align=center />

双击网卡之后就会自动进行抓包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/自动抓取数据包.png" alt="自动抓取数据包" align=center />

### 混杂模式介绍

**混杂模式概述：**混杂模式就是接收所有经过网卡的数据包，包括不是发给本机的包，即不验证 `MAC` 地址。普通模式下网卡只接收发给本机的包（包括广播包）传递给上层程序，其它的包一律丢弃。 

> 一般来说，混杂模式不会影响网卡的正常工作，多在网络监听工具上使用。

关闭和开启混杂模式方法

关闭和开启混杂模式前，需要停止当前抓包。如下，停止捕获。

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/停止当前抓包.png" alt="停止当前抓包" align=center />

在程序的工具栏中点击 **捕获->选项**

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/切换捕获选项.png" alt="切换捕获选项" align=center />

在选项设置界面中的 **输出** 设置栏的左下方勾选 **在所有接口上使用混杂模式** 

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/开启混杂模式.png" alt="开启混杂模式" align=center />

这样就开启了。默认就是开启混杂模式。


### `WireShark` 的过滤器使用

我们开启混淆模式来做一下感受，我们再次捕获---**在所有接口上使用混杂模式就可以直接进行抓包**

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/使用混杂模式抓包.png" alt="使用混杂模式抓包" align=center />

下面我们打开浏览器访问以下百度。

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/访问百度.png" alt="访问百度" align=center />

访问完成后点击停止抓包即可，我们不需要抓太多的数据包。

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/筛选数据包.png" alt="筛选数据包" align=center />

我们可以看到有很多数据包但是我们怎么才能**找到对应的数据包类型**呢？

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/过滤器.png" alt="过滤器" align=center />

这里就是我们的过滤器，我们可以根据自己的条件**筛选自己想要的数据包**。

**例 1**：使用过滤器筛选 `TCP` 的数据包 **注意：筛选条件我们都使用小写就好了，大写的话会不识别**。

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/筛选 TCP 数据包.png" alt="筛选 TCP 数据包" align=center />

**例 2**：使用过滤器筛选 `arp` 的数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/筛选 arp 数据包.png" alt="筛选 arp 数据包" align=center />

**例 3**：使用过滤器筛选 `udp` 的数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/筛选 udp 数据包.png" alt="筛选 udp 数据包" align=center />


> 我们使用过滤器输入`udp`以筛选出 `udp` 报文。但是为什么输入 `udp` 之后出现那么多种协议呢？ 原因就是 `oicq` 以及 `dns` 都是基于 `udp` 的传输层之上的协议

> [!note|style:flat]
> 扩展：客户端向 `DNS` 服务器查询域名，一般返回的内容都不超过 `512` 字节，用 `UDP` 传输即可。不用经过三次握手，这样 `DNS` 服务器负载更低，响应更快。理论上说，客户端也可以指定向 `DNS` 服务器查询时用 `TCP`，但事实上，很多 `DNS` 服务器进行配置的时候，仅支持 `UDP` 查询包。

**例 4**：使用过滤器筛选 `http` 的数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/筛选 http 数据包.png" alt="筛选 http 数据包" align=center />

**例 5**：使用过滤器筛选 `dns` 的数据包

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/筛选 dns 数据包.png" alt="筛选 dns 数据包" align=center />

其实我们不仅可以对协议类型进行筛选，我们还有跟多的筛选条件，比如源地址目的地址等等。。。

**例 6**：筛选源地址是 `192.168.1.53` 或目的地址是 `192.168.1.1`

在终端 `ping 192.168.1.1`

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/终端 ping 192.168.1.1.png" alt="终端 ping 192.168.1.1" align=center />

然后修改筛选器条件为： 

```kali
参数说明：
ip.src_host == 192.168.1.53 表示源 IP 地址 
ip.dst_host == 192.168.1.1 表示目的地址

ip.src_host == 192.168.1.53 or ip.dst_host == 192.168.1.1
```

我们中间用 `or` 进行了拼接，表示**或** 当然我们也可以使用 `and` 表示与，`or` 表示满足左右其中一个条 件就会显示符合条件的数据包，`and` 表示左右 `2` 个条件都满足才会显示。

`or`

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/or条件筛选.png" alt="or条件筛选" align=center />

`and`

<img src="assets/image/渗透测试系统Kali_Linux/WireShark/实战：WireShark抓包及快速定位数据包技巧/and条件筛选.png" alt="and条件筛选" align=center />

我们可以很直观的看到结果的不同。

