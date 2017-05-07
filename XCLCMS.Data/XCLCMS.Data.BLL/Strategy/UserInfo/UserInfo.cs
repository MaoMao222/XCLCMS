using System;

namespace XCLCMS.Data.BLL.Strategy.UserInfo
{
    /// <summary>
    /// 保存用户基础信息
    /// </summary>
    public class UserInfo : BaseStrategy
    {
        /// <summary>
        /// 构造
        /// </summary>
        public UserInfo()
        {
            this.Name = "保存用户基础信息";
        }

        /// <summary>
        /// 执行策略
        /// </summary>
        public override void DoWork<T>(T context)
        {
            var userInfoContext = context as XCLCMS.Data.BLL.Strategy.UserInfo.UserInfoContext;

            if (null == userInfoContext.UserInfo)
            {
                return;
            }

            bool flag = false;
            XCLCMS.Data.BLL.UserInfo bll = new BLL.UserInfo();

            try
            {
                switch (userInfoContext.HandleType)
                {
                    case StrategyLib.HandleType.ADD:
                        userInfoContext.UserInfo.CreaterID = userInfoContext.ContextInfo.UserInfoID;
                        userInfoContext.UserInfo.CreaterName = userInfoContext.ContextInfo.UserName;
                        userInfoContext.UserInfo.CreateTime = DateTime.Now;
                        userInfoContext.UserInfo.UpdaterID = userInfoContext.UserInfo.CreaterID;
                        userInfoContext.UserInfo.UpdaterName = userInfoContext.UserInfo.CreaterName;
                        userInfoContext.UserInfo.UpdateTime = userInfoContext.UserInfo.CreateTime;
                        flag = bll.Add(userInfoContext.UserInfo);
                        break;

                    case StrategyLib.HandleType.UPDATE:
                        userInfoContext.UserInfo.UpdaterID = userInfoContext.ContextInfo.UserInfoID;
                        userInfoContext.UserInfo.UpdaterName = userInfoContext.ContextInfo.UserName;
                        userInfoContext.UserInfo.UpdateTime = DateTime.Now;
                        flag = bll.Update(userInfoContext.UserInfo);
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
                this.ResultMessage = string.Format("保存用户基础信息失败！{0}", this.ResultMessage);
            }
        }
    }
}