using System;

namespace XCLCMS.Data.Model.Custom
{
    /// <summary>
    /// 【获取指定文章的相关联的其它文章信息】的查询条件model
    /// </summary>
    [Serializable]
    public class ArticleRelationDetailCondition
    {
        /// <summary>
        /// 文章ID
        /// </summary>
        public long ArticleID { get; set; }

        /// <summary>
        /// 是否按主键升序排列
        /// </summary>
        public bool IsASC { get; set; }

        /// <summary>
        /// 记录状态
        /// </summary>
        public string ArticleRecordState { get; set; }

        /// <summary>
        /// 相关文章取前几条
        /// </summary>
        public int? TopCount { get; set; }
    }
}