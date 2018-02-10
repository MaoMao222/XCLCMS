using System.Collections.Generic;

namespace XCLCMS.Data.BLL
{
    /// <summary>
    /// 用户信息表
    /// </summary>
    public partial class UserInfo
    {
        private readonly XCLCMS.Data.DAL.UserInfo dal = new XCLCMS.Data.DAL.UserInfo();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.UserInfo GetModel(long UserInfoID)
        {
            return dal.GetModel(UserInfoID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.UserInfo> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 分页列表
        /// </summary>
        public List<XCLCMS.Data.Model.UserInfo> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            return dal.GetPageList(pageInfo, condition);
        }

        /// <summary>
        /// 判断指定用户名是否存在
        /// </summary>
        public bool IsExistUserName(string userName)
        {
            return dal.IsExistUserName(userName);
        }

        /// <summary>
        /// 根据用户名和密码获取用户实体
        /// </summary>
        public XCLCMS.Data.Model.UserInfo GetModel(string userName, string pwd)
        {
            return dal.GetModel(userName, pwd);
        }

        /// <summary>
        /// 根据用户名获取用户实体
        /// </summary>
        public XCLCMS.Data.Model.UserInfo GetModel(string userName)
        {
            return dal.GetModel(userName);
        }

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.UserInfo model)
        {
            return dal.Add(model);
        }

        /// <summary>
        ///  更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.UserInfo model)
        {
            return dal.Update(model);
        }
    }
}