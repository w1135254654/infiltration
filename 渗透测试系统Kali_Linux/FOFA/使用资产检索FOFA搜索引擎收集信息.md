
### `FOFA` 基础语法

详细语法规则请参考 `FOFA` 官网 https://FOFA.so/ ，以下仅以实战角度出发总结常用语法。

#### `titles` 网站标题

| 说明   				          | 语法    	          |  注释  		         |
| :-----------------------------: | :---------------: | :------------------: |
| 搜索 `title` 中包含北京的资产     | `title="beijing"` | 从标题中搜索“北京”    |
| 搜索 `title` 中包含学神教育的资产 | `title="学神教育"` | 从标题中搜索“学神教育” |

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/title 语法搜索.png" alt="title 语法搜索" align=center />

获取到 1 条独立 IP 的资产。
但是有 3 条记录。 这三条记录对应的都是同一台服务器

> - `www.12306.cn` 
> - `xuegod.cn` 
> - `101.200.128.35` 

#### `body` 页面内容

`body` 可以通过页面中包含的特定字符串来搜索资产

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/查询body信息.png" alt="查询body信息" align=center />


| 说明   			   | 语法    	                |  注释  		  |
| :------------------: | :------------------------: | :-------------: |
| 搜索body中包含内容信息 | `body="WELCOME TO XUEGOD"` | 从内容中搜索信息 |

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/body 语法搜索.png" alt="body 语法搜索" align=center />

同样可以通过 `body` 定位到学神资产

#### `domain` 域名

搜索域名中包含 `xuegod.cn` 的资产，此方法相当于子域名的搜索

| 说明   			   | 语法    	          |  注释  		   |
| :------------------: | :------------------: | :------------: |
| 搜索域名中包含内容信息 | `domain="xuegod.cn"` | 从域名中搜索信息 |

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/domain 语法域名搜索.png" alt="domain 语法域名搜索" align=center />

共 4 条记录 3 条独立 ip 

> - `www.xuegod.cn` 
> - `xuegod.cn` 
> - `shop.xuegod.cn` 
> - `bbs.xuegod.cn`


#### 实战-`FOFA` 根据地区搜索

| 说明   			   	 | 语法    	           |  注释  		            |
| :--------------------: | :-----------------: | :------------- ------: |
| 搜索指定国家(编码)的资产 | `country="CN"` 	   | 从内容中搜索指定国家编码 |
| 搜索指定行政区的资产 	 | `region="Xinjiang"` | 从内容中搜索行政区 <kbd>[ˈriːdʒən]</kbd> 区域 |
| 搜索指定城市的资产 		 | `city="beijing"`    | 从内容中搜索城市 		|


排除地区方法使用 `!=`

例如在通过 `domain` 搜索资产的时候会有香港的服务器，那如何排除香港的服务器？ <br/>
`domain="xuegod.cn" && region!="HK"` 通过语法组合进行筛选，**`&&`表示左右 `2` 个条件都需要满足**，左边条件为包含 `xuegod.cn` 域名的资产，右边条件则为地区不等于 `HK`，`HK` 表示香港。这样就能够帮我们定位到不包含香港服务器的资产

通过组合条件使搜索更加精准 <br/>
`(domain="xuegod.cn" && region!="HK") && body="WELCOME TO XUEGOD"` 搜索 `xuegod.cn` 域名排除香港的资产列表，并且 `body` 中包含 `WELCOME TO XUEGOD`

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/按地区查找资产.png" alt="按地区查找资产" align=center />

这样我们可以精准定位到 `xuegod` 官网，虽然看起来有些多余，但是在实战中我们搜索资产的时候会 有很多意外符合条件的资产被我们搜索到，所以多个条件组合可以帮我们把搜索结果筛选的更加准确


#### 实战-`FOFA` 通过 `icon` 图标搜索资产

`icon` 是网站的图标也就是每个网站 `title` 上显示的图片

例如小米官网：`https://www.mi.com/`

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/通过 icon 图标搜索资产/小米官网.png" alt="小米官网" align=center />

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/通过 icon 图标搜索资产/搜索icon图片.png" alt="搜索icon图片" align=center />

拷贝 `link address`

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/通过 icon 图标搜索资产/复制图片地址.png" alt="复制图片地址" align=center />

下载保存 `icon` 图片`https://s01.mifile.cn/favicon.ico`

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/通过 icon 图标搜索资产/下载保存图片.png" alt="下载保存图片" align=center />

