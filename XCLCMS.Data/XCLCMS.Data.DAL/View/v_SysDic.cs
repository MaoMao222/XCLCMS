using Microsoft.Practices.EnterpriseLibrary.Data;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL.View
{
    public class v_SysDic : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public v_SysDic()
        { }

        #region BasicMethod

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_SysDic GetModel(long SysDicID)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select  top 1 * from v_SysDic  WITH(NOLOCK)  ");
            strSql.Append(" where SysDicID=@SysDicID ");
            XCLCMS.Data.Model.View.v_SysDic model = new XCLCMS.Data.Model.View.v_SysDic();
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            db.AddInParameter(dbCommand, "SysDicID", DbType.Int64, SysDicID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.View.v_SysDic>(dr);
            }
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysDic> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM v_SysDic  WITH(NOLOCK)  ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.View.v_SysDic>(dr);
            }
        }

        #endregion BasicMethod

        #region ExtensionMethod

        /// <summary>
        /// 根据parentID返回列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysDic> GetList(long parentID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from v_SysDic  WITH(NOLOCK)  where ParentID=@ParentID order by sort asc");
            db.AddInParameter(dbCommand, "ParentID", DbType.Int64, parentID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.View.v_SysDic>(dr);
            }
        }

        /// <summary>
        /// 递归获取指定code下的所有列表（不包含该code的记录）
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysDic> GetAllUnderListByCode(string code)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from fun_SysDic_GetAllUnderListByCode(@Code)");
            db.AddInParameter(dbCommand, "Code", DbType.AnsiString, code);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.View.v_SysDic>(dr);
            }
        }

        /// <summary>
        /// 递归获取指定SysDicID下的所有列表（不包含该SysDicID的记录）
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysDic> GetAllUnderListByID(long sysDicID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from fun_SysDic_GetAllUnderListByID(@sysDicID)");
            db.AddInParameter(dbCommand, "sysDicID", DbType.AnsiString, sysDicID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.View.v_SysDic>(dr);
            }
        }

        /// <summary>
        /// 获取所有系统菜单信息
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_SysDic> GetSystemMenuModelList()
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append(@"SELECT * FROM dbo.fun_SysDic_GetAllUnderListByCode('SysMenu') order by sort asc");
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.View.v_SysDic>(dr);
            }
        }

        #endregion ExtensionMethod
    }
}