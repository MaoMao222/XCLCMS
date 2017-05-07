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
    /// 友情链接
    /// </summary>
    public class FriendLinksService : IFriendLinksService
    {
        public XCLCMS.Data.BLL.FriendLinks friendLinksBLL = new XCLCMS.Data.BLL.FriendLinks();
        public XCLCMS.Data.BLL.View.v_FriendLinks vFriendLinksBLL = new XCLCMS.Data.BLL.View.v_FriendLinks();
        private XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();
        private XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询友情链接信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.FriendLinks> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.FriendLinks>();
            response.Body = friendLinksBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 查询友情链接信息分页列表
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_FriendLinks>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_FriendLinks>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_FriendLinks>();
            response.Body.ResultList = vFriendLinksBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[FriendLinkID] desc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 判断友情链接标题是否存在
        /// </summary>
        public APIResponseEntity<bool> IsExistTitle(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.FriendLinks.IsExistTitleEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            response.IsSuccess = true;
            response.Message = "该标题可以使用！";

            request.Body.Title = (request.Body.Title ?? "").Trim();

            if (request.Body.FriendLinkID > 0)
            {
                var model = friendLinksBLL.GetModel(request.Body.FriendLinkID);
                if (null != model)
                {
                    if (string.Equals(request.Body.Title, model.Title, StringComparison.OrdinalIgnoreCase) && request.Body.MerchantAppID == model.FK_MerchantAppID && request.Body.MerchantID == model.FK_MerchantID)
                    {
                        return response;
                    }
                }
            }

            if (!string.IsNullOrEmpty(request.Body.Title))
            {
                bool isExist = friendLinksBLL.IsExist(new Data.Model.Custom.FriendLinks_TitleCondition()
                {
                    Title = request.Body.Title,
                    FK_MerchantAppID = request.Body.MerchantAppID,
                    FK_MerchantID = request.Body.MerchantID
                });
                if (isExist)
                {
                    response.IsSuccess = false;
                    response.Message = "该标题已被占用！";
                }
            }

            return response;
        }

        /// <summary>
        /// 新增友情链接信息
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.FriendLinks> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            request.Body.Title = (request.Body.Title ?? "").Trim();

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
                response.Message = "请提供友情链接标题！";
                return response;
            }

            if (this.friendLinksBLL.IsExist(new Data.Model.Custom.FriendLinks_TitleCondition()
            {
                Title = request.Body.Title,
                FK_MerchantAppID = request.Body.FK_MerchantAppID,
                FK_MerchantID = request.Body.FK_MerchantID
            }))
            {
                response.IsSuccess = false;
                response.Message = string.Format("友情链接标题【{0}】已存在！", request.Body.Title);
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

            response.IsSuccess = this.friendLinksBLL.Add(request.Body);

            if (response.IsSuccess)
            {
                response.Message = "友情链接信息添加成功！";
            }
            else
            {
                response.Message = "友情链接信息添加失败！";
            }

            return response;
        }

        /// <summary>
        /// 修改友情链接信息
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.FriendLinks> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            var model = friendLinksBLL.GetModel(request.Body.FriendLinkID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的友情链接信息！";
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

            if (!string.Equals(model.Title, request.Body.Title))
            {
                if (this.friendLinksBLL.IsExist(new Data.Model.Custom.FriendLinks_TitleCondition()
                {
                    Title = request.Body.Title,
                    FK_MerchantAppID = request.Body.FK_MerchantAppID,
                    FK_MerchantID = request.Body.FK_MerchantID
                }))
                {
                    response.IsSuccess = false;
                    response.Message = string.Format("友情链接标题【{0}】已存在！", request.Body.Title);
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

            model.Title = request.Body.Title;
            model.Description = request.Body.Description;
            model.URL = request.Body.URL;
            model.ContactName = request.Body.ContactName;
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

            response.IsSuccess = this.friendLinksBLL.Update(model);
            if (response.IsSuccess)
            {
                response.Message = "友情链接信息修改成功！";
            }
            else
            {
                response.Message = "友情链接信息修改失败！";
            }
            return response;
        }

        /// <summary>
        /// 删除友情链接信息
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
                response.Message = "请指定要删除的友情链接ID！";
                return response;
            }

            foreach (var k in request.Body)
            {
                var model = this.friendLinksBLL.GetModel(k);
                if (null == model)
                {
                    continue;
                }

                model.UpdaterID = this.ContextInfo.UserInfoID;
                model.UpdaterName = this.ContextInfo.UserName;
                model.UpdateTime = DateTime.Now;
                model.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.R.ToString();
                if (!this.friendLinksBLL.Update(model))
                {
                    response.IsSuccess = false;
                    response.Message = "友情链接删除失败！";
                    return response;
                }
            }

            response.IsSuccess = true;
            response.Message = "已成功删除友情链接！";
            response.IsRefresh = true;

            return response;
        }
    }
}