namespace XCLCMS.Data.BLL
{
    public class Ads
    {
        private readonly XCLCMS.Data.DAL.Ads dal = new XCLCMS.Data.DAL.Ads();

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.Ads model)
        {
            return dal.Add(model);
        }

        /// <summary>
        ///  更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.Ads model)
        {
            return dal.Update(model);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.Ads GetModel(long AdsID)
        {
            return dal.GetModel(AdsID);
        }

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
        public XCLCMS.Data.Model.Ads GetModel(string code)
        {
            return dal.GetModel(code);
        }
    }
}