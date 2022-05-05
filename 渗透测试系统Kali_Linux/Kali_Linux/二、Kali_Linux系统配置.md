
### 启用对 `root` 用户的访问


> 默认情况下，Kali2021.1 已交换为特权非 root 用户。这意味着 root 用户没有设置密码，并且在安装过程中创建的帐户是可以使用的帐户。可以重新启用对 root 用户的访问，但是不建议这样做。

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

┌──(kali㉿xuegod53)-[~] 
└─$ su - root 					# 切换 root 用户时，记得加一个减号-，这样可以彻底切换到 root 用户。 
密码：123456

┌──(root➓ xuegod53)-[~] 
└─# pwd
/root
```

下次登录 Kali 系统就可以使用 root 账号直接登录了。

### 查看当前使用的 `Shell` 类型

```kali  
┌──(root➓ xuegod53)-[~] 
└─# echo $SHELL					# 可以看到我们使用是zsh类型的shell。centos7使用的是bash类型的shell。zsh 功能更强，而且 zsh 完全兼容 bash 的用法和命令。
/usr/bin/zsh
```


## 配置 `Kali` 的 `apt` 命令在线安装包的源为国内源

### 配置 `apt` 国内源

> 因为 `Kali` 自带的源是国外的，经常会因为网络问题，而无法安装或更新软件包。而且国外的源速度很慢。所以我们直接使用国内的源，方便快速。

点击终端按钮或者右键桌面选择 在这里打开终端 打开终端

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/配置 Kali 的 apt 命令在线安装包的源为国内源/配置 apt 国内源/打开root终端.png" alt="打开root终端" align=center />

```kali  
┌──(root�xuegod53)-[~] 
└─# vim /etc/apt/sources.list
```

> <span style='color: red'>把第 2 行原来`kali`官方源前面加#号，注释了</span>：

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/配置 Kali 的 apt 命令在线安装包的源为国内源/配置 apt 国内源/注释kali官方源.png" alt="注释kali官方源" align=center />

在最后一行后面插入中科大 Kali 源：

```kali  
#中科大 Kali 源 
deb http://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib 
deb-src http://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
```

> [!tip|style:flat]
> <span style='color: red'>注</span>：复制上面两行内容，然后按下鼠标滚轮，就可以粘贴到文档中了。

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/配置 Kali 的 apt 命令在线安装包的源为国内源/配置 apt 国内源/复制中科大kali源.png" alt="复制中科大kali源" align=center />

----------

> [!attention|style:flat]
> <span style='color: red'>扩展： </span><br/>
> 1、复制：在 kali 终端下，使用鼠标选中内容，就可以完成 kali 下复制 <br/>
> 2、粘贴：移动光标到需要粘贴的位置，按下鼠标中间的滚轮，就可以粘贴

> [!note|style:flat]
> 说明：`deb` 代表软件的位置，`deb-src` 代表软件的源代码的位置

###### 使用 `apt` 新的软件包源获取最新的软件包列表。

> **`apt update` 的作用是从`/etc/apt/sources.list` 文件中定义的源中获取的最新的软件包列表**
> **即运行 `apt update` 并没有更新软件，而是相当于 windows 下面的检查更新，获取的是软件的状态**

```kali
┌──(root㉿kali)-[~]
└─# apt update 
```

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/配置 Kali 的 apt 命令在线安装包的源为国内源/配置 apt 国内源/apt获取最新的软件包列表.png" alt="apt获取最新的软件包列表" align=center />

发现已经在使用中科大的 kali 源了。

### 扩展：`kali` 的 `apt` 源

> **`Kali Rolling`**: 是 Kali 的即时更新版，只要 Kali 中有更新，更新包就会放入 Kali Rolling 中，供用户下载使用。它为用户提供了一个稳定更新的版本，同时会带有最新的更新安装包。这个是我们最常用的源

在 `Kali Rolling` 下有 3 类软件包：`main`、`non-free` 和 `contrib`

`Kali apt` 源的软件包类型说明：

| `dists` 区域   | 软件包组件标准       									     |
| :-----------: | :--------------------------------------------------------: |
| `main`        | 遵从 `Debian` 自由软件指导方针（DFSG），并且不依赖于 `non-free` |
| `contrib`     | 遵从 `Debian` 自由软件指导方针（DFSG），但依赖于 `non-free` 	 |
| `non-free`    | 不遵从 `Debian` 自由软件指导方针（DFSG）				         |

> [!note|style:flat]
> 注：`DFSG` 是 `Debian` 自由软件指导方针 (Debian Free Software Guidelines)，此方针中大体包括自由的再次发行、源代码、禁止歧视人士或者组织等规定

> `rolling` <kbd>[ˈrəʊlɪŋ]</kbd> 滚动的 ；<br/> 
> `contrib` <kbd>[kənˈtrɪb]</kbd> 贡献软件;贡献;普通发布版 <br/>
> `dists` 分布

> 我们手动查看一下 apt 源，直接访问：http://mirrors.ustc.edu.cn/kali/ 查看 dists 目录下的软件包

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/配置 Kali 的 apt 命令在线安装包的源为国内源/扩展kali的apt源/查看 dists 目录下的软件包1.png" alt="查看 dists 目录下的软件包1" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/配置 Kali 的 apt 命令在线安装包的源为国内源/扩展kali的apt源/查看 dists 目录下的软件包2.png" alt="查看 dists 目录下的软件包2" align=center />


> 或直接访问 http://mirrors.ustc.edu.cn/kali/dists/kali-rolling/ 可以看 3 类软件包

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/配置 Kali 的 apt 命令在线安装包的源为国内源/扩展kali的apt源/查看 dists 目录下的软件包3.png" alt="查看 dists 目录下的软件包3" align=center />


## `apt update`、`apt upgrade` 和 `apt dist-upgrade` 的区别

### `apt update`

```kali
┌──(root�xuegod53)-[~] 
└─# apt update
```

> [!note|style:flat]
> 注：`apt update` 的作用是从`/etc/apt/sources.list` 文件中定义的源中**获取的最新的软件包列表**<br/>
> 即运行 `apt update` 并没有更新软件，而是相当于 windows 下面的检查更新，获取的是软件的状态。

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/apt update、apt upgrade 和 apt dist-upgrade 的区别/apt update/查看apt update.png" alt="查看apt update" align=center />


> 会下载 http://mirrors.ustc.edu.cn/kali/dists/kali-rolling/ 中这个 `InRelease` 软件包列表

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/apt update、apt upgrade 和 apt dist-upgrade 的区别/apt update/下载 InRelease 软件包列表.png" alt="下载 InRelease 软件包列表" align=center />

把 `InRelease` 下载到本地，使用 word 打开可以查看软件包列表(用txt打开会卡死)，如下图：

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/apt update、apt upgrade 和 apt dist-upgrade 的区别/apt update/查看 InRelease 软件包列表.png" alt="查看 InRelease 软件包列表" align=center />

----------

> [!attention|style:flat]
> 以下两种升级系统的方式，大家先不要执行，因为执行消耗的时间太长：

### `apt upgrade`

> [!tip|style:flat]
> `apt upgrade` 则是根据 `update` 命令获取的最新的软件包列表，去**真正地更新软件**。

### `apt dist-upgrade`

> [!tip|style:flat]
> `apt dist-upgrade` 则是根据 `update` 命令获取的最新的软件包列表，去**真正地更新软件**。

### `apt upgrade` 和 `dist-upgrade` 的差别:


> * `upgrade`:升级时，如果软件包有相依性的问题，此软件包就不会被升级。 
>
> * `dist-upgrade` 升级时，如果软件包有相依性问题，会移除旧版，直接安装新版本. (所以通常 `dist-upgrade` 会被认为是有点**风险的升级**)

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/apt update、apt upgrade 和 apt dist-upgrade 的区别/apt upgrade 和 dist-upgrade 的差别/apt upgrade 和 dist-upgrade 升级的差别.png" alt="apt upgrade 和 dist-upgrade 升级的差别" align=center />


> 注：因为安装 av2 新版本时，需要依赖 dv2 库，而 gv1 这次没有升级，所以 gv1 还依赖 dv1。av2 升级后把 dv1 变为 dv2，这样 gv1 在调用 dv2 时，可能会有问题。如果 dv2 完全兼容 dv1，那么 gv1 直接调用 dv2，也没有问题，gv1 还可以正常运行。

> [!tip|style:flat]
> 对于个人和服务器上的操作一般情况使用：`apt upgrade` **稳定可靠升级就可以满足我们的需求了**。

> [!attention|style:flat]
> 最后，需要注意的一点是，**每回更新之前，我们需要先运行** `update`，然后才能运行 `upgrade` 和 `dist-upgrade`，因为相当于`update`命令获取了包的一些信息，比如大小和版本号，然后再来运行`upgrade` 去下载包，如果没有获取包的信息，那么 `upgrade` 就是无效的啦！

### `apt` 和 `apt-get` 区别

1. `apt` 命令概述： `apt` 是一条 linux 命令，适用于 deb 包管理式的操作系统，**主要用于自动从互联网 的软件仓库中搜索、安装、升级、卸载软件或操作系统**。deb 包是 Debian 软件包格式的文件扩展名。 

2. `apt` 可以看作 `apt-get` 和 `apt-cache` 命令的子集, 可以为包管理提供必要的命令选项。 

3. `apt` 提供了大多数与 `apt-get` 及 `apt-cache` 有的功能，但更方便使用 

4. `apt-get` 虽然没被弃用，但作为普通用户，还是应该**首先使用** `apt`。 <br/>

<span style='color: red'>注：`apt install` 和 `apt-get install` 功能一样，都是安装软件包，没有区别</span>。

常用命令：

| 操作命令  				  	  | 注释                        | 备注             |
| :-------------------------: | :-------------------------: | :-------------: |
| `apt install 【包名】apache2`| 安装软件包  				    | 输入 `n`，不安装 |
| `apt remove 【包名】apache2` | 移除软件包                   | 输入 `n`，不删除 |
| `apt update`    	 		  | 更新可用软件包列表      	    | 				  |
| `apt upgrade 【包名】apache2`| 通过 安装/升级 软件来更新系统  | 输入 `n`，不更新  |
| `apt full-upgrade`  		  | 通过 卸载/安装/升级 来更新系统 |				 |
| `vim /etc/apt/sources.list` | 编辑软件源信息文件			    | 				 |


## 关闭 kali 系统自动锁屏功能

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/关闭 kali 系统自动锁屏功能/设置—电源管理器.png" alt="设置—电源管理器" align=center />

----------

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/关闭 kali 系统自动锁屏功能/安全性.png" alt="安全性" align=center />

## 做一个虚拟机快照

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/做一个虚拟机快照/创建快照.png" alt="创建快照" align=center />

----------

<img src="assets/image/渗透测试系统Kali_Linux/Kali_Linux/二、Kali_Linux系统配置/做一个虚拟机快照/填写快照内容.png" alt="填写快照内容" align=center />

