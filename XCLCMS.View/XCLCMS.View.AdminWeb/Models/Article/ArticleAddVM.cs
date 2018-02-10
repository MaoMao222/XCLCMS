using System.Collections.Generic;

namespace XCLCMS.View.AdminWeb.Models.Article
{
    /// <summary>
    /// 文章添加或修改页的viewmodel
    /// </summary>
    public class ArticleAddVM
    {
        /// <summary>
        /// 表单action
        /// </summary>
        public string FormAction { get; set; }

        public XCLCMS.Data.Model.View.v_Article Article { get; set; }

        /// <summary>
        /// 记录状态select的option
        /// </summary>
        public string RecordStateOptions { get; set; }

        /// <summary>
        /// 文章状态select的option
        /// </summary>
        public string ArticleStateOptions { get; set; }

        /// <summary>
        /// 文章内容类型select的option
        /// </summary>
        public string ArticleContentTypeOptions { get; set; }

        /// <summary>
        /// 文章链接打开方式select的option
        /// </summary>
        public string URLOpenTypeOptions { get; set; }

        /// <summary>
        /// 文章来源select的option
        /// </summary>
        public string FromInfoOptions { get; set; }

        /// <summary>
        /// 文章作者select的options
        /// </summary>
        public string AuthorNameOptions { get; set; }

        /// <summary>
        /// 文章审核状态select的options
        /// </summary>
        public string VerifyStateOptions { get; set; }

        /// <summary>
        /// 文章附件ID
        /// </summary>
        public List<long> AttachmentIDList { get; set; }

        /// <summary>
        /// 文章分类ID
        /// </summary>
        public List<long> ArticleTypeIDList { get; set; }

        /// <summary>
        /// 产品ID
        /// </summary>
        public List<long> ProductIDList { get; set; }
    }
}