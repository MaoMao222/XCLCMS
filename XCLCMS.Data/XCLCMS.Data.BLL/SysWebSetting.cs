using System.Collections.Generic;

namespace XCLCMS.Data.BLL
{
    /// <summary>
    /// 网站配置表
    /// </summary>
    public partial class SysWebSetting
    {
        private readonly XCLCMS.Data.DAL.SysWebSetting dal = new XCLCMS.Data.DAL.SysWebSetting();

        /// <summary>
        /// 增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.SysWebSetting model)
        {
            return dal.Add(model);
        }

        /// <summary>
        /// 更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.SysWebSetting model)
        {
            return dal.Update(model);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.SysWebSetting GetModel(long SysWebSettingID)
        {
            return dal.GetModel(SysWebSettingID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.SysWebSetting> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 判断指定配置名是否存在
        /// </summary>
        public bool IsExistKeyName(string keyName)
        {
            return dal.IsExistKeyName(keyName);
        }
    }
}