`FOFA` 搜索可以将下载的文件直接拖进来

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/通过 icon 图标搜索资产/FOFA 搜索图标.png" alt="FOFA 搜索图标" align=center />

`FOFA` 会自动计算 `icon` 的 `hash` 值，然后通过 `hash` 值进行搜索资产。 `icon_hash="-472588776"`

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/通过 icon 图标搜索资产/FOFA搜索图标资产.png" alt="FOFA搜索图标资产" align=center />

通过 `icon` 可以搜索到所有使用了相同 `icon` 的站点，但是需要注意的是这个文件任何网站都可以使用， 所以会有非小米官方的资产被收集到。并且小米前一阵子更换了新的 `icon`，所以一定会有旧的资产没有更换为新的 `icon`，所以大家掌握方法的时候也需要把实际问题带入进来，思考如何解决


#### 实战-`FOFA` 通过 `JavaScript` 文件查询

通过页面中包含的 `js` 文件进行查询定位，比如 `xuegod` 官网，使用 Chrome 浏览器访问： `www.12306.cn`，右键空白处查看源代码

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/通过 JavaScript 文件查询/查找js文件.png" alt="查找js文件" align=center />

| 说明   			   			   | 语法    	           					  |  注释  		            |
| :------------------------------: | :---------------------------------------: | :-----------------------: |
| 通过 `JavaScript` 文件查询搜索资产 | `js_name="./script/core/lib/require.js"` | 通过 `JavaScript` 文件查询搜索资产 |

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/通过 JavaScript 文件查询/JavaScript 语法搜索.png" alt="JavaScript 语法搜索" align=center />


这种使用方法和 `body` 实际使用起来类似。但是通过 `js_name` 搜索到的内容比 `body` 少很多。 `body="./script/core/lib/require.js"`

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/通过 JavaScript 文件查询/body 语法搜索JavaScript 文件.png" alt="body 语法搜索JavaScript 文件" align=center />


#### 实战-通过使用 `FOFA` 规则列表搜索 `CMS` 资产

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/规则列表搜索 CMS 资产/选择规则列表.png" alt="选择规则列表" align=center />

搜索使用了 `CMS` 框架的网站

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/规则列表搜索 CMS 资产/搜索使用了 CMS 框架的网站.png" alt="搜索使用了 CMS 框架的网站" align=center />


> **点击后自动调用 `FOFA` 语法：`app="友点建站-CMS"`**

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/规则列表搜索 CMS 资产/app 语法搜索.png" alt="app 语法搜索" align=center />

这样全网使用`“友点建站-CMS”`的资产全部被搜索出来

有时我们搜索产品的时候可能需要指定对应的版本号进行搜索，但是 `fofa` 内置的应用规则中绝大部分 是不支持指定版本号进行搜索的，此时可以通过提取页面中的特征来进行定位

例如：`discuz` 论坛 选择 `Tencent-discuz`

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/规则列表搜索 CMS 资产/指定搜索版本.png" alt="指定搜索版本" align=center />

`app="Tencent-Discuz"`

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/规则列表搜索 CMS 资产/指定版本搜索特点资产.png" alt="指定版本搜索特点资产" align=center />


现在确定 `Discuz! x3.4` 版本存在 `sql` 注入漏洞，如何定位 `Discuz! x3.4` 版本的资产？

在论坛首页中，查看源代码可以看到对应的版本信息。页面中的信息我们可以通过 `body` 参数检索。 

- `<meta name="generator" content="Discuz! X3.4" />`
- `<meta name="author" content="Discuz! Team and Comsenz UI Team" />`
- `<meta name="copyright" content="2001-2021 Tencent Cloud." />` 

构造搜索条件：`app="Tencent-Discuz" && body="Discuz! X3.4"`

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/规则列表搜索 CMS 资产/搜索漏洞资产.png" alt="搜索漏洞资产" align=center />

搜索中国台湾地区所有的 `Discuz! X3.4` 论坛 <br/>
`app="Tencent-Discuz" && body="Discuz! X3.4"&& region="TW"`

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/规则列表搜索 CMS 资产/按地区搜索漏洞资产.png" alt="按地区搜索漏洞资产" align=center />

`fofa` 也可以查看网络摄像头。如下，大家感兴趣，可以查看一下。 *所以大家买的摄像头，一定要修 改一下默认密码*

<img src="assets/image/渗透测试系统Kali_Linux/FOFA/使用资产检索 FOFA 搜索引擎收集信息/FOFA 基础语法/规则列表搜索 CMS 资产/搜索摄像头资产.png" alt="搜索摄像头资产" align=center />

