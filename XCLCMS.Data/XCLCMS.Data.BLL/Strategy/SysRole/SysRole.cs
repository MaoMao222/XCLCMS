using System;

namespace XCLCMS.Data.BLL.Strategy.SysRole
{
    /// <summary>
    /// 保存角色基本信息
    /// </summary>
    public class SysRole : BaseStrategy
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public SysRole()
        {
            this.Name = "保存角色基本信息";
        }

        /// <summary>
        /// 执行策略
        /// </summary>
        public override void DoWork<T>(T context)
        {
            var sysRoleContext = context as XCLCMS.Data.BLL.Strategy.SysRole.SysRoleContext;

            if (null == sysRoleContext.SysRole)
            {
                return;
            }

            bool flag = false;
            XCLCMS.Data.BLL.SysRole bll = new BLL.SysRole();

            try
            {
                switch (sysRoleContext.HandleType)
                {
                    case StrategyLib.HandleType.ADD:
                        sysRoleContext.SysRole.CreaterID = sysRoleContext.ContextInfo.UserInfoID;
                        sysRoleContext.SysRole.CreaterName = sysRoleContext.ContextInfo.UserName;
                        sysRoleContext.SysRole.CreateTime = DateTime.Now;
                        sysRoleContext.SysRole.UpdaterID = sysRoleContext.SysRole.CreaterID;
                        sysRoleContext.SysRole.UpdaterName = sysRoleContext.SysRole.CreaterName;
                        sysRoleContext.SysRole.UpdateTime = sysRoleContext.SysRole.CreateTime;
                        flag = bll.Add(sysRoleContext.SysRole);
                        break;

                    case StrategyLib.HandleType.UPDATE:
                        sysRoleContext.SysRole.UpdaterID = sysRoleContext.ContextInfo.UserInfoID;
                        sysRoleContext.SysRole.UpdaterName = sysRoleContext.ContextInfo.UserName;
                        sysRoleContext.SysRole.UpdateTime = DateTime.Now;
                        flag = bll.Update(sysRoleContext.SysRole);
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
                this.ResultMessage = string.Format("保存角色基本信息失败！{0}", this.ResultMessage);
            }
        }
    }
}