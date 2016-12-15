using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL.View
{
    /// <summary>
    /// 数据访问类:v_Merchant
    /// </summary>
    public partial class v_Merchant : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public v_Merchant()
        { }

        #region Method

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_Merchant GetModel(long MerchantID)
        {
            XCLCMS.Data.Model.View.v_Merchant model = new XCLCMS.Data.Model.View.v_Merchant();
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from v_Merchant  WITH(NOLOCK)  where MerchantID=@MerchantID");
            db.AddInParameter(dbCommand, "MerchantID", DbType.Int64, MerchantID);
            DataSet ds = db.ExecuteDataSet(dbCommand);

            var lst = XCLNetTools.Generic.ListHelper.DataTableToList<XCLCMS.Data.Model.View.v_Merchant>(ds.Tables[0]);
            return null != lst && lst.Count > 0 ? lst[0] : null;
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Merchant> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM v_Merchant WITH(NOLOCK)   ");
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            var ds = db.ExecuteDataSet(dbCommand);
            return XCLNetTools.Generic.ListHelper.DataSetToList<XCLCMS.Data.Model.View.v_Merchant>(ds) as List<XCLCMS.Data.Model.View.v_Merchant>;
        }

        #endregion Method

        #region Extend Method

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Merchant> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            condition.TableName = "v_Merchant";
            return XCLCMS.Data.DAL.Common.Common.GetPageList<XCLCMS.Data.Model.View.v_Merchant>(pageInfo, condition);
        }

        #endregion Extend Method
    }
}