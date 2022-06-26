
### 子域名介绍

顶级域名是域名的最后一个部分，即是域名最后一点之后的字母，例如在 `http://example.com` 这
个域名中，顶级域是`.com（或.COM）`，大小写视为相同

**常见的顶级域主要分 2 类：**


1. 通用顶级类别域名共 **6** 个， 包括用于科研机构的`.ac`；用于工商金融企业的`.com`；用于教育机构
的`.edu`；用于政府部门的`.gov`；用于互联网络信息中心和运行中心的`.net`；用于非盈利组织的`.org`

2. 国家及地区顶级域，如`".cn"`代表中国，`".uk"`代表英国等，地理顶级域名一般由各个国家或地区
负责管理。.jp 代表什么？

> [!note|style:flat]
> **子域名（Subdomain Name）**，凡顶级域名前加前缀的都是该顶级域名的子域名，而子域名根据技
术的多少分为二级子域名，三级子域名以及多级子域名


### 挖掘子域名的重要性

子域名是某个主域的二级域名或者多级域名，在防御措施严密情况下无法直接拿下主域，那么就可以
采用迂回战术拿下子域名，然后无限靠近主域。

例如：`www.xxxxx.com` 主域不存在漏洞，并且防护措施严密。而二级域名 `edu.xxxxx.com` 存
在漏洞，并且防护措施松散。


> - 子域名挖掘工具 ：`Maltego` 子域名挖掘机。
> 
> - 搜索引擎挖掘 如： 在 `Google` 中输入 `site:qq.com`
>
> - 第三方网站查询：http://tool.chinaz.com/subdomain、https://dnsdumpster.com/
>
> - 证书透明度公开日志枚举：https://crt.sh/ 、http://censys.io/
>
> - 其他途径：https://phpinfo.me/domain 、http://dns.aizhan.com


### 使用 `Maltego CE` 进行子域名挖掘

**先翻墙后，再注册**，因为注册过程的验证码是 google 的技术，不翻墙使用不了。


> **Maltego CE 官网：**https://www.paterva.com/web7/buy/maltego-clients/maltegoce.php

首先我们到官网注册一个账户，因为目前该工具不登录是不能正常使用的，同学们需要使用 gmail
邮箱或 163 进行注册。

> **注册帐号网址：**https://www.maltego.com/ce-registration/

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/1注册maltego账户.png" alt="1注册maltego账户" align=center />

##### `Maltego`注册时显示失败解决方法

###### `ReCaptcha`是什么

`recaptcha`是一个验证真人的验证码，简单的理解就是为了验证正在使用或注册的是人而不是机器，`recaptcha`的服务器一般都是在国外，所以国内使用该机制的时候，就会出现不可用的情况，尤其是在注册使用国外软件的时候

当你注册`Malitego`的时候，就会提示收到这样的问题，其他国外软件，应该也有同样的问题

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/Maltego注册时显示失败解决方法/1Maltego注册失败页.jpg" alt="1Maltego注册失败页" align=center />

###### 通过Firefox插件方式解决

首先需要下载Firefox浏览器，打开浏览器：点击最右上角的选项，选择其中的“扩展和主题”

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/Maltego注册时显示失败解决方法/2打开扩展插件.jpg" alt="2打开扩展插件" align=center />

点开之后，从搜索框搜索`gooreplacer`

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/Maltego注册时显示失败解决方法/3搜索gooreplacer插件.jpg" alt="3搜索gooreplacer插件" align=center />

选择相应的插件

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/Maltego注册时显示失败解决方法/4选择相应的插件.jpg" alt="4选择相应的插件" align=center />

点击打开后，点击“添加到Firefox”根据提示安装即可

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/Maltego注册时显示失败解决方法/5安装到浏览器插件.jpg" alt="5安装到浏览器插件" align=center />

对该插件进行调整配置，通过选项打开

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/Maltego注册时显示失败解决方法/6调整插件.jpg" alt="6调整插件" align=center />

点击其中的“新增”

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/Maltego注册时显示失败解决方法/7新增选项.jpg" alt="7新增选项" align=center />

对于其中匹配模式和目标地址进行填充

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/Maltego注册时显示失败解决方法/8配置插件.jpg" alt="8配置插件" align=center />

提交成功后，会看到原有界面增加了如下一行

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/Maltego注册时显示失败解决方法/9配置完成.jpg" alt="9配置完成" align=center />

