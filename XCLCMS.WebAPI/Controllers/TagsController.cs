using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLNetTools.Generic;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// 标签 管理
    /// </summary>
    public class TagsController : BaseAPIController
    {
        public XCLCMS.Data.BLL.Tags tagsBLL = new XCLCMS.Data.BLL.Tags();
        public XCLCMS.Data.BLL.View.v_Tags vtagsBLL = new XCLCMS.Data.BLL.View.v_Tags();
        private XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();

        /// <summary>
        /// 查询标签信息实体
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Tags_View)]
        public async Task<APIResponseEntity<XCLCMS.Data.Model.Tags>> Detail([FromUri] APIRequestEntity<long> request)
        {
            return await Task.Run(() =>
            {
                var response = new APIResponseEntity<XCLCMS.Data.Model.Tags>();
                response.Body = tagsBLL.GetModel(request.Body);
                response.IsSuccess = true;

                //限制商户
                if (base.IsOnlyCurrentMerchant && null != response.Body && response.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.Body = null;
                    response.IsSuccess = false;
                }

                return response;
            });
        }

        /// <summary>
        /// 查询标签信息分页列表
        /// </summary>
        [HttpGet]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Tags_View)]
        public async Task<APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Tags>>> PageList([FromUri] APIRequestEntity<PageListConditionEntity> request)
        {
            return await Task.Run(() =>
            {
                var pager = request.Body.PagerInfoSimple.ToPagerInfo();
                var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_Tags>>();
                response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_Tags>();

                //限制商户
                if (base.IsOnlyCurrentMerchant)
                {
                    request.Body.Where = XCLNetTools.DataBase.SQLLibrary.JoinWithAnd(new List<string>() {
                    request.Body.Where,
                    string.Format("FK_MerchantID={0}",base.CurrentUserModel.FK_MerchantID)
                });
                }

                response.Body.ResultList = vtagsBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
                {
                    OrderBy = "[TagsID] desc",
                    Where = request.Body.Where
                });
                response.Body.PagerInfo = pager;
                response.IsSuccess = true;
                return response;
            });
        }

        /// <summary>
        /// 判断标签是否存在
        /// </summary>
        [HttpGet]
        [XCLCMS.WebAPI.Filters.APIOpenPermissionFilter]
        public async Task<APIResponseEntity<bool>> IsExistTagName([FromUri] APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.Tags.IsExistTagNameEntity> request)
        {
            return await Task.Run(() =>
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
            });
        }

        /// <summary>
        /// 新增标签信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Tags_Add)]
        public async Task<APIResponseEntity<bool>> Add([FromBody] APIRequestEntity<XCLCMS.Data.Model.Tags> request)
        {
            return await Task.Run(() =>
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

                #endregion 数据校验

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
            });
        }

        /// <summary>
        /// 修改标签信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Tags_Edit)]
        public async Task<APIResponseEntity<bool>> Update([FromBody] APIRequestEntity<XCLCMS.Data.Model.Tags> request)
        {
            return await Task.Run(() =>
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

                //限制商户
                if (base.IsOnlyCurrentMerchant && request.Body.FK_MerchantID != base.CurrentUserModel.FK_MerchantID)
                {
                    response.IsSuccess = false;
                    response.Message = "只能修改自己的商户信息！";
                    return response;
                }

                #endregion 数据校验

                model.TagName = request.Body.TagName;
                model.Description = request.Body.Description;
                model.FK_MerchantID = request.Body.FK_MerchantID;
                model.FK_MerchantAppID = request.Body.FK_MerchantAppID;
                model.RecordState = request.Body.RecordState;
                model.UpdaterID = base.CurrentUserModel.UserInfoID;
                model.UpdaterName = base.CurrentUserModel.UserName;
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
            });
        }

        /// <summary>
        /// 删除标签信息
        /// </summary>
        [HttpPost]
        [XCLCMS.Lib.Filters.FunctionFilter(Function = XCLCMS.Data.CommonHelper.Function.FunctionEnum.Tags_Del)]
        public async Task<APIResponseEntity<bool>> Delete([FromBody] APIRequestEntity<List<long>> request)
        {
            return await Task.Run(() =>
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

                //限制商户
                if (base.IsOnlyCurrentMerchant)
                {
                    if (request.Body.Exists(id =>
                    {
                        var settingModel = this.tagsBLL.GetModel(id);
                        return null != settingModel && settingModel.FK_MerchantID != base.CurrentUserModel.FK_MerchantID;
                    }))
                    {
                        response.IsSuccess = false;
                        response.Message = "只能删除属于自己的商户数据！";
                        return response;
                    }
                }

                foreach (var k in request.Body)
                {
                    var model = this.tagsBLL.GetModel(k);
                    if (null == model)
                    {
                        continue;
                    }

                    model.UpdaterID = base.CurrentUserModel.UserInfoID;
                    model.UpdaterName = base.CurrentUserModel.UserName;
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
            });
        }
    }
}