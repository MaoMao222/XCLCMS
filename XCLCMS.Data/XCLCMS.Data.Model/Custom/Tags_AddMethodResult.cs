using System;
using System.Collections.Generic;

namespace XCLCMS.Data.Model.Custom
{
    [Serializable]
    public class Tags_AddMethodResult
    {
        /// <summary>
        /// 已存在的tagId
        /// </summary>
        public List<long> ExistTagIdList { get; set; }

        /// <summary>
        /// 刚新加的tagId
        /// </summary>
        public List<long> AddedTagIdList { get; set; }

        /// <summary>
        /// tagId汇总
        /// </summary>
        public List<long> TagIdList
        {
            get
            {
                var lst = new List<long>();
                if (null != this.ExistTagIdList && this.ExistTagIdList.Count > 0)
                {
                    lst.AddRange(this.ExistTagIdList);
                }
                if (null != this.AddedTagIdList && this.AddedTagIdList.Count > 0)
                {
                    lst.AddRange(this.AddedTagIdList);
                }
                return lst;
            }
        }
    }
}