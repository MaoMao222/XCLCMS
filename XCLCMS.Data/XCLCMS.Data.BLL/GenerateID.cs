namespace XCLCMS.Data.BLL
{
    /// <summary>
    /// ID生成表
    /// </summary>
    public partial class GenerateID
    {
        private readonly XCLCMS.Data.DAL.GenerateID dal = new XCLCMS.Data.DAL.GenerateID();

        /// <summary>
        /// 生成主键
        /// </summary>
        /// <param name="IDType">类型</param>
        public long GetGenerateID(string IDType, string remark = "")
        {
            return dal.GetGenerateID(IDType, remark);
        }
    }
}