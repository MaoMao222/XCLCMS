using System.Collections.Generic;

namespace XCLCMS.Lib.Common
{
    /// <summary>
    /// web api 快速调用
    /// </summary>
    public static class FastAPI
    {
        #region CommonAPI相关

        /// <summary>
        /// 生成ID
        /// </summary>
        public static long CommonAPI_GenerateID(string userToken, XCLCMS.Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity entity)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.Common.GenerateIDEntity>(userToken);
            request.Body = entity;
            var response = XCLCMS.Lib.WebAPI.CommonAPI.GenerateID(request);
            if (null == response)
            {
                return 0;
            }
            return response.Body;
        }

        #endregion CommonAPI相关

        #region MerchantAPI相关

        /// <summary>
        /// 获取商户类型
        /// </summary>
        public static Dictionary<string, long> MerchantAPI_GetMerchantTypeDic(string userToken)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<object>(userToken);
            request.Body = new object();
            var response = XCLCMS.Lib.WebAPI.MerchantAPI.GetMerchantTypeDic(request);
            if (null == response)
            {
                return new Dictionary<string, long>();
            }
            return response.Body;
        }

        #endregion MerchantAPI相关

        #region SysDicAPI相关

        /// <summary>
        /// 获取证件类型
        /// </summary>
        public static Dictionary<string, long> SysDicAPI_GetPassTypeDic(string userToken)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<object>(userToken);
            request.Body = new object();
            var response = XCLCMS.Lib.WebAPI.SysDicAPI.GetPassTypeDic(request);
            if (null == response)
            {
                return new Dictionary<string, long>();
            }
            return response.Body;
        }

        /// <summary>
        /// 获取当前sysDicID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        public static List<XCLCMS.Data.Model.Custom.SysDicSimple> SysDicAPI_GetLayerListBySysDicID(string userToken, XCLCMS.Data.WebAPIEntity.RequestEntity.SysDic.GetLayerListBySysDicIDEntity entity)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.SysDic.GetLayerListBySysDicIDEntity>(userToken);
            request.Body = entity;
            var response = XCLCMS.Lib.WebAPI.SysDicAPI.GetLayerListBySysDicID(request);
            if (null == response)
            {
                return new List<Data.Model.Custom.SysDicSimple>();
            }
            return response.Body;
        }

        /// <summary>
        /// 获取XCLCMS管理后台系统的菜单
        /// </summary>
        public static List<XCLCMS.Data.Model.View.v_SysDic> SysDicAPI_GetSystemMenuModelList(string userToken)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<object>(userToken);
            request.Body = new object();
            var response = XCLCMS.Lib.WebAPI.SysDicAPI.GetSystemMenuModelList(request);
            if (null == response)
            {
                return new List<Data.Model.View.v_SysDic>();
            }
            return response.Body;
        }

        /// <summary>
        /// 根据SysDicID查询其子项
        /// </summary>
        public static List<XCLCMS.Data.Model.SysDic> SysDicAPI_GetChildListByID(string userToken, long sysDicID)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(userToken);
            request.Body = sysDicID;
            var response = XCLCMS.Lib.WebAPI.SysDicAPI.GetChildListByID(request);
            if (null == response)
            {
                return new List<Data.Model.SysDic>();
            }
            return response.Body;
        }

        #endregion SysDicAPI相关

        #region SysFunctionAPI相关

        /// <summary>
        /// 获取当前SysFunctionID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        public static List<XCLCMS.Data.Model.Custom.SysFunctionSimple> SysFunctionAPI_GetLayerListBySysFunctionId(string userToken, XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetLayerListBySysFunctionIdEntity entity)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.GetLayerListBySysFunctionIdEntity>(userToken);
            request.Body = entity;
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.GetLayerListBySysFunctionId(request);
            if (null == response)
            {
                return new List<Data.Model.Custom.SysFunctionSimple>();
            }
            return response.Body;
        }

        /// <summary>
        /// 获取指定角色的所有功能
        /// </summary>
        public static List<XCLCMS.Data.Model.SysFunction> SysFunctionAPI_GetListByRoleID(string userToken, long sysRoleID)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>(userToken);
            request.Body = sysRoleID;
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.GetListByRoleID(request);
            if (null == response)
            {
                return new List<Data.Model.SysFunction>();
            }
            return response.Body;
        }

        #endregion SysFunctionAPI相关

        #region SysRoleAPI 相关

        /// <summary>
        /// 获取当前SysRoleID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        public static List<XCLCMS.Data.Model.Custom.SysRoleSimple> SysRoleAPI_GetLayerListBySysRoleID(string userToken, XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.GetLayerListBySysRoleIDEntity entity)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.SysRole.GetLayerListBySysRoleIDEntity>(userToken);
            request.Body = entity;
            var response = XCLCMS.Lib.WebAPI.SysRoleAPI.GetLayerListBySysRoleID(request);
            if (null == response)
            {
                return new List<Data.Model.Custom.SysRoleSimple>();
            }
            return response.Body;
        }

        #endregion SysRoleAPI 相关
    }
}