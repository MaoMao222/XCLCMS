namespace XCLCMS.Data.BLL
{
    public class Orders
    {
        private readonly XCLCMS.Data.DAL.Orders dal = new XCLCMS.Data.DAL.Orders();

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.Orders model)
        {
            return dal.Add(model);
        }

        /// <summary>
        ///  更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.Orders model)
        {
            return dal.Update(model);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.Orders GetModel(long OrderID)
        {
            return dal.GetModel(OrderID);
        }
    }
}