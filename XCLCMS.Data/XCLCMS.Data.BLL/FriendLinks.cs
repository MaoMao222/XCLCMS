using XCLCMS.Data.Model.Custom;

namespace XCLCMS.Data.BLL
{
    public class FriendLinks
    {
        private readonly XCLCMS.Data.DAL.FriendLinks dal = new XCLCMS.Data.DAL.FriendLinks();

        /// <summary>
        /// 增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.FriendLinks model)
        {
            return dal.Add(model);
        }

        /// <summary>
        /// 更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.FriendLinks model)
        {
            return dal.Update(model);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.FriendLinks GetModel(long ArticleID)
        {
            return dal.GetModel(ArticleID);
        }

        /// <summary>
        /// 判断指定标题是否存在
        /// </summary>
        public bool IsExist(FriendLinks_TitleCondition condition)
        {
            return dal.IsExist(condition);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.FriendLinks GetModel(FriendLinks_TitleCondition condition)
        {
            return dal.GetModel(condition);
        }
    }
}