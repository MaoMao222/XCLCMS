using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL.View
{
    /// <summary>
    /// 数据访问类:v_Tags
    /// </summary>
    public partial class v_Tags : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public v_Tags()
        { }

        #region Method

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_Tags GetModel(long TagsID)
        {
            XCLCMS.Data.Model.View.v_Tags model = new XCLCMS.Data.Model.View.v_Tags();
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from v_Tags WITH(NOLOCK)   where TagsID=@TagsID");
            db.AddInParameter(dbCommand, "TagsID", DbType.Int64, TagsID);
            DataSet ds = db.ExecuteDataSet(dbCommand);

            var lst = XCLNetTools.Generic.ListHelper.DataTableToList<XCLCMS.Data.Model.View.v_Tags>(ds.Tables[0]);
            return null != lst && lst.Count > 0 ? lst[0] : null;
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Tags> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM v_Tags  WITH(NOLOCK)  ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            var ds = db.ExecuteDataSet(dbCommand);
            return XCLNetTools.Generic.ListHelper.DataSetToList<XCLCMS.Data.Model.View.v_Tags>(ds) as List<XCLCMS.Data.Model.View.v_Tags>;
        }

        #endregion Method

        #region Extend Method

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Tags> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            condition.TableName = "v_Tags";
            return XCLCMS.Data.DAL.Common.Common.GetPageList<XCLCMS.Data.Model.View.v_Tags>(pageInfo, condition);
        }

        #endregion Extend Method
    }
}