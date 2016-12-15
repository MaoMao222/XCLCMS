using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL.View
{
    public class v_SysWebSetting : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public v_SysWebSetting()
        { }

        #region Method

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_SysWebSetting GetModel(long SysWebSettingID)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select  top 1 * from v_SysWebSetting  WITH(NOLOCK)  ");
            strSql.Append(" where SysWebSettingID=@SysWebSettingID ");
            XCLCMS.Data.Model.View.v_SysWebSetting model = new XCLCMS.Data.Model.View.v_SysWebSetting();
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "SysWebSettingID", DbType.Int64, SysWebSettingID);
            DataSet ds = db.ExecuteDataSet(dbCommand);
            var lst = XCLNetTools.Generic.ListHelper.DataSetToList<XCLCMS.Data.Model.View.v_SysWebSetting>(ds);
            return null != lst && lst.Count > 0 ? lst[0] : null;
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysWebSetting> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM v_SysWebSetting WITH(NOLOCK)   ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            var ds = db.ExecuteDataSet(CommandType.Text, strSql.ToString());
            return XCLNetTools.Generic.ListHelper.DataSetToList<XCLCMS.Data.Model.View.v_SysWebSetting>(ds) as List<XCLCMS.Data.Model.View.v_SysWebSetting>;
        }

        #endregion Method

        #region Extend Method

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysWebSetting> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            condition.TableName = "v_SysWebSetting";
            return XCLCMS.Data.DAL.Common.Common.GetPageList<XCLCMS.Data.Model.View.v_SysWebSetting>(pageInfo, condition);
        }

        #endregion Extend Method
    }
}