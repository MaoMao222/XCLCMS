using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL.View
{
    /// <summary>
    /// 数据访问类:v_FriendLinks
    /// </summary>
    public partial class v_FriendLinks : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public v_FriendLinks()
        { }

        #region Method

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_FriendLinks GetModel(long FriendLinkID)
        {
            XCLCMS.Data.Model.View.v_FriendLinks model = new XCLCMS.Data.Model.View.v_FriendLinks();
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from v_FriendLinks WITH(NOLOCK)   where FriendLinkID=@FriendLinkID");
            db.AddInParameter(dbCommand, "FriendLinkID", DbType.Int64, FriendLinkID);
            DataSet ds = db.ExecuteDataSet(dbCommand);

            var lst = XCLNetTools.Generic.ListHelper.DataTableToList<XCLCMS.Data.Model.View.v_FriendLinks>(ds.Tables[0]);
            return null != lst && lst.Count > 0 ? lst[0] : null;
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_FriendLinks> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM v_FriendLinks  WITH(NOLOCK)  ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            var ds = db.ExecuteDataSet(dbCommand);
            return XCLNetTools.Generic.ListHelper.DataSetToList<XCLCMS.Data.Model.View.v_FriendLinks>(ds) as List<XCLCMS.Data.Model.View.v_FriendLinks>;
        }

        #endregion Method

        #region Extend Method

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_FriendLinks> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            condition.TableName = "v_FriendLinks";
            return XCLCMS.Data.DAL.Common.Common.GetPageList<XCLCMS.Data.Model.View.v_FriendLinks>(pageInfo, condition);
        }

        #endregion Extend Method
    }
}