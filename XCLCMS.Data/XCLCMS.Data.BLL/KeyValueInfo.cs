namespace XCLCMS.Data.BLL
{
    public class KeyValueInfo
    {
        private readonly XCLCMS.Data.DAL.KeyValueInfo dal = new XCLCMS.Data.DAL.KeyValueInfo();

        public KeyValueInfo()
        { }

        #region Method

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.KeyValueInfo model)
        {
            return dal.Add(model);
        }

        /// <summary>
        ///  更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.KeyValueInfo model)
        {
            return dal.Update(model);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.KeyValueInfo GetModel(long AdsID)
        {
            return dal.GetModel(AdsID);
        }

        #endregion Method

        #region MethodEx

        /// <summary>
        /// 判断指定code是否存在
        /// </summary>
        public bool IsExistCode(string code)
        {
            return dal.IsExistCode(code);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.KeyValueInfo GetModel(string code)
        {
            return dal.GetModel(code);
        }

        #endregion MethodEx
    }
}