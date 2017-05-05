using System;
using System.Collections.Generic;
using System.Linq;
using XCLCMS.Data.Model.Custom;
using XCLCMS.Data.WebAPIEntity;
using XCLCMS.Data.WebAPIEntity.RequestEntity;
using XCLCMS.IService.WebAPI;
using XCLNetTools.Entity;
using XCLNetTools.Generic;

namespace XCLCMS.Service.WebAPI
{
    /// <summary>
    /// 商户应用信息
    /// </summary>
    public class MerchantAppService : IMerchantAppService
    {
        private XCLCMS.Data.BLL.View.v_MerchantApp vMerchantAppBLL = new Data.BLL.View.v_MerchantApp();
        private XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();
        private XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询商户应用信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.MerchantApp> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.MerchantApp>();
            response.Body = merchantAppBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 根据加密后的AppKey查询商户信息
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.Custom.MerchantAppInfoModel> DetailByAppKey(APIRequestEntity<object> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.Custom.MerchantAppInfoModel>();

            if (string.IsNullOrWhiteSpace(Convert.ToString(request.Body)))
            {
                response.IsSuccess = false;
                response.Message = "请提供需要查询的AppKey！";
                return response;
            }

            response.Body = new Data.Model.Custom.MerchantAppInfoModel();
            response.Body.MerchantApp = this.merchantAppBLL.GetModel(Convert.ToString(request.Body));
            if (null != response.Body.MerchantApp)
            {
                response.Body.Merchant = this.merchantBLL.GetModel(response.Body.MerchantApp.FK_MerchantID);
            }

            if (null == response.Body.Merchant || null == response.Body.MerchantApp)
            {
                response.IsSuccess = false;
                response.Message = "请提供正确的AppKey！";
                return response;
            }

            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 查询商户应用信息分页列表
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_MerchantApp>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_MerchantApp>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_MerchantApp>();
            response.Body.ResultList = vMerchantAppBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[MerchantAppID] desc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }


        /// <summary>
        /// 查询所有商户应用键值形式的列表
        /// </summary>
        public APIResponseEntity<List<TextValue>> AllTextValueList(APIRequestEntity<PageListConditionEntity> request)
        {
            var response = new APIResponseEntity<List<TextValue>>();
            response.Body = new List<TextValue>();
            response.IsSuccess = true;
            request.Body.PagerInfoSimple = new PagerInfoSimple()
            {
                PageSize = Int32.MaxValue - 1
            };
            var res = this.PageList(request);
            if (null != res && null != res.Body && null != res.Body.ResultList)
            {
                res.Body.ResultList.ForEach(k =>
                {
                    response.Body.Add(new TextValue()
                    {
                        Text = k.MerchantAppName,
                        Value = k.MerchantAppID.ToString()
                    });
                });
            }
            return response;
        }

        /// <summary>
        /// 判断商户应用名是否存在
        /// </summary>
        public APIResponseEntity<bool> IsExistMerchantAppName(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.MerchantApp.IsExistMerchantAppNameEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            response.IsSuccess = true;
            response.Message = "该商户应用名可以使用！";

            request.Body.MerchantAppName = (request.Body.MerchantAppName ?? "").Trim();

            if (request.Body.MerchantAppID > 0)
            {
                var model = merchantAppBLL.GetModel(request.Body.MerchantAppID);
                if (null != model)
                {
                    if (string.Equals(request.Body.MerchantAppName, model.MerchantAppName, StringComparison.OrdinalIgnoreCase))
                    {
                        return response;
                    }
                }
            }

            if (!string.IsNullOrEmpty(request.Body.MerchantAppName))
            {
                bool isExist = merchantAppBLL.IsExistMerchantAppName(request.Body.MerchantAppName);
                if (isExist)
                {
                    response.IsSuccess = false;
                    response.Message = "该商户应用名已被占用！";
                }
            }

            return response;
        }

        /// <summary>
        /// 新增商户应用信息
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.MerchantApp> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            request.Body.MerchantAppName = (request.Body.MerchantAppName ?? "").Trim();
            request.Body.AppKey = (request.Body.AppKey ?? "").Trim().ToUpper();

            if (string.IsNullOrWhiteSpace(request.Body.MerchantAppName))
            {
                response.IsSuccess = false;
                response.Message = "请提供商户应用名！";
                return response;
            }

            if (!XCLNetTools.Common.Consts.RegMD5_32Uppercase.IsMatch(request.Body.AppKey))
            {
                response.IsSuccess = false;
                response.Message = "请提供有效的AppKey（32位大写MD5值）！";
                return response;
            }

