
[![](https://ci.appveyor.com/api/projects/status/xunqytmi7anspfih?svg=true)](https://ci.appveyor.com/project/xucongli1989/XCLCMS)


## 简介
XCLCMS是一个**轻量级**的CMS（内容管理系统）**后台管理系统**，使用asp.net mvc开发，提供简单易用的web api 接口，支持单个商户对应多个应用，您可以免费使用它构建属于自己的博客、分类信息、企业展示等网站或其它App应用。

## 特点
- 一个后台，多个前台应用界面（根据应用号来区分，每个商户下可拥有多个应用，如：使用本系统来管理多个博客或企业站的内容）
- 提供轻量级的Web Api，快速接入新的应用
- 对新功能的扩展无太多技术要求
- 简单实用，适用于个人与中小企业（适合自己的，才是最好的）
- 本系统为后台管理系统，各个前台应用需要自己根据Web API来实现

## 适用场景

- 已有一个移动端App，但无后台管理，想通过一个管理系统来实现App数据的更新
- 想快速搭建一个博客或企业站的前台数据展示页面
- 想搭建多个博客、企业站、APP，但只想使用一个后台来维护所有数据
- 只想纯粹使用该后台系统，然后扩展一些业务模块

## 软件架构
1. 使用C# & ASP.NET MVC 5 构建（.Net Framework 4.6）
2. 数据库使用MSSQL2012
3. 界面框架使用jQuery easyUI
4. 前台脚本：jQuery,Javascript,TypeScript

## 项目结构
1. XCLCMS.Data.BLL：数据业务层
2. XCLCMS.Data.CommonHelper：数据层公共处理
3. XCLCMS.Data.DAL：数据库访问层
4. XCLCMS.Data.Model：数据实体层
5. XCLCMS.Data.WebAPIEntity：Web Api数据实体层
6. XCLCMS.Document：项目文档相关
7. XCLCMS.FileManager：文件管理与上传web站点
8. XCLCMS.Lib：前台公共处理库
9. XCLCMS.View.AdminWeb：后台管理系统web站点（**管理后台站点入口**） 
10. XCLCMS.IService.WebAPI：Web Api服务定义层
11. XCLCMS.IService.Logger：日志记录服务定义层
12. XCLCMS.Service.WebAPI：Web Api服务逻辑实现层
13. XCLCMS.Service.Logger：日志记录服务实现层
14. XCLCMS.WebAPI：Web Api http服务提供层（**Web API站点入口**）

## 基本功能

- 文章管理
- 产品管理
- 用户管理
- 商户管理
- 友情链接管理
- 评论管理
- 文件管理
- 角色权限管理
- 广告位管理
- 标签管理

## 部署说明

[请参见部署说明文档](https://github.com/xucongli1989/XCLCMS/blob/master/%E5%A6%82%E4%BD%95%E9%83%A8%E7%BD%B2.md)

## 案例
- 博客站点前台：[我的ABC](http://www.wodeabc.com)
- Web API文档：[http://cms.wodeabc.com/api/help](http://cms.wodeabc.com/api/help) 或 [http://cms.wodeabc.com/api/swagger/](http://cms.wodeabc.com/api/swagger/)
- 管理后台（[http://cms.wodeabc.com/admin](http://cms.wodeabc.com/admin)），用户名：test，密码：123456

## 进度
- 开始编码于：2014年10月
- V1.1版本已完成：85%
- [当前计划安排](https://github.com/xucongli1989/XCLCMS/projects/1)

> 1、由于v1.0版本号已被著作权占用，故正式版的版本号为V1.1
> 
> 2、正式版（v1.1）还未开发完成，其中的某些已有模块可能会有较大变动，如果您不介意，在合法的授权协议下也可直接进行二次开发。

## 里程碑
- 2016-12-16——已申请著作权（软著登字第1554794号）
- 2015-03-21——在GitHub上开源
- 2014-10-01——立项，并开始编码


## 反馈
如果您发现软件使用过程中，有严重的bug，或者您拥有好的意见或建议，请邮件给我们，谢谢！e-mail:80213876@qq.com

## 开源协议（Apache License 2.0）
1. 需要给代码的用户一份Apache Licence。
2. 如果你修改了代码，需要在被修改的文件中说明。
3. 在延伸的代码（修改和由源代码衍生的代码）中，**必须包含**原来代码中的协议、商标、专利声明和其他原来作者规定需要包含的说明。
4. 可以自己增加新的许可文件，但必须包含原许可，且不可以表现为对原许可构成更改。
5. 被授权人有权利使用、复制、修改、合并、出版发行、散布、再授权及贩售软件及软件的副本（开源或闭源均可）。
6. **所有商业用途必须经过作者许可**，未经授权而进行的所有商业行为，我们将保留追究法律责任的权利。

> **声明内容：**本产品使用了免费且开源的XCLCMS来进行构建，最终版权归XCLCMS项目参与者所有，项目地址参见：[https://github.com/xucongli1989/XCLCMS](https://github.com/xucongli1989/XCLCMS)

> 协议最近更新时间：2017-04-26

## 捐赠
捐赠金额大于等于人民币**（个人：499元；企业：4999元）**的朋友们，可以在合法的商业行为中，基于原许可自由地使用本软件。

> 注：捐赠是自愿行为，是您对软件工作者的认可与鼓励，并不代表技术支持、需求订制等相关雇佣行为。
> 
> 有关本项目的所有问题均可以发邮件或提issue来共同解决。


**捐赠方式：**

![](https://raw.githubusercontent.com/xucongli1989/XCLCMS/master/XCLCMS.Document/Img/pay.png)


**感谢捐赠者：**

> 2017-06-01：*乐 &yen;200（支付宝流水尾号：9336943）

> 2016-11-25：*yhq &yen;10（支付宝流水尾号：88272280）

> 2016-10-19：*民顺  &yen;1（微信流水尾号：94308336）


## 预览图：

![](https://raw.githubusercontent.com/xucongli1989/XCLCMS/master/XCLCMS.Document/Img/11.jpg)

![](https://raw.githubusercontent.com/xucongli1989/XCLCMS/master/XCLCMS.Document/Img/33.jpg)

![](https://raw.githubusercontent.com/xucongli1989/XCLCMS/master/XCLCMS.Document/Img/44.jpg)

![](https://raw.githubusercontent.com/xucongli1989/XCLCMS/master/XCLCMS.Document/Img/55.jpg)

![](https://raw.githubusercontent.com/xucongli1989/XCLCMS/master/XCLCMS.Document/Img/66.jpg)

![](https://raw.githubusercontent.com/xucongli1989/XCLCMS/master/XCLCMS.Document/Img/20160306-01.jpg)

![](https://raw.githubusercontent.com/xucongli1989/XCLCMS/master/XCLCMS.Document/Img/20160306-02.jpg)

![](https://raw.githubusercontent.com/xucongli1989/XCLCMS/master/XCLCMS.Document/Img/20160306-03.jpg)

![](https://raw.githubusercontent.com/xucongli1989/XCLCMS/master/XCLCMS.Document/Img/20160404-01.jpg)
