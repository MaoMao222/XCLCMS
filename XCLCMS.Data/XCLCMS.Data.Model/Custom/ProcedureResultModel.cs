using System;

namespace XCLCMS.Data.Model.Custom
{
    /// <summary>
    /// 存储过程执行结果model
    /// </summary>
    [Serializable]
    public class ProcedureResultModel
    {
        /// <summary>
        /// 是否成功
        /// </summary>
        public bool IsSuccess { get; set; }

        /// <summary>
        /// 执行结果状态（1：成功，其它为失败）
        /// </summary>
        public int ResultCode { get; set; }

        /// <summary>
        /// 执行结果返回的消息
        /// </summary>
        public string ResultMessage { get; set; }
    }
}