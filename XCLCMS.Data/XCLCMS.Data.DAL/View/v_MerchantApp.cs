using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL.View
{
    /// <summary>
    /// 数据访问类:v_MerchantApp
    /// </summary>
    public partial class v_MerchantApp : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public v_MerchantApp()
        { }

        #region Method

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_MerchantApp GetModel(long MerchantAppID)
        {
            XCLCMS.Data.Model.View.v_MerchantApp model = new XCLCMS.Data.Model.View.v_MerchantApp();
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from v_MerchantApp WITH(NOLOCK)   where MerchantAppID=@MerchantAppID");
            db.AddInParameter(dbCommand, "MerchantAppID", DbType.Int64, MerchantAppID);
            DataSet ds = db.ExecuteDataSet(dbCommand);

            var lst = XCLNetTools.Generic.ListHelper.DataTableToList<XCLCMS.Data.Model.View.v_MerchantApp>(ds.Tables[0]);
            return null != lst && lst.Count > 0 ? lst[0] : null;
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_MerchantApp> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select *  FROM v_MerchantApp  WITH(NOLOCK)  ");
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            var ds = db.ExecuteDataSet(dbCommand);
            return XCLNetTools.Generic.ListHelper.DataSetToList<XCLCMS.Data.Model.View.v_MerchantApp>(ds) as List<XCLCMS.Data.Model.View.v_MerchantApp>;
        }

        #endregion Method

        #region Extend Method

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_MerchantApp> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            condition.TableName = "v_MerchantApp";
            return XCLCMS.Data.DAL.Common.Common.GetPageList<XCLCMS.Data.Model.View.v_MerchantApp>(pageInfo, condition);
        }

        #endregion Extend Method
    }
}