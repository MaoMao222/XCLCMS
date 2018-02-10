using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL.View
{
    public partial class v_UserInfo : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_UserInfo GetModel(long UserInfoID)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select  top 1 * from v_UserInfo  WITH(NOLOCK)  ");
            strSql.Append(" where UserInfoID=@UserInfoID ");
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "UserInfoID", DbType.Int64, UserInfoID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.View.v_UserInfo>(dr);
            }
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
            using (var dr = db.ExecuteReader(CommandType.Text, strSql.ToString()))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.View.v_UserInfo>(dr);
            }
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_UserInfo> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            condition.TableName = "v_UserInfo";
            return XCLCMS.Data.DAL.Common.Common.GetPageList<XCLCMS.Data.Model.View.v_UserInfo>(pageInfo, condition);
        }
    }
}