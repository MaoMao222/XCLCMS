using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace XCLCMS.Data.DAL.Common
{
    /// <summary>
    /// DAL基类
    /// </summary>
    public class BaseDAL
    {
        private IDbConnection _sqlConnection = null;

        private Database _createDatabase = null;

        /// <summary>
        /// 创建数据库连接
        /// </summary>
        public Database CreateDatabase()
        {
            if (null == this._createDatabase)
            {
                this._createDatabase = new DatabaseProviderFactory().Create("ConnectionString");
            }
            return this._createDatabase;
        }

        /// <summary>
        /// 创建数据库连接
        /// </summary>
        public IDbConnection CreateSqlConnection()
        {
            if (null == this._sqlConnection)
            {
                this._sqlConnection = new SqlConnection(Convert.ToString(ConfigurationManager.ConnectionStrings["ConnectionString"]));
                return this._sqlConnection;
            }
            return this._sqlConnection;
        }
    }
}