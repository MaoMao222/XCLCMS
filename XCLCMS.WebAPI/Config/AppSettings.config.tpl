<?xml version="1.0" encoding="utf-8" ?>
<appSettings>
    <add key="owin:AutomaticAppStartup" value="false" />

    <add key="AppKey" value="${config.AppKey}" />
    <add key="WebAPIServiceURL" value="${config.WebAPIServiceURL}" />

    <!--当前系统所在环境（XCLCMS.Lib.Common.Comm.SysEnvironmentEnum）-->
    <add key="SysEnvironment" value="${ENV}" />
</appSettings>