到此表示插件安装成功，重新回到`Maltego`的注册页面，在填写相关内容后，会在点击注册按钮上面出现新的选项

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/Maltego注册时显示失败解决方法/10提交验证.jpg" alt="10提交验证" align=center />



出现以下信息表示已经向你的邮箱发送验证

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/2邮箱发送.png" alt="2邮箱发送" align=center />

登录 163 邮箱点击激活链接即可激活账户

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/3激活邮箱账户.png" alt="3激活邮箱账户" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/4邮箱激活成功.png" alt="4邮箱激活成功" align=center />

如果kali中没有`Maltego`工具，先安装工具程序

```kali
┌──(root㉿kali)-[~]
└─# apt update 		# 先检查更新

└─# apt install maltego			# 在执行安装软件

正在读取软件包列表... 完成
正在分析软件包的依赖关系树... 完成
正在读取状态信息... 完成                 
建议安装：
  maltego-teeth
下列【新】软件包将被安装：
  maltego
升级了 0 个软件包，新安装了 1 个软件包，要卸载 0 个软件包，有 1159 个软件包未被升级。
需要下载 136 MB 的归档。
解压缩后会消耗 228 MB 的额外空间。
获取:1 https://mirrors.ustc.edu.cn/kali kali-rolling/non-free amd64 maltego all 4.3.0-0kali1 [136 MB]
已下载 136 MB，耗时 31秒 (4,418 kB/s)                                                                                                      
正在选中未选择的软件包 maltego。
(正在读取数据库 ... 系统当前共安装有 289476 个文件和目录。)
准备解压 .../maltego_4.3.0-0kali1_all.deb  ...
正在解压 maltego (4.3.0-0kali1) ...
正在设置 maltego (4.3.0-0kali1) ...
正在处理用于 kali-menu (2021.4.2) 的触发器 ...
```


在应用程序—信息收集菜单中找到 `Maltego` 点击运行

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/5在kali中打开maltego.png" alt="5在kali中打开maltego" align=center />

第一次运行会提示我们使用哪个版本，我们选择 `Maltego CE` 版本也就是社区版

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/6选择maltego社区版.png" alt="6选择maltego社区版" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/7同意maltego安装协议.png" alt="7同意maltego安装协议" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/8等待安装完成.png" alt="8等待安装完成" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/9输入账号密码登录maltego.png" alt="9输入账号密码登录maltego" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/10确认maltego账号密码.png" alt="10确认maltego账号密码" align=center />

这一步会下载更新一些必要的组件，所以保持网络畅通，如果失败了重试即可。

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/11下载安装组件.png" alt="11下载安装组件" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/12自动发送错误报告.png" alt="12自动发送错误报告" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/13选择安装目录.png" alt="13选择安装目录" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/14隐私模式.png" alt="14隐私模式" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/15安装完成.png" alt="15安装完成" align=center />

我们新建一个空白项目

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/16新建空白项目.png" alt="16新建空白项目" align=center />

我们在左边搜索框中搜索 `domain`

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/17模板项目.png" alt="17模板项目" align=center />

我们拖动 `domain` 实体到空白项目中

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/18模板项目拖到空白页.png" alt="18模板项目拖到空白页" align=center />

编辑为自己想要搜索的二级域名，比如 `ke.qq.com`

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/19编辑二级域名.png" alt="19编辑二级域名" align=center />

改好后，回车

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/20确定好二级域名.png" alt="20确定好二级域名" align=center />

右键单击实体

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/21右键实体.png" alt="21右键实体" align=center />

查看一下子域

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/22查看子域.png" alt="22查看子域" align=center />

访问：`test.ke.qq.com`

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/23访问腾讯课堂测试版.png" alt="23访问腾讯课堂测试版" align=center />

右键点击可以选择我们想要查询的信息类型。我选择 NS 记录

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/24选择查询记录.png" alt="24选择查询记录" align=center />

`transforms` <kbd>[trænsˈfɔːmz]</kbd> 转换

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/25transforms转换.png" alt="25transforms转换" align=center />

我们可以看到查询出了非常多的内容，我们可以根据某个单独的信息进行进一步的查询 比如查询 IP
地址

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/26查询ip地址.png" alt="26查询ip地址" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/Maltego/使用Maltego收集子域名信息/使用 Maltego CE 进行子域名挖掘/27查看ip地址.png" alt="27查看ip地址" align=center />

这个查询功能非常强大，而且功能也很丰富，这里不能完全介绍，大家根据自己的需求进行查询即
可。

