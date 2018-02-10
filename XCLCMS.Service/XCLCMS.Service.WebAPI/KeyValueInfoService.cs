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
    public class KeyValueInfoService : IKeyValueInfoService
    {
        private readonly XCLCMS.Data.BLL.KeyValueInfo KeyValueInfoBLL = new XCLCMS.Data.BLL.KeyValueInfo();
        private readonly XCLCMS.Data.BLL.View.v_KeyValueInfo vKeyValueInfoBLL = new Data.BLL.View.v_KeyValueInfo();
        private readonly XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();
        private readonly XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.View.v_KeyValueInfo> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.View.v_KeyValueInfo>();
            response.Body = vKeyValueInfoBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 根据code来查询信息实体
        /// </summary>
        public APIResponseEntity<Data.Model.KeyValueInfo> DetailByCode(APIRequestEntity<string> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.KeyValueInfo>();
            response.Body = KeyValueInfoBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 查询信息分页列表
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_KeyValueInfo>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_KeyValueInfo>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_KeyValueInfo>();
            response.Body.ResultList = vKeyValueInfoBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[KeyValueInfoID] desc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 检查code是否已存在
        /// </summary>
        public APIResponseEntity<bool> IsExistCode(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.KeyValueInfo.IsExistCodeEntity> request)
        {
            #region 初始化

            var response = new APIResponseEntity<bool>()
            {
                IsSuccess = true,
                Message = "该唯一标识可以使用！"
            };
            request.Body.Code = (request.Body.Code ?? "").Trim();
            XCLCMS.Data.Model.KeyValueInfo model = null;

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

            if (request.Body.KeyValueInfoID > 0)
            {
                model = KeyValueInfoBLL.GetModel(request.Body.KeyValueInfoID);
                if (null != model && string.Equals(request.Body.Code, model.Code, StringComparison.OrdinalIgnoreCase))
                {
                    return response;
                }
            }

            if (KeyValueInfoBLL.IsExistCode(request.Body.Code))
            {
                response.IsSuccess = false;
                response.Message = "该唯一标识已被占用！";
                return response;
            }
            return response;

            #endregion 构建response
        }

        /// <summary>
        /// 新增信息
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.KeyValueInfo> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            request.Body.Code = (request.Body.Code ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(request.Body.Code))
            {
                request.Body.Code = request.Body.KeyValueInfoID.ToString();
            }

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            if (this.KeyValueInfoBLL.IsExistCode(request.Body.Code))
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

            request.Body.CreaterID = this.ContextInfo.UserInfoID;
            request.Body.CreaterName = this.ContextInfo.UserName;
            request.Body.CreateTime = DateTime.Now;
            request.Body.UpdaterID = request.Body.CreaterID;
            request.Body.UpdaterName = request.Body.CreaterName;
            request.Body.UpdateTime = request.Body.CreateTime;
            response.IsSuccess = this.KeyValueInfoBLL.Add(request.Body);

            if (response.IsSuccess)
            {
                response.Message = "数据信息添加成功！";
            }
            else
            {
                response.Message = "数据信息添加失败！";
            }

            return response;
        }

        /// <summary>
        /// 修改信息
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.KeyValueInfo> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            var model = KeyValueInfoBLL.GetModel(request.Body.KeyValueInfoID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的数据信息！";
                return response;
            }

            request.Body.Code = (request.Body.Code ?? string.Empty).Trim();
            if (string.IsNullOrWhiteSpace(request.Body.Code))
            {
                request.Body.Code = request.Body.KeyValueInfoID.ToString();
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
            if (!string.IsNullOrEmpty(request.Body.Code) && !string.Equals(model.Code, request.Body.Code, StringComparison.OrdinalIgnoreCase) && this.KeyValueInfoBLL.IsExistCode(request.Body.Code))
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

            model.Code = request.Body.Code;
            model.Remark = request.Body.Remark;
            model.FK_MerchantID = request.Body.FK_MerchantID;
            model.FK_MerchantAppID = request.Body.FK_MerchantAppID;
            model.RecordState = request.Body.RecordState;
            model.UpdaterID = this.ContextInfo.UserInfoID;
            model.UpdaterName = this.ContextInfo.UserName;
            model.UpdateTime = DateTime.Now;
            model.Contents = request.Body.Contents;

            response.IsSuccess = this.KeyValueInfoBLL.Update(model);
            if (response.IsSuccess)
            {
                response.Message = "数据信息修改成功！";
            }
            else
            {
                response.Message = "数据信息修改失败！";
            }
            return response;
        }

        /// <summary>
        /// 删除信息
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
                response.Message = "请指定要删除的ID！";
                return response;
            }

            foreach (var k in request.Body)
            {
                var model = this.KeyValueInfoBLL.GetModel(k);
                if (null == model)
                {
                    continue;
                }

                model.UpdaterID = this.ContextInfo.UserInfoID;
                model.UpdaterName = this.ContextInfo.UserName;
                model.UpdateTime = DateTime.Now;
                model.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.R.ToString();
                if (!this.KeyValueInfoBLL.Update(model))
                {
                    response.IsSuccess = false;
                    response.Message = "数据信息删除失败！";
                    return response;
                }
            }

            response.IsSuccess = true;
            response.Message = "已成功删除数据信息！";
            response.IsRefresh = true;

            return response;
        }
    }
}