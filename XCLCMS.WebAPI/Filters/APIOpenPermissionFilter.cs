using System;

namespace XCLCMS.WebAPI.Filters
{
    /// <summary>
    /// 不需要校验用户的登录和权限信息
    /// </summary>
    [AttributeUsage(AttributeTargets.All, AllowMultiple = true, Inherited = true)]
    public class APIOpenPermissionFilter : Attribute
    {
    }
}