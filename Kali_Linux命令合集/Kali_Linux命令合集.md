
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


## 信息收集

```kali
┌──(root�xuegod53)-[~] 
└─# ping 12306.cn			# 查看域名ip

└─# nslookup 12306.cn		# 查看域名下详细ip

└─# dig 12306.cn			# 通过域名获取信息

└─# dig @114.114.114.114 12306.cn		# 指定进行域名解析的域名服务器查询信息

└─# dig @114.114.114.114 any 12306.cn	# 显示所有类型的域名记录查询信息

└─# dig -x 114.114.114.114				# 参数 IP 反查域名服务器

└─# dig txt chaos version.bing @ns3.dnsv4.com		查询 DNS 服务器 bind 版本信息

└─# whois 12306.cn			# 查询网站的域名注册信息和备案信息
```