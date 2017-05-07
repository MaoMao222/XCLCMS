using System;

namespace XCLCMS.Data.BLL.Strategy.Article
{
    /// <summary>
    /// 保存文章基础信息
    /// </summary>
    public class Article : BaseStrategy
    {
        /// <summary>
        /// 构造
        /// </summary>
        public Article()
        {
            this.Name = "保存文章基础信息";
        }

        /// <summary>
        /// 执行策略
        /// </summary>
        public override void DoWork<T>(T context)
        {
            var articleContext = context as XCLCMS.Data.BLL.Strategy.Article.ArticleContext;

            if (null == articleContext.Article)
            {
                return;
            }

            bool flag = false;
            XCLCMS.Data.BLL.Article bll = new BLL.Article();

            try
            {
                switch (articleContext.HandleType)
                {
                    case StrategyLib.HandleType.ADD:
                        articleContext.Article.CreaterID = articleContext.ContextInfo.UserInfoID;
                        articleContext.Article.CreaterName = articleContext.ContextInfo.UserName;
                        articleContext.Article.CreateTime = DateTime.Now;
                        articleContext.Article.UpdaterID = articleContext.Article.CreaterID;
                        articleContext.Article.UpdaterName = articleContext.Article.CreaterName;
                        articleContext.Article.UpdateTime = articleContext.Article.CreateTime;
                        flag = bll.Add(articleContext.Article);
                        break;

                    case StrategyLib.HandleType.UPDATE:
                        articleContext.Article.UpdaterID = articleContext.ContextInfo.UserInfoID;
                        articleContext.Article.UpdaterName = articleContext.ContextInfo.UserName;
                        articleContext.Article.UpdateTime = DateTime.Now;
                        flag = bll.Update(articleContext.Article);
                        break;
                }
            }
            catch (Exception ex)
            {
                flag = false;
                this.ResultMessage += string.Format("异常信息：{0}", ex.Message);
            }

            if (flag)
            {
                this.Result = StrategyLib.ResultEnum.SUCCESS;
            }
            else
            {
                this.Result = StrategyLib.ResultEnum.FAIL;
                this.ResultMessage = string.Format("保存文章基础信息失败！{0}", this.ResultMessage);
            }
        }
    }
}