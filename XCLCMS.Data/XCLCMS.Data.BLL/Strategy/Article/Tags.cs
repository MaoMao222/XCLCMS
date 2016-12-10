using System;
using System.Collections.Generic;
using System.Linq;

namespace XCLCMS.Data.BLL.Strategy.Article
{
    /// <summary>
    /// 保存文章标签信息
    /// </summary>
    public class Tags : BaseStrategy
    {
        /// <summary>
        /// 构造
        /// </summary>
        public Tags()
        {
            this.Name = "保存文章标签信息";
        }

        /// <summary>
        /// 执行策略
        /// </summary>
        public override void DoWork<T>(T context)
        {
            var dtNow = DateTime.Now;
            var articleContext = context as XCLCMS.Data.BLL.Strategy.Article.ArticleContext;

            if (null == articleContext.Article)
            {
                return;
            }

            bool flag = false;

            var tagNameLst = (articleContext.Article.Tags ?? "").Replace('，', ',').Split(',').ToList().Where(k => !string.IsNullOrWhiteSpace(k)).Select(k => k.Trim().ToLower()).Distinct().ToList();

            if (null == tagNameLst || tagNameLst.Count == 0)
            {
                return;
            }

            var tagLst = new List<XCLCMS.Data.Model.Tags>();
            tagNameLst.ForEach(k =>
            {
                tagLst.Add(new Model.Tags()
                {
                    CreaterID = articleContext.ContextInfo.UserInfoID,
                    CreateTime = dtNow,
                    CreaterName = articleContext.ContextInfo.UserName,
                    Description = null,
                    FK_MerchantAppID = articleContext.Article.FK_MerchantAppID,
                    FK_MerchantID = articleContext.Article.FK_MerchantID,
                    RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString(),
                    TagName = k,
                    TagsID = XCLCMS.Data.BLL.Common.Common.GenerateID(CommonHelper.EnumType.IDTypeEnum.TAG),
                    UpdaterID = articleContext.ContextInfo.UserInfoID,
                    UpdaterName = articleContext.ContextInfo.UserName,
                    UpdateTime = dtNow
                });
            });

            var bll = new XCLCMS.Data.BLL.Tags();
            var objTagBLL = new XCLCMS.Data.BLL.ObjectTag();

            try
            {
                //添加标签
                var addResult = bll.Add(tagLst);

                //添加文章标签对应关系
                if (addResult.IsSuccess && null != addResult.Result && null != addResult.Result.TagIdList && addResult.Result.TagIdList.Count > 0)
                {
                    objTagBLL.Add(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum.ART, articleContext.Article.ArticleID, addResult.Result.TagIdList, new Model.Custom.ContextModel()
                    {
                        UserInfoID = articleContext.ContextInfo.UserInfoID,
                        UserName = articleContext.ContextInfo.UserName
                    });
                }

                flag = addResult.IsSuccess;
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
                this.ResultMessage = string.Format("保存文章标签信息失败！{0}", this.ResultMessage);
            }
        }
    }
}