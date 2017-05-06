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
    /// 广告
    /// </summary>
    public class AdsService : IAdsService
    {
        private XCLCMS.Data.BLL.Ads adsBLL = new XCLCMS.Data.BLL.Ads();
        private XCLCMS.Data.BLL.View.v_Ads vAdsBLL = new Data.BLL.View.v_Ads();
        private XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();
        private XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询广告信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.Ads> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.Ads>();
            response.Body = adsBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 查询广告信息分页列表
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Ads>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Ads>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_Ads>();
            response.Body.ResultList = vAdsBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[AdsID] desc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 检查广告code是否已存在
        /// </summary>
        public APIResponseEntity<bool> IsExistCode(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Ads.IsExistCodeEntity> request)
        {
            #region 初始化

            var response = new APIResponseEntity<bool>()
            {
                IsSuccess = true,
                Message = "该唯一标识可以使用！"
            };
            request.Body.Code = (request.Body.Code ?? "").Trim();
            XCLCMS.Data.Model.Ads model = null;

            #endregion 初始化

            #region 数据校验

            if (string.IsNullOrEmpty(request.Body.Code))
            {
                response.Message = "请指定Code参数！";
                response.IsSuccess = false;
                return response;
            }

            #endregion 数据校验

            #region 构建response

            if (request.Body.AdsID > 0)
            {
                model = adsBLL.GetModel(request.Body.AdsID);
                if (null != model && string.Equals(request.Body.Code, model.Code, StringComparison.OrdinalIgnoreCase))
                {
                    return response;
                }
            }

            if (adsBLL.IsExistCode(request.Body.Code))
            {
                response.IsSuccess = false;
                response.Message = "该唯一标识已被占用！";
                return response;
            }
            return response;

            #endregion 构建response
        }

        /// <summary>
        /// 新增广告信息
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.Ads> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            request.Body.Title = (request.Body.Title ?? "").Trim();
            request.Body.Code = (request.Body.Code ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(request.Body.Code))
            {
                request.Body.Code = request.Body.AdsID.ToString();
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            if (string.IsNullOrWhiteSpace(request.Body.Title))
            {
                response.IsSuccess = false;
                response.Message = "请提供广告标题！";
                return response;
            }

            if (this.adsBLL.IsExistCode(request.Body.Code))
            {
                response.IsSuccess = false;
                response.Message = string.Format("唯一标识【{0}】已存在！", request.Body.Code);
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

            response.IsSuccess = this.adsBLL.Add(request.Body);

            if (response.IsSuccess)
            {
                response.Message = "广告信息添加成功！";
            }
            else
            {
                response.Message = "广告信息添加失败！";
            }

            return response;
        }

        /// <summary>
        /// 修改广告信息
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.Ads> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            var model = adsBLL.GetModel(request.Body.AdsID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的广告信息！";
                return response;
            }

            request.Body.Title = (request.Body.Title ?? "").Trim();
            request.Body.Code = (request.Body.Code ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(request.Body.Code))
            {
                request.Body.Code = request.Body.AdsID.ToString();
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            //code是否被占用
            if (!string.IsNullOrEmpty(request.Body.Code) && !string.Equals(model.Code, request.Body.Code, StringComparison.OrdinalIgnoreCase) && this.adsBLL.IsExistCode(request.Body.Code))
            {
                response.IsSuccess = false;
                response.Message = "标识Code被占用，请重新指定！";
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

            model.Title = request.Body.Title;
            model.Code = request.Body.Code;
            model.AdsType = request.Body.AdsType;
            model.URL = request.Body.URL;
            model.Email = request.Body.Email;
            model.QQ = request.Body.QQ;
            model.Tel = request.Body.Tel;
            model.Remark = request.Body.Remark;
            model.OtherContact = request.Body.OtherContact;
            model.FK_MerchantID = request.Body.FK_MerchantID;
            model.FK_MerchantAppID = request.Body.FK_MerchantAppID;
            model.RecordState = request.Body.RecordState;
            model.UpdaterID = this.ContextInfo.UserInfoID;
            model.UpdaterName = this.ContextInfo.UserName;
            model.UpdateTime = DateTime.Now;
            model.AdHeight = request.Body.AdHeight;
            model.AdWidth = request.Body.AdWidth;
            model.Contents = request.Body.Contents;
            model.EndTime = request.Body.EndTime;
            model.NickName = request.Body.NickName;
            model.StartTime = request.Body.StartTime;
            model.URL = request.Body.URL;
            model.URLOpenType = request.Body.URLOpenType;

            response.IsSuccess = this.adsBLL.Update(model);
            if (response.IsSuccess)
            {
                response.Message = "广告信息修改成功！";
            }
            else
            {
                response.Message = "广告信息修改失败！";
            }
            return response;
        }

        /// <summary>
        /// 删除广告信息
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
                response.Message = "请指定要删除的广告ID！";
                return response;
            }

            foreach (var k in request.Body)
            {
                var model = this.adsBLL.GetModel(k);
                if (null == model)
                {
                    continue;
                }

                model.UpdaterID = this.ContextInfo.UserInfoID;
                model.UpdaterName = this.ContextInfo.UserName;
                model.UpdateTime = DateTime.Now;
                model.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.R.ToString();
                if (!this.adsBLL.Update(model))
                {
                    response.IsSuccess = false;
                    response.Message = "广告删除失败！";
                    return response;
                }
            }

            response.IsSuccess = true;
            response.Message = "已成功删除广告！";
            response.IsRefresh = true;

            return response;
        }
    }
}