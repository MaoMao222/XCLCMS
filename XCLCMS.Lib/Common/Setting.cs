using System;
using System.Collections.Generic;
using System.Linq;
using XCLCMS.Data.WebAPIEntity.RequestEntity;

namespace XCLCMS.Lib.Common
{
    /// <summary>
    /// 获取站点配置
    /// </summary>
    public static class Setting
    {
        /// <summary>
        /// 获取所有配置
        /// </summary>
        private static List<XCLNetTools.Entity.KeyValue> GetAllSettings()
        {
            var request = XCLCMS.Lib.WebAPI.Library.CreateRequest<PageListConditionEntity>();
            request.Body = new PageListConditionEntity();
            request.Body.Where = string.Format("RecordState='{0}'", XCLCMS.Data.CommonHelper.EnumType.RecordStateEnum.N.ToString());
            request.Body.PagerInfoSimple = new XCLNetTools.Entity.PagerInfoSimple(1, Int32.MaxValue - 1, 0);
            var response = XCLCMS.Lib.WebAPI.SysWebSettingAPI.PageList(request);

            List<XCLCMS.Data.Model.View.v_SysWebSetting> settingList = null;
            if (null != response && null != response.Body)
            {
                settingList = response.Body.ResultList;
            }

            if (null == settingList || settingList.Count == 0)
            {
                throw new Exception("系统配置信息获取失败！");
            }

            var sysEnv = XCLCMS.Lib.Common.Comm.GetCurrentEnvironment();
            var lst = new List<XCLNetTools.Entity.KeyValue>();
            settingList.ForEach(m =>
            {
                var kv = new XCLNetTools.Entity.KeyValue();
                kv.Key = m.KeyName;
                switch (sysEnv)
                {
                    case XCLNetTools.Enum.CommonEnum.SysEnvironmentEnum.FAT:
                        kv.Value = m.TestKeyValue;
                        break;

                    case XCLNetTools.Enum.CommonEnum.SysEnvironmentEnum.PRD:
                        kv.Value = m.PrdKeyValue;
                        break;

                    case XCLNetTools.Enum.CommonEnum.SysEnvironmentEnum.UAT:
                        kv.Value = m.UATKeyValue;
                        break;

                    case XCLNetTools.Enum.CommonEnum.SysEnvironmentEnum.DEV:
                    default:
                        kv.Value = m.KeyValue;
                        break;
                }
                lst.Add(kv);
            });

            return lst;
        }

        /// <summary>
        /// model形式的配置
        /// </summary>
        public static XCLCMS.Lib.Model.SettingModel SettingModel
        {
            get
            {
                XCLCMS.Lib.Model.SettingModel model = null;

                //后期优化，需要刷新多台应用服务器的缓存
                ////先从缓存读取
                //if (XCLNetTools.Cache.CacheClass.Exists(Lib.Common.Comm.SettingCacheName))
                //{
                //    model = XCLNetTools.Cache.CacheClass.GetCache(Lib.Common.Comm.SettingCacheName) as XCLCMS.Lib.Model.SettingModel;
                //    if (null != model)
                //    {
                //        return model;
                //    }
                //}

                //若缓存中没有，从数据库中读取
                var all = Setting.GetAllSettings();
                if (null == all || all.Count == 0)
                {
                    return null;
                }

                model = new XCLCMS.Lib.Model.SettingModel();
                string propsName = string.Empty;
                XCLNetTools.Entity.KeyValue tempKeyModel = null;
                var props = model.GetType().GetProperties();
                if (null != props && props.Length > 0)
                {
                    for (int i = 0; i < props.Length; i++)
                    {
                        propsName = props[i].Name;
                        tempKeyModel = all.FirstOrDefault(k => string.Equals(k.Key, propsName, StringComparison.OrdinalIgnoreCase));
                        if (null == tempKeyModel)
                        {
                            throw new Exception(string.Format("配置{0}在数据库中不存在！", propsName));
                        }
                        props[i].SetValue(model, tempKeyModel.Value);
                    }
                }
                //XCLNetTools.Cache.CacheClass.SetCache(Lib.Common.Comm.SettingCacheName, model);

                return model;
            }
        }
    }
}