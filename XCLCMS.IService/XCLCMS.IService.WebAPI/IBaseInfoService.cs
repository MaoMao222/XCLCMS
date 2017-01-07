namespace XCLCMS.IService.WebAPI
{
    public interface IBaseInfoService
    {
        /// <summary>
        /// 当前上下文信息
        /// </summary>
        XCLCMS.Data.Model.Custom.ContextModel ContextInfo { get; set; }
    }
}