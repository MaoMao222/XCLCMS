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
    /// 系统配置
    /// </summary>
    public class SysWebSettingService : ISysWebSettingService
    {
        private XCLCMS.Data.BLL.View.v_SysWebSetting vSysWebSettingBLL = new Data.BLL.View.v_SysWebSetting();
        private XCLCMS.Data.BLL.SysWebSetting sysWebSettingBLL = new Data.BLL.SysWebSetting();
        private XCLCMS.Data.BLL.MerchantApp merchantAppBLL = new Data.BLL.MerchantApp();
        private XCLCMS.Data.BLL.Merchant merchantBLL = new Data.BLL.Merchant();

        public ContextModel ContextInfo { get; set; }

        /// <summary>
        /// 查询系统配置信息实体
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.Model.SysWebSetting> Detail(APIRequestEntity<long> request)
        {
            var response = new APIResponseEntity<XCLCMS.Data.Model.SysWebSetting>();
            response.Body = sysWebSettingBLL.GetModel(request.Body);
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 查询系统配置分页列表
        /// </summary>
        public APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_SysWebSetting>> PageList(APIRequestEntity<PageListConditionEntity> request)
        {
            var pager = request.Body.PagerInfoSimple.ToPagerInfo();
            var response = new APIResponseEntity<XCLCMS.Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<XCLCMS.Data.Model.View.v_SysWebSetting>>();
            response.Body = new Data.WebAPIEntity.ResponseEntity.PageListResponseEntity<Data.Model.View.v_SysWebSetting>();

            response.Body.ResultList = vSysWebSettingBLL.GetPageList(pager, new XCLNetTools.Entity.SqlPagerConditionEntity()
            {
                OrderBy = "[KeyName] asc",
                Where = request.Body.Where
            });
            response.Body.PagerInfo = pager;
            response.IsSuccess = true;
            return response;
        }

        /// <summary>
        /// 判断系统配置名是否存在
        /// </summary>
        public APIResponseEntity<bool> IsExistKeyName(APIRequestEntity<XCLCMS.Data.WebAPIEntity.RequestEntity.SysWebSetting.IsExistKeyNameEntity> request)
        {
            var response = new APIResponseEntity<bool>();
            response.IsSuccess = true;
            response.Message = "该配置名可以使用！";

            request.Body.KeyName = (request.Body.KeyName ?? "").Trim();

            if (request.Body.SysWebSettingID > 0)
            {
                var model = this.sysWebSettingBLL.GetModel(request.Body.SysWebSettingID);
                if (null != model)
                {
                    if (string.Equals(request.Body.KeyName, model.KeyName, StringComparison.OrdinalIgnoreCase))
                    {
                        return response;
                    }
                }
            }

            if (!string.IsNullOrEmpty(request.Body.KeyName))
            {
                bool isExist = this.sysWebSettingBLL.IsExistKeyName(request.Body.KeyName);
                if (isExist)
                {
                    response.IsSuccess = false;
                    response.Message = "该配置名已被占用！";
                }
            }

            return response;
        }

        /// <summary>
        /// 新增系统配置信息
        /// </summary>
        public APIResponseEntity<bool> Add(APIRequestEntity<XCLCMS.Data.Model.SysWebSetting> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            request.Body.KeyName = (request.Body.KeyName ?? "").Trim();
            request.Body.ValueType = (request.Body.ValueType ?? XCLCMS.Data.CommonHelper.EnumType.SysWebSettingValueTypeEnum.STR.ToString()).Trim().ToUpper();

            //商户必须存在
            var merchant = this.merchantBLL.GetModel(request.Body.FK_MerchantID);
            if (null == merchant)
            {
                response.IsSuccess = false;
                response.Message = "无效的商户号！";
                return response;
            }

            if (string.IsNullOrWhiteSpace(request.Body.KeyName))
            {
                response.IsSuccess = false;
                response.Message = "请提供配置名！";
                return response;
            }

            if (this.sysWebSettingBLL.IsExistKeyName(request.Body.KeyName))
            {
                response.IsSuccess = false;
                response.Message = string.Format("配置名【{0}】已存在！", request.Body.KeyName);
                return response;
            }

            if (request.Body.ValueType == XCLCMS.Data.CommonHelper.EnumType.SysWebSettingValueTypeEnum.JON.ToString())
            {
                if ((!string.IsNullOrWhiteSpace(request.Body.KeyValue) && !XCLNetTools.Serialize.JSON.IsJSON(request.Body.KeyValue)) ||
                    (!string.IsNullOrWhiteSpace(request.Body.TestKeyValue) && !XCLNetTools.Serialize.JSON.IsJSON(request.Body.TestKeyValue)) ||
                    (!string.IsNullOrWhiteSpace(request.Body.UATKeyValue) && !XCLNetTools.Serialize.JSON.IsJSON(request.Body.UATKeyValue)) ||
                    (!string.IsNullOrWhiteSpace(request.Body.PrdKeyValue) && !XCLNetTools.Serialize.JSON.IsJSON(request.Body.PrdKeyValue)))
                {
                    response.IsSuccess = false;
                    response.Message = "配置值必须为JSON类型！";
                    return response;
                }
            }
            else if (request.Body.ValueType == XCLCMS.Data.CommonHelper.EnumType.SysWebSettingValueTypeEnum.NUM.ToString())
            {
                if ((!string.IsNullOrWhiteSpace(request.Body.KeyValue) && !XCLNetTools.StringHander.PageValid.IsDecimalSign(request.Body.KeyValue)) ||
                    (!string.IsNullOrWhiteSpace(request.Body.TestKeyValue) && !XCLNetTools.StringHander.PageValid.IsDecimalSign(request.Body.TestKeyValue)) ||
                    (!string.IsNullOrWhiteSpace(request.Body.UATKeyValue) && !XCLNetTools.StringHander.PageValid.IsDecimalSign(request.Body.UATKeyValue)) ||
                    (!string.IsNullOrWhiteSpace(request.Body.PrdKeyValue) && !XCLNetTools.StringHander.PageValid.IsDecimalSign(request.Body.PrdKeyValue)))
                {
                    response.IsSuccess = false;
                    response.Message = "配置值必须为数字类型！";
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

            request.Body.CreaterID = this.ContextInfo.UserInfoID;
            request.Body.CreaterName = this.ContextInfo.UserName;
            request.Body.CreateTime = DateTime.Now;
            request.Body.UpdaterID = request.Body.CreaterID;
            request.Body.UpdaterName = request.Body.CreaterName;
            request.Body.UpdateTime = request.Body.CreateTime;

            response.IsSuccess = this.sysWebSettingBLL.Add(request.Body);
            if (response.Body)
            {
                response.Message = "系统配置信息添加成功！";
            }
            else
            {
                response.Message = "系统配置信息添加失败！";
            }
            return response;
        }

        /// <summary>
        /// 修改系统配置信息
        /// </summary>
        public APIResponseEntity<bool> Update(APIRequestEntity<XCLCMS.Data.Model.SysWebSetting> request)
        {
            var response = new APIResponseEntity<bool>();

            #region 数据校验

            request.Body.ValueType = (request.Body.ValueType ?? XCLCMS.Data.CommonHelper.EnumType.SysWebSettingValueTypeEnum.STR.ToString()).Trim().ToUpper();

            var model = this.sysWebSettingBLL.GetModel(request.Body.SysWebSettingID);
            if (null == model)
            {
                response.IsSuccess = false;
                response.Message = "请指定有效的配置信息！";
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

            if (!string.Equals(model.KeyName, request.Body.KeyName))
            {
                if (this.sysWebSettingBLL.IsExistKeyName(request.Body.KeyName))
                {
                    response.IsSuccess = false;
                    response.Message = string.Format("配置名【{0}】已存在！", request.Body.KeyName);
                    return response;
                }
            }

            if (request.Body.ValueType == XCLCMS.Data.CommonHelper.EnumType.SysWebSettingValueTypeEnum.JON.ToString())
            {
                if ((!string.IsNullOrWhiteSpace(request.Body.KeyValue) && !XCLNetTools.Serialize.JSON.IsJSON(request.Body.KeyValue)) ||
                    (!string.IsNullOrWhiteSpace(request.Body.TestKeyValue) && !XCLNetTools.Serialize.JSON.IsJSON(request.Body.TestKeyValue)) ||
                    (!string.IsNullOrWhiteSpace(request.Body.UATKeyValue) && !XCLNetTools.Serialize.JSON.IsJSON(request.Body.UATKeyValue)) ||
                    (!string.IsNullOrWhiteSpace(request.Body.PrdKeyValue) && !XCLNetTools.Serialize.JSON.IsJSON(request.Body.PrdKeyValue)))
                {
                    response.IsSuccess = false;
                    response.Message = "配置值必须为JSON类型！";
                    return response;
                }
            }
            else if (request.Body.ValueType == XCLCMS.Data.CommonHelper.EnumType.SysWebSettingValueTypeEnum.NUM.ToString())
            {
                if ((!string.IsNullOrWhiteSpace(request.Body.KeyValue) && !XCLNetTools.StringHander.PageValid.IsDecimalSign(request.Body.KeyValue)) ||
                    (!string.IsNullOrWhiteSpace(request.Body.TestKeyValue) && !XCLNetTools.StringHander.PageValid.IsDecimalSign(request.Body.TestKeyValue)) ||
                    (!string.IsNullOrWhiteSpace(request.Body.UATKeyValue) && !XCLNetTools.StringHander.PageValid.IsDecimalSign(request.Body.UATKeyValue)) ||
                    (!string.IsNullOrWhiteSpace(request.Body.PrdKeyValue) && !XCLNetTools.StringHander.PageValid.IsDecimalSign(request.Body.PrdKeyValue)))
                {
                    response.IsSuccess = false;
                    response.Message = "配置值必须为数字类型！";
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

            model.FK_MerchantAppID = request.Body.FK_MerchantAppID;
            model.FK_MerchantID = request.Body.FK_MerchantID;
            model.KeyName = request.Body.KeyName;
            model.KeyValue = request.Body.KeyValue;
            model.TestKeyValue = request.Body.TestKeyValue;
            model.UATKeyValue = request.Body.UATKeyValue;
            model.PrdKeyValue = request.Body.PrdKeyValue;
            model.Remark = request.Body.Remark;
            model.UpdaterID = this.ContextInfo.UserInfoID;
            model.UpdaterName = this.ContextInfo.UserName;
            model.UpdateTime = DateTime.Now;

            response.IsSuccess = this.sysWebSettingBLL.Update(model);
            if (response.IsSuccess)
            {
                response.Message = "系统配置信息修改成功！";
            }
            else
            {
                response.Message = "系统配置信息修改失败！";
            }
            return response;
        }

        /// <summary>
        /// 删除系统配置信息
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
                response.Message = "请指定要删除的系统配置ID！";
                return response;
            }

            foreach (var k in request.Body)
            {
                var model = this.sysWebSettingBLL.GetModel(k);
                if (null == model)
                {
                    continue;
                }

                model.UpdaterID = this.ContextInfo.UserInfoID;
                model.UpdaterName = this.ContextInfo.UserName;
                model.UpdateTime = DateTime.Now;
                model.RecordState = XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.R.ToString();
                if (!this.sysWebSettingBLL.Update(model))
                {
                    response.IsSuccess = false;
                    response.Message = "系统配置删除失败！";
                    return response;
                }
            }

            response.IsSuccess = true;
            response.Message = "已成功删除系统配置！";
            response.IsRefresh = true;

            return response;
        }
    }
}