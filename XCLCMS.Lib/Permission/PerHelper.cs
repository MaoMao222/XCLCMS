using System.Collections.Generic;
using System.Linq;

namespace XCLCMS.Lib.Permission
{
    /// <summary>
    /// 权限帮助类
    /// </summary>
    public class PerHelper
    {
        #region 角色相关

        /// <summary>
        /// 获取指定用户的角色
        /// </summary>
        public static List<XCLCMS.Data.Model.SysRole> GetRoleByUserID(long userId)
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<long>();
            request.Body = userId;
            var response = XCLCMS.Lib.WebAPI.SysRoleAPI.GetRoleByUserID(request);
            return null == response ? null : response.Body;
        }

        /// <summary>
        /// 获取普通商户的所有功能数据源列表
        /// </summary>
        public static List<XCLCMS.Data.Model.View.v_SysFunction> GetNormalMerchantFunctionTreeList()
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<object>();
            request.Body = new object();
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.GetNormalMerchantFunctionTreeList(request);
            return null == response ? null : response.Body;
        }

        /// <summary>
        /// 获取普通商户的所有功能id List
        /// </summary>
        public static List<long> GetNormalMerchantFunctionIDList()
        {
            List<long> result = null;
            var lst = GetNormalMerchantFunctionTreeList();
            if (null != lst && lst.Count > 0)
            {
                result = lst.Where(k => k.IsLeaf == 1).Select(k => (long)k.SysFunctionID).ToList();
            }
            return result ?? new List<long>();
        }

        #endregion 角色相关

        #region 权限功能相关

        /// <summary>
        /// 判断指定用户是否至少拥有权限组中的某个权限
        /// </summary>
        public static bool HasAnyPermission(long userId, List<XCLCMS.Data.CommonHelper.Function.FunctionEnum> functionList)
        {
            if (null == functionList || functionList.Count == 0)
            {
                return false;
            }
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<XCLCMS.Data.WebAPIEntity.RequestEntity.SysFunction.HasAnyPermissionEntity>();
            request.Body = new Data.WebAPIEntity.RequestEntity.SysFunction.HasAnyPermissionEntity();
            request.Body.UserId = userId;
            request.Body.FunctionIDList = functionList.Select(k => (long)k).ToList();
            var response = XCLCMS.Lib.WebAPI.SysFunctionAPI.HasAnyPermission(request);
            return null != response && response.Body;
        }

        /// <summary>
        /// 判断指定用户是否拥有某个权限
        /// </summary>
        public static bool HasPermission(long userId, XCLCMS.Data.CommonHelper.Function.FunctionEnum funEm)
        {
            return PerHelper.HasAnyPermission(userId, new List<Data.CommonHelper.Function.FunctionEnum>() {
                funEm
            });
        }

        #endregion 权限功能相关

        #region 其它

        /// <summary>
        /// 判断指定用户是否只能访问自己商户的数据
        /// </summary>
        public static bool IsOnlyCurrentMerchant(long userId)
        {
            return HasPermission(userId, Data.CommonHelper.Function.FunctionEnum.SysFun_DataFilter_OnlyCurrentMerchant);
        }

        #endregion 其它
    }
}