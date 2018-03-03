using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XCLCMS.Data.BLL.Strategy.KeyValueInfo
{
    /// <summary>
    /// 保存自定义结构数据存储基础信息
    /// </summary>
    public class KeyValueInfo : BaseStrategy
    {
        /// <summary>
        /// 构造
        /// </summary>
        public KeyValueInfo()
        {
            this.Name = "保存自定义结构数据存储基础信息";
        }

        /// <summary>
        /// 执行策略
        /// </summary>
        public override void DoWork<T>(T context)
        {
            var keyValueInfoContext = context as XCLCMS.Data.BLL.Strategy.KeyValueInfo.KeyValueInfoContext;

            if (null == keyValueInfoContext.KeyValueInfo)
            {
                return;
            }

            bool flag = false;
            var bll = new BLL.KeyValueInfo();

            try
            {
                switch (keyValueInfoContext.HandleType)
                {
                    case StrategyLib.HandleType.ADD:
                        keyValueInfoContext.KeyValueInfo.CreaterID = keyValueInfoContext.ContextInfo.UserInfoID;
                        keyValueInfoContext.KeyValueInfo.CreaterName = keyValueInfoContext.ContextInfo.UserName;
                        keyValueInfoContext.KeyValueInfo.CreateTime = DateTime.Now;
                        keyValueInfoContext.KeyValueInfo.UpdaterID = keyValueInfoContext.KeyValueInfo.CreaterID;
                        keyValueInfoContext.KeyValueInfo.UpdaterName = keyValueInfoContext.KeyValueInfo.CreaterName;
                        keyValueInfoContext.KeyValueInfo.UpdateTime = keyValueInfoContext.KeyValueInfo.CreateTime;
                        flag = bll.Add(keyValueInfoContext.KeyValueInfo);
                        break;

                    case StrategyLib.HandleType.UPDATE:
                        keyValueInfoContext.KeyValueInfo.UpdaterID = keyValueInfoContext.ContextInfo.UserInfoID;
                        keyValueInfoContext.KeyValueInfo.UpdaterName = keyValueInfoContext.ContextInfo.UserName;
                        keyValueInfoContext.KeyValueInfo.UpdateTime = DateTime.Now;
                        flag = bll.Update(keyValueInfoContext.KeyValueInfo);
                        break;
                }
            }
            catch (Exception ex)
            {
                flag = false;
                this.ResultMessage += string.Format("异常信息：{0}", ex.Message);
            }

            if (flag)
            {
                this.Result = StrategyLib.ResultEnum.SUCCESS;
            }
            else
            {
                this.Result = StrategyLib.ResultEnum.FAIL;
                this.ResultMessage = string.Format("保存自定义结构数据存储基础信息失败！{0}", this.ResultMessage);
            }
        }
    }
}