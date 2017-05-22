namespace XCLCMS.Data.BLL
{
    /// <summary>
    /// 评论管理
    /// </summary>
    public class Comments
    {
        private readonly XCLCMS.Data.DAL.Comments dal = new XCLCMS.Data.DAL.Comments();

        #region Method

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.Comments model)
        {
            return dal.Add(model);
        }

        /// <summary>
        ///  更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.Comments model)
        {
            return dal.Update(model);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.Comments GetModel(long CommentsID)
        {
            return dal.GetModel(CommentsID);
        }

        #endregion Method
    }
}