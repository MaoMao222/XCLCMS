using System.Collections.Generic;

namespace XCLCMS.Data.BLL.Strategy.Article
{
    /// <summary>
    /// 文章上下文
    /// </summary>
    public class ArticleContext : BaseContext
    {
        /// <summary>
        /// 用户信息
        /// </summary>
        public XCLCMS.Data.Model.Article Article { get; set; }

        /// <summary>
        /// 文章附件id
        /// </summary>
        public List<long> ArticleAttachmentIDList { get; set; }

        /// <summary>
        /// 文章分类id
        /// </summary>
        public List<long> ArticleTypeIDList { get; set; }

        /// <summary>
        /// 文章产品id
        /// </summary>
        public List<long> ArticleProductIDList { get; set; }
    }
}