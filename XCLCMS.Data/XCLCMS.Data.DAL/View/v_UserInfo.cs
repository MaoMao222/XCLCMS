using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL.View
{
    public partial class v_UserInfo : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public v_UserInfo()
        { }

        #region Method

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_UserInfo GetModel(long UserInfoID)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select  top 1 * from v_UserInfo  WITH(NOLOCK)  ");
            strSql.Append(" where UserInfoID=@UserInfoID ");
            XCLCMS.Data.Model.View.v_UserInfo model = new XCLCMS.Data.Model.View.v_UserInfo();
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "UserInfoID", DbType.Int64, UserInfoID);
            DataSet ds = db.ExecuteDataSet(dbCommand);
            var lst = XCLNetTools.Generic.ListHelper.DataSetToList<XCLCMS.Data.Model.View.v_UserInfo>(ds);
            return null != lst && lst.Count > 0 ? lst[0] : null;
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_UserInfo> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM v_UserInfo WITH(NOLOCK)   ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            var ds = db.ExecuteDataSet(CommandType.Text, strSql.ToString());
            return XCLNetTools.Generic.ListHelper.DataSetToList<XCLCMS.Data.Model.View.v_UserInfo>(ds) as List<XCLCMS.Data.Model.View.v_UserInfo>;
        }

        #endregion Method

        #region Extend Method

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_UserInfo> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            condition.TableName = "v_UserInfo";
            return XCLCMS.Data.DAL.Common.Common.GetPageList<XCLCMS.Data.Model.View.v_UserInfo>(pageInfo, condition);
        }

        #endregion Extend Method
    }
}