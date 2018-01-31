namespace XCLCMS.Data.BLL
{
    public class Product
    {
        private readonly XCLCMS.Data.DAL.Product dal = new XCLCMS.Data.DAL.Product();

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.Product model)
        {
            return dal.Add(model);
        }

        /// <summary>
        ///  更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.Product model)
        {
            return dal.Update(model);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.Product GetModel(long ProductID)
        {
            return dal.GetModel(ProductID);
        }
    }
}