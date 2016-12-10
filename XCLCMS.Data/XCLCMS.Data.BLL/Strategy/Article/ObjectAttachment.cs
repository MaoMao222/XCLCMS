using System;

namespace XCLCMS.Data.BLL.Strategy.Article
{
    /// <summary>
    /// 保存文章附件关系信息
    /// </summary>
    public class ObjectAttachment : BaseStrategy
    {
        /// <summary>
        /// 构造
        /// </summary>
        public ObjectAttachment()
        {
            this.Name = "保存文章附件关系信息";
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
            XCLCMS.Data.BLL.ObjectAttachment bll = new BLL.ObjectAttachment();

            try
            {
                //添加附件关系
                flag = bll.Add(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum.ART, articleContext.Article.ArticleID, articleContext.ArticleAttachmentIDList, new Model.Custom.ContextModel()
                {
                    UserInfoID = articleContext.ContextInfo.UserInfoID,
                    UserName= articleContext.ContextInfo.UserName
                });
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
                this.ResultMessage = string.Format("保存文章附件关系信息失败！{0}", this.ResultMessage);
            }
        }
    }
}