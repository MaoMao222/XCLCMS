using System;

namespace XCLCMS.Data.Model.Custom
{
    /// <summary>
    /// 字典库简版实体
    /// </summary>
    [Serializable]
    public class SysDicSimple
    {
        /// <summary>
        /// 字典ID
        /// </summary>
        public long SysDicID
        {
            get;
            set;
        }

        /// <summary>
        /// 父ID
        /// </summary>
        public long ParentID
        {
            get;
            set;
        }

        /// <summary>
        /// 字典名
        /// </summary>
        public string DicName
        {
            get;
            set;
        }
    }
}