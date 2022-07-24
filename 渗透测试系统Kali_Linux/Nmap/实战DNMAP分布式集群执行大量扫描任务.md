
<div align="center">
 <img src="assets/image/icon/dnmap.png" width = "500" height = "300" alt="dnmap" align=center />
</div>

**********************************************************

## `DNMAP` 集群简介

`dnmap` 是一个用 `python`写的进行分布式扫描的`nmap`扫描框架,我们可以用`dnmap`来通过多个台机器发起一个大规模的扫描,`dnmap`采用`C/S`结构,执行大量扫描任务时非常便捷,扫描结果可以统一管理

## `DNMAP`安装

对于之前的`Kali Linux`系统而言，其自带有`DNMAP`，但是对于一些最新的`Kali Linux`系统而言，`DNMAP`默认没有安装，这样，我们就需要自行安装`DNMAP`。

> `DNMAP`下载地址为：https://sourceforge.net/projects/dnmap/

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/实战 DNMAP 分布式集群执行大量扫描任务/DNMAP 安装/dnmap官网下载地址.png" alt="dnmap官网下载地址" align=center />

下载`DNMAP`的安装包

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/实战 DNMAP 分布式集群执行大量扫描任务/DNMAP 安装/下载DNMAP的安装包.png" alt="下载DNMAP的安装包" align=center />

解压该安装包

```kali
参数说明：
-z ：通过gzip方式压缩或解压，最后以.tar.gz 为后缀
-j ：通过bzip2方式压缩或解压，最后以.tar.br2 为后缀。压缩后大小小于.tar.gz
-x ：解开一个压缩文件的参数指令
-v ：显示压缩过程
-f ：使用档名，请留意，在 f 之后要立即接档名喔！不要再加参数！

┌──(root xuegod53)-[~]
└─# tar xf dnmap_v0.6.tgz	# 解压该安装包
```

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/实战 DNMAP 分布式集群执行大量扫描任务/DNMAP 安装/解压后文件.png" alt="解压后文件" align=center />

进入到解压后的文件中，发现里面有四个文件

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/实战 DNMAP 分布式集群执行大量扫描任务/DNMAP 安装/解压后的四个文件.png" alt="解压后的四个文件" align=center />

`DNMAP`解压即用，从上图中可以看出，`dnmap`有两个可执行文件，它们分别是`dnmap_client`和`dnmap_server`。在进行`DNMAP`分布式扫描前，我们需要先使用`dnmap_server`来生成`DNMAP`的服务端，然后在其他设备上使用`dnmap_client`进行链接，然后就可以进行`DNMAP`的分布式扫描了


## 实验场景:使用4台位于不同区域的`kali`服务器对A类网段时行扫描

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/实战 DNMAP 分布式集群执行大量扫描任务/实验场景/分布式大规模扫描图.jpg" alt="分布式大规模扫描图" align=center />

用户在服务器端设定好`nmap`执行的命令，`dnmap`会自动的分配给客户端进行扫描，并将扫描结果提交给服务器。

`dnmap`有两个可执行文件，分别是`dnmap_client`何`dnmap_server`。在进行一个分布式`namp`扫描之前，我们可以用`dnmap_server`来生成一个`dnmap`的服务端，然后在其他机器用`dnmap_client`进行连接。然后就能进行分布式的`nmap`扫描了。


### 生成证书文件

因为`dnmap`自带的用于`TLS`连接的`pem`文件证书太过久远，必须要重新生成一个`pem`证书，客户端和服务器才能正常连接通信

```kali
┌──(root xuegod53)-[~]
└─# openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out server.pem	# 该命令表示使用RSA算法，产生2048位的密钥，以及使用X509格式的证书，证书有效期为365天，密钥输出为key.pem，证书输出为server.pem
```

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/实战 DNMAP 分布式集群执行大量扫描任务/实验场景/生成证书文件/生成pem证书.png" alt="生成pem证书" align=center />

