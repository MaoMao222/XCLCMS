using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL.View
{
    /// <summary>
    /// 数据访问类:v_SysRole
    /// </summary>
    public partial class v_SysRole : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public v_SysRole()
        { }

        #region Method

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_SysRole GetModel(long SysRoleID)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select  top 1 * from v_SysRole  WITH(NOLOCK)  ");
            strSql.Append(" where SysRoleID=@SysRoleID ");
            XCLCMS.Data.Model.View.v_SysRole model = new XCLCMS.Data.Model.View.v_SysRole();
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "SysRoleID", DbType.Int64, SysRoleID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.View.v_SysRole>(dr);
            }
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysRole> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM v_SysRole WITH(NOLOCK)   ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            using (var dr = db.ExecuteReader(CommandType.Text, strSql.ToString()))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.View.v_SysRole>(dr);
            }
        }

        #endregion Method

        #region MethodEx

        /// <summary>
        /// 根据parentID返回列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysRole> GetList(long parentID)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * from v_SysRole  WITH(NOLOCK)  where ParentID=@ParentID order by Weight asc");
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, parentID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.View.v_SysRole>(dr);
            }
        }

        /// <summary>
        /// 根据code查询model
        /// </summary>
        public XCLCMS.Data.Model.View.v_SysRole GetModelByCode(string code)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append(@"SELECT
                                        top 1
                                        a.*
                                        FROM dbo.v_SysRole AS a WITH(NOLOCK)
                                        where a.RecordState='N' and a.Code=@Code
                                        ");

            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, code);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.View.v_SysRole>(dr);
            }
        }

        /// <summary>
        /// 返回商户下的所有角色
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysRole> GetListByMerchantID(long merchantID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(@"
                SELECT * FROM dbo.v_SysRole WITH(NOLOCK) WHERE RecordState='N' AND FK_MerchantID=@FK_MerchantID AND NodeLevel=3
                ORDER BY Weight ASC
            ");
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, merchantID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.View.v_SysRole>(dr);
            }
        }

        #endregion MethodEx
    }
}