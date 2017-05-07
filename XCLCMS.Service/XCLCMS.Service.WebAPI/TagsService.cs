using System;
using System.Collections.Generic;
using System.Linq;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.IService.WebAPI;
using XCLNetTools.Generic;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 标签
    /// </summary>
    public class TagsService : ITagsService
    {
        public XCLCMS.Data.BLL.Tags tagsBLL = new XCLCMS.Data.BLL.Tags();
        public XCLCMS.Data.BLL.View.v_Tags vtagsBLL = new XCLCMS.Data.BLL.View.v_Tags();
        private XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();
        private XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询标签信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.Tags> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.Tags>();
            response.Body = tagsBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 查询标签信息分页列表
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Tags>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Tags>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_Tags>();

            response.Body.ResultList = vtagsBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[TagsID] desc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 判断标签是否存在
        /// </summary>
        public APIResponseEntity<bool> IsExistTagName(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Tags.IsExistTagNameEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            response.IsSuccess = true;
            response.Message = "该标签可以使用！";

            request.Body.TagName = (request.Body.TagName ?? "").Trim();

            if (request.Body.TagsID > 0)
            {
                var model = tagsBLL.GetModel(request.Body.TagsID);
                if (null != model)
                {
                    if (string.Equals(request.Body.TagName, model.TagName, StringComparison.OrdinalIgnoreCase) && request.Body.MerchantAppID == model.FK_MerchantAppID && request.Body.MerchantID == model.FK_MerchantID)
                    {
                        return response;
                    }
                }
            }

            if (!string.IsNullOrEmpty(request.Body.TagName))
            {
                bool isExist = tagsBLL.IsExist(new Data.Model.Custom.Tags_NameCondition()
                {
                    TagName = request.Body.TagName,
                    FK_MerchantAppID = request.Body.MerchantAppID,
                    FK_MerchantID = request.Body.MerchantID
                });
                if (isExist)
                {
                    response.IsSuccess = false;
                    response.Message = "该标签已被占用！";
                }
            }

            return response;
        }

        /// <summary>
        /// 新增标签信息
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.Tags> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            request.Body.TagName = (request.Body.TagName ?? "").Trim();

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            if (string.IsNullOrWhiteSpace(request.Body.TagName))
            {
                response.IsSuccess = false;
                response.Message = "请提供标签名称！";
                return response;
            }

            if (this.tagsBLL.IsExist(new Data.Model.Custom.Tags_NameCondition()
            {
                TagName = request.Body.TagName,
                FK_MerchantAppID = request.Body.FK_MerchantAppID,
                FK_MerchantID = request.Body.FK_MerchantID
            }))
            {
                response.IsSuccess = false;
                response.Message = string.Format("标签名称【{0}】已存在！", request.Body.TagName);
                return response;
            }

            //应用号与商户一致
            if (!this.merchantAppBLL.IsTheSameMerchantInfoID(request.Body.FK_MerchantID, request.Body.FK_MerchantAppID))
            {
                response.IsSuccess = false;
                response.Message = "商户号与应用号不匹配，请核对后再试！";
                return response;
            }

            #endregion 数据校验

            request.Body.CreaterID = this.ContextInfo.UserInfoID;
            request.Body.CreaterName = this.ContextInfo.UserName;
            request.Body.CreateTime = DateTime.Now;
            request.Body.UpdaterID = request.Body.CreaterID;
            request.Body.UpdaterName = request.Body.CreaterName;
            request.Body.UpdateTime = request.Body.CreateTime;

            response.IsSuccess = this.tagsBLL.Add(request.Body);

            if (response.IsSuccess)
            {
                response.Message = "标签信息添加成功！";
            }
            else
            {
                response.Message = "标签信息添加失败！";
            }

            return response;
        }

        /// <summary>
        /// 修改标签信息
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.Tags> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            var model = tagsBLL.GetModel(request.Body.TagsID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的标签信息！";
                return response;
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            if (!string.Equals(model.TagName, request.Body.TagName))
            {
                if (this.tagsBLL.IsExist(new Data.Model.Custom.Tags_NameCondition()
                {
                    TagName = request.Body.TagName,
                    FK_MerchantAppID = request.Body.FK_MerchantAppID,
                    FK_MerchantID = request.Body.FK_MerchantID
                }))
                {
                    response.IsSuccess = false;
                    response.Message = string.Format("标签名称【{0}】已存在！", request.Body.TagName);
                    return response;
                }
            }

            //应用号与商户一致
            if (!this.merchantAppBLL.IsTheSameMerchantInfoID(request.Body.FK_MerchantID, request.Body.FK_MerchantAppID))
            {
                response.IsSuccess = false;
                response.Message = "商户号与应用号不匹配，请核对后再试！";
                return response;
            }

            #endregion 数据校验

            model.TagName = request.Body.TagName;
            model.Description = request.Body.Description;
            model.FK_MerchantID = request.Body.FK_MerchantID;
            model.FK_MerchantAppID = request.Body.FK_MerchantAppID;
            model.RecordState = request.Body.RecordState;
            model.UpdaterID = this.ContextInfo.UserInfoID;
            model.UpdaterName = this.ContextInfo.UserName;
            model.UpdateTime = DateTime.Now;

            response.IsSuccess = this.tagsBLL.Update(model);
            if (response.IsSuccess)
            {
                response.Message = "标签信息修改成功！";
            }
            else
            {
                response.Message = "标签信息修改失败！";
            }
            return response;
        }

        /// <summary>
        /// 删除标签信息
        /// </summary>
        public APIResponseEntity<bool> Delete(APIRequestEntity<List<long>> request)
        {
            var response = new APIResponseEntity<bool>();

            if (request.Body.IsNotNullOrEmpty())
            {
                request.Body = request.Body.Where(k => k > 0).Distinct().ToList();
            }

            if (request.Body.IsNullOrEmpty())
            {
                response.IsSuccess = false;
                response.Message = "请指定要删除的标签ID！";
                return response;
            }

            foreach (var k in request.Body)
            {
                var model = this.tagsBLL.GetModel(k);
                if (null == model)
                {
                    continue;
                }

                model.UpdaterID = this.ContextInfo.UserInfoID;
                model.UpdaterName = this.ContextInfo.UserName;
                model.UpdateTime = DateTime.Now;
                model.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.R.ToString();
                if (!this.tagsBLL.Update(model))
                {
                    response.IsSuccess = false;
                    response.Message = "标签删除失败！";
                    return response;
                }
            }

            response.IsSuccess = true;
            response.Message = "已成功删除标签！";
            response.IsRefresh = true;

            return response;
        }
    }
}