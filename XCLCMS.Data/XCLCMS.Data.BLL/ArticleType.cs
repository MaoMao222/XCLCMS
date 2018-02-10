using System.Collections.Generic;

namespace XCLCMS.Data.BLL
{
    /// <summary>
    /// 文章类别关系表
    /// </summary>
    public partial class ArticleType
    {
        private readonly XCLCMS.Data.DAL.ArticleType dal = new XCLCMS.Data.DAL.ArticleType();

        /// <summary>
        /// 增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.ArticleType model)
        {
            return dal.Add(model);
        }

        /// <summary>
        /// 批量删除
        /// </summary>
        public bool Delete(long articleID)
        {
            return dal.Delete(articleID);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        public bool Add(List<XCLCMS.Data.Model.ArticleType> lst)
        {
            return dal.Add(lst);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        public bool Add(long articleID, List<long> articleTypeIDList, XCLCMS.Data.Model.Custom.ContextModel context = null)
        {
            return dal.Add(articleID, articleTypeIDList, context);
        }
    }
}