```kali
Country Name (2 letter code) [AU]: CN	# 国家名称(2个字母代码)
State or Province Name (full name) [Some-State]:beijing		# 州或省名(全称)
Locality Name (eg,city) []:haidian		# 地点名称(如城市)
Organization Name (eg, company) [Internet Widgits Pty Ltd]:xuegod		# 机构名称(如公司)
Organizational Unit Name (eg, section) []:IT		# 组织单位名称(如部门)
Common Name (e.g. server FQDN or YOUR name) []:xuegod.cn		# 常用名(如服务器FQDN或你的名字)
Email Address[]:mk@163.com		# 邮件地址
```
以上信息可以按照要求填写也可以随意填写。

查看新生成的证书`server.pem`

```kali
┌──(root xuegod53)-[~]
└─# Is /root/server.pem
```

把密钥追加到证书的后面

```kali
参数说明：
cat ：用于显示、查看、编辑文件内容
“>”和“>>”符号都是输出重定向符号，但使用“>”，目标文件中的内容将会被覆盖；使用“>>”，重定向的内容将追加在目标文件内容之后，原目标文件中的内容将保留

┌──(root xuegod53)-[~]
└─# cat key.pem >> server.pem	# 把key.pem密钥内容追加到server.pem证书中
```


### 创建`NMAP` 命令文件

> [!note|style:flat]
> 这一步很简单我们只需要将扫描的命令添加到一个文件中即可,每行一条命令。客户端启动后会主动找服务端要任务。当客户端执行完后,会再找服务端要任务。

```kali
┌──(root xuegod53)-[~]
└─# vim nmap.txt 	# 插入以下内容

nmap 101.200.128.30-31
nmap 101.200.128.32-33
nmap 101.200.128.34-35
nmap 101.200.128.36-37
nmap 101.200.128.38-40
```

### 启动DNMAP集群

使用`dnmap_server`启动`dnmap`的服务端

```kali
参数说明：
-f ：跟一个待会要执行的nmap命令的文件
-P ：跟一个用于TLS连接的pem文件，默认是使用随服务器提供的 server.pem

┌──(root xuegod53)-[~]
└─# /user/bin/dnmap_server -f nmap.txt -P server.pem
```

<span style='color: red'>如启动服务器端报错，可致参考文献查看</span>

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/实战 DNMAP 分布式集群执行大量扫描任务/实验场景/启动 DNMAP 集群/启动 dnmap 服务端监听客户端.png" alt="启动 dnmap 服务端监听客户端" align=center />

使用 `dnmap_client` 启动 `dnmap` 的多个客户端扫描，将结果

```kali
参数说明：
-s ：输入dnmap的服务器地址.
-p ：dnmap服务的端口号， 默认是46001

┌──(root xuegod53)-[~]
└─# /user/bin/dnmap_client -s 192.168.1.53
```

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/实战 DNMAP 分布式集群执行大量扫描任务/实验场景/启动 DNMAP 集群/客户端扫描结果.png" alt="客户端扫描结果" align=center />

客户端连接成功之后就会执行 `namp.txt` 中的命令

然后服务端就会输出以下信息

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/实战 DNMAP 分布式集群执行大量扫描任务/实验场景/启动 DNMAP 集群/服务端输出扫描信息.png" alt="服务端输出扫描信息" align=center />

等看到客户端命令都执行完成了

```kali
┌──(root xuegod53)-[~]
└─# ls

┌──(root xuegod53)-[~]
└─# cd nmap_results

┌──(root xuegod53)-[~]
└─# ls

20311509.nmap 23080905.nmap 34059114.nmap 66903887.nmap 7944810.nmap
```

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/实战 DNMAP 分布式集群执行大量扫描任务/实验场景/启动 DNMAP 集群/完成扫描结果生成文件.png" alt="完成扫描结果生成文件" align=center />

查看一下文件的具体内容

```kali
┌──(root xuegod53)-[~]
└─# cat 93929059.nmap
```

输出的信息和我们手动执行命令是一致的。

<img src="assets/image/渗透测试系统Kali_Linux/Nmap/实战 DNMAP 分布式集群执行大量扫描任务/实验场景/启动 DNMAP 集群/查看文件的扫描内容.png" alt="查看文件的扫描内容" align=center />



