using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XCLCMS.Data.BLL.Strategy.KeyValueInfo
{
    /// <summary>
    /// 保存自由数据存储分类关系信息
    /// </summary>
    public class KeyValueInfoType : BaseStrategy
    {
        /// <summary>
        /// 构造
        /// </summary>
        public KeyValueInfoType()
        {
            this.Name = "保存自由数据存储分类关系信息";
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
            var bll = new BLL.KeyValueInfoType();

            try
            {
                //删除分类关系
                bll.Delete(keyValueInfoContext.KeyValueInfo.KeyValueInfoID);

                //添加分类关系
                flag = bll.Add(keyValueInfoContext.KeyValueInfo.KeyValueInfoID, keyValueInfoContext.KeyValueInfoTypeIDList, new Model.Custom.ContextModel()
                {
                    UserInfoID = keyValueInfoContext.ContextInfo.UserInfoID,
                    UserName = keyValueInfoContext.ContextInfo.UserName
                });
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
                this.ResultMessage = string.Format("保存自由数据存储分类关系信息失败！{0}", this.ResultMessage);
            }
        }
    }
}