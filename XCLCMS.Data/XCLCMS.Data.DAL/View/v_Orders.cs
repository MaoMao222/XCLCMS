using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL.View
{
    public class v_Orders : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_Orders GetModel(long OrderID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from v_Orders WITH(NOLOCK)   where OrderID=@OrderID");
            db.AddInParameter(dbCommand, "OrderID", DbType.Int64, OrderID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.View.v_Orders>(dr);
            }
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Orders> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM v_Orders  WITH(NOLOCK)  ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.View.v_Orders>(dr);
            }
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Orders> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            condition.TableName = "v_Orders";
            return XCLCMS.Data.DAL.Common.Common.GetPageList<XCLCMS.Data.Model.View.v_Orders>(pageInfo, condition);
        }
    }
}