            if (null != this.merchantAppBLL.GetModel(request.Body.AppKey))
            {
                response.IsSuccess = false;
                response.Message = string.Format("AppKey：{0}，已经被占用了！", request.Body.AppKey);
                return response;
            }

            if (null == merchantBLL.GetModel(request.Body.FK_MerchantID))
            {
                response.IsSuccess = false;
                response.Message = string.Format("您指定的商户ID【{0}】不存在！", request.Body.FK_MerchantID);
                return response;
            }

            if (this.merchantAppBLL.IsExistMerchantAppName(request.Body.MerchantAppName))
            {
                response.IsSuccess = false;
                response.Message = string.Format("商户应用名【{0}】已存在！", request.Body.MerchantAppName);
                return response;
            }

            #endregion 数据校验

            response.IsSuccess = this.merchantAppBLL.Add(request.Body);
            if (response.Body)
            {
                response.Message = "商户应用信息添加成功！";
            }
            else
            {
                response.Message = "商户应用信息添加失败！";
            }
            return response;
        }

        /// <summary>
        /// 修改商户应用信息
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.MerchantApp> request)
        {
            var response = new APIResponseEntity<bool>();

            request.Body.AppKey = (request.Body.AppKey ?? "").Trim().ToUpper();

            #region 数据校验

            var model = merchantAppBLL.GetModel(request.Body.MerchantAppID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的商户应用信息！";
                return response;
            }

            if (!XCLNetTools.Common.Consts.RegMD5_32Uppercase.IsMatch(request.Body.AppKey))
            {
                response.IsSuccess = false;
                response.Message = "请提供有效的AppKey（32位大写MD5值）！";
                return response;
            }

            if (!string.Equals(request.Body.AppKey, model.AppKey, StringComparison.OrdinalIgnoreCase) && null != this.merchantAppBLL.GetModel(request.Body.AppKey))
            {
                response.IsSuccess = false;
                response.Message = string.Format("AppKey：{0}，已经被占用了！", request.Body.AppKey);
                return response;
            }

            if (!string.Equals(model.MerchantAppName, request.Body.MerchantAppName))
            {
                if (this.merchantAppBLL.IsExistMerchantAppName(request.Body.MerchantAppName))
                {
                    response.IsSuccess = false;
                    response.Message = string.Format("商户应用名【{0}】已存在！", request.Body.MerchantAppName);
                    return response;
                }
            }

            #endregion 数据校验

            model.AppKey = request.Body.AppKey;
            model.RecordState = request.Body.RecordState;
            model.CopyRight = request.Body.CopyRight;
            model.MerchantAppName = request.Body.MerchantAppName;
            model.MetaDescription = request.Body.MetaDescription;
            model.MetaKeyWords = request.Body.MetaKeyWords;
            model.MetaTitle = request.Body.MetaTitle;
            model.ResourceVersion = request.Body.ResourceVersion;
            model.WebURL = request.Body.WebURL;
            model.Email = request.Body.Email;
            model.Remark = request.Body.Remark;
            model.UpdaterID = this.ContextInfo.UserInfoID;
            model.UpdaterName = this.ContextInfo.UserName;
            model.UpdateTime = DateTime.Now;

            response.IsSuccess = this.merchantAppBLL.Update(model);
            if (response.IsSuccess)
            {
                response.Message = "商户应用信息修改成功！";
            }
            else
            {
                response.Message = "商户应用信息修改失败！";
            }
            return response;
        }

        /// <summary>
        /// 删除商户应用信息
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
                response.Message = "请指定要删除的商户应用ID！";
                return response;
            }

            foreach (var k in request.Body)
            {
                var merchantAppModel = merchantAppBLL.GetModel(k);
                if (null == merchantAppModel)
                {
                    continue;
                }
                var merchantModel = this.merchantBLL.GetModel(merchantAppModel.FK_MerchantID);
                if (null != merchantModel && merchantModel.MerchantSystemType == XCLCMS.Data.CommonHelper.EnumType.MerchantSystemTypeEnum.SYS.ToString())
                {
                    response.IsSuccess = false;
                    response.Message = string.Format("不可以删除系统内置商户的应用【{0}】！", merchantAppModel.MerchantAppName);
                    return response;
                }
                merchantAppModel.UpdaterID = this.ContextInfo.UserInfoID;
                merchantAppModel.UpdaterName = this.ContextInfo.UserName;
                merchantAppModel.UpdateTime = DateTime.Now;
                merchantAppModel.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.R.ToString();
                if (!merchantAppBLL.Update(merchantAppModel))
                {
                    response.IsSuccess = false;
                    response.Message = "删除失败！";
                    return response;
                }
            }

            response.IsSuccess = true;
            response.Message = "已成功删除商户应用信息！";
            response.IsRefresh = true;

            return response;
        }
    }
}