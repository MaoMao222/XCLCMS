using System;

namespace XCLCMS.Lib.Filters
{
    /// <summary>
    /// 功能Filter
    /// </summary>
    [AttributeUsage(AttributeTargets.All, AllowMultiple = true, Inherited = true)]
    public class FunctionFilter : Attribute
    {
        /// <summary>
        /// 当前功能标识组
        /// </summary>
        public XCLCMS.Data.CommonHelper.Function.FunctionEnum Function { get; set; }
    }
}