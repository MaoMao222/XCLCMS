using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:UserInfo
    /// </summary>
    public partial class UserInfo : XCLCMS.Data.DAL.Common.BaseDAL
    {
        public UserInfo()
        { }

        #region Method

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.UserInfo GetModel(long UserInfoID)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select * from UserInfo WITH(NOLOCK)   where UserInfoID=@UserInfoID");
            db.AddInParameter(dbCommand, "UserInfoID", DbType.Int64, UserInfoID);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.UserInfo>(dr);
            }
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.UserInfo> GetModelList(string strWhere)
        {
            StringBuilder strSql = new StringBuilder();
            strSql.Append("select * FROM UserInfo WITH(NOLOCK)   ");
            if (strWhere.Trim() != "")
            {
                strSql.Append(" where " + strWhere);
            }
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand(strSql.ToString());
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToList<XCLCMS.Data.Model.UserInfo>(dr);
            }
        }

        #endregion Method

        #region MethodEx

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.UserInfo> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            condition.TableName = "UserInfo";
            return XCLCMS.Data.DAL.Common.Common.GetPageList<XCLCMS.Data.Model.UserInfo>(pageInfo, condition);
        }

        /// <summary>
        /// 判断指定用户名是否存在
        /// </summary>
        public bool IsExistUserName(string userName)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select top 1 1 from UserInfo WITH(NOLOCK)   where UserName=@UserName");
            db.AddInParameter(dbCommand, "UserName", DbType.AnsiString, userName);
            return db.ExecuteScalar(dbCommand) != null;
        }

        /// <summary>
        /// 根据用户名和密码获取用户实体
        /// </summary>
        public XCLCMS.Data.Model.UserInfo GetModel(string userName, string pwd)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select top 1 * from UserInfo  WITH(NOLOCK)  where UserName=@UserName and Pwd=@Pwd");
            db.AddInParameter(dbCommand, "UserName", DbType.AnsiString, userName);
            db.AddInParameter(dbCommand, "Pwd", DbType.AnsiString, pwd);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.UserInfo>(dr);
            }
        }

        /// <summary>
        /// 根据用户名获取用户实体
        /// </summary>
        public XCLCMS.Data.Model.UserInfo GetModel(string userName)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetSqlStringCommand("select top 1 * from UserInfo WITH(NOLOCK)   where UserName=@UserName");
            db.AddInParameter(dbCommand, "UserName", DbType.AnsiString, userName);
            using (var dr = db.ExecuteReader(dbCommand))
            {
                return XCLNetTools.DataSource.DataReaderHelper.DataReaderToEntity<XCLCMS.Data.Model.UserInfo>(dr);
            }
        }

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.UserInfo model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_UserInfo_ADD");
            db.AddInParameter(dbCommand, "UserInfoID", DbType.Int64, model.UserInfoID);
            db.AddInParameter(dbCommand, "UserName", DbType.AnsiString, model.UserName);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
            db.AddInParameter(dbCommand, "FK_MerchantAppID", DbType.Int64, model.FK_MerchantAppID);
            db.AddInParameter(dbCommand, "RealName", DbType.String, model.RealName);
            db.AddInParameter(dbCommand, "NickName", DbType.String, model.NickName);
            db.AddInParameter(dbCommand, "Pwd", DbType.AnsiString, model.Pwd);
            db.AddInParameter(dbCommand, "Age", DbType.Int32, model.Age);
            db.AddInParameter(dbCommand, "SexType", DbType.AnsiString, model.SexType);
            db.AddInParameter(dbCommand, "Birthday", DbType.DateTime, model.Birthday);
            db.AddInParameter(dbCommand, "Tel", DbType.AnsiString, model.Tel);
            db.AddInParameter(dbCommand, "QQ", DbType.AnsiString, model.QQ);
            db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
            db.AddInParameter(dbCommand, "OtherContact", DbType.String, model.OtherContact);
            db.AddInParameter(dbCommand, "AccessType", DbType.AnsiString, model.AccessType);
            db.AddInParameter(dbCommand, "AccessToken", DbType.AnsiString, model.AccessToken);
            db.AddInParameter(dbCommand, "UserState", DbType.AnsiString, model.UserState);
            db.AddInParameter(dbCommand, "Remark", DbType.String, model.Remark);
            db.AddInParameter(dbCommand, "RoleName", DbType.String, model.RoleName);
            db.AddInParameter(dbCommand, "RoleMaxWeight", DbType.Int32, model.RoleMaxWeight);
            db.AddInParameter(dbCommand, "RecordState", DbType.AnsiString, model.RecordState);
            db.AddInParameter(dbCommand, "CreateTime", DbType.DateTime, model.CreateTime);
            db.AddInParameter(dbCommand, "CreaterID", DbType.Int64, model.CreaterID);
            db.AddInParameter(dbCommand, "CreaterName", DbType.String, model.CreaterName);
            db.AddInParameter(dbCommand, "UpdateTime", DbType.DateTime, model.UpdateTime);
            db.AddInParameter(dbCommand, "UpdaterID", DbType.Int64, model.UpdaterID);
            db.AddInParameter(dbCommand, "UpdaterName", DbType.String, model.UpdaterName);

            db.AddOutParameter(dbCommand, "ResultCode", DbType.Int32, 4);
            db.AddOutParameter(dbCommand, "ResultMessage", DbType.String, 1000);
            db.ExecuteNonQuery(dbCommand);

            var result = XCLCMS.Data.DAL.Common.Common.GetProcedureResult(dbCommand.Parameters);
            if (result.IsSuccess)
            {
                return true;
            }
            else
            {
                throw new Exception(result.ResultMessage);
            }
        }

        /// <summary>
        ///  更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.UserInfo model)
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_UserInfo_Update");
            db.AddInParameter(dbCommand, "UserInfoID", DbType.Int64, model.UserInfoID);
            db.AddInParameter(dbCommand, "UserName", DbType.AnsiString, model.UserName);
            db.AddInParameter(dbCommand, "FK_MerchantID", DbType.Int64, model.FK_MerchantID);
            db.AddInParameter(dbCommand, "FK_MerchantAppID", DbType.Int64, model.FK_MerchantAppID);
            db.AddInParameter(dbCommand, "RealName", DbType.String, model.RealName);
            db.AddInParameter(dbCommand, "NickName", DbType.String, model.NickName);
            db.AddInParameter(dbCommand, "Pwd", DbType.AnsiString, model.Pwd);
            db.AddInParameter(dbCommand, "Age", DbType.Int32, model.Age);
            db.AddInParameter(dbCommand, "SexType", DbType.AnsiString, model.SexType);
            db.AddInParameter(dbCommand, "Birthday", DbType.DateTime, model.Birthday);
            db.AddInParameter(dbCommand, "Tel", DbType.AnsiString, model.Tel);
            db.AddInParameter(dbCommand, "QQ", DbType.AnsiString, model.QQ);
            db.AddInParameter(dbCommand, "Email", DbType.AnsiString, model.Email);
            db.AddInParameter(dbCommand, "OtherContact", DbType.String, model.OtherContact);
            db.AddInParameter(dbCommand, "AccessType", DbType.AnsiString, model.AccessType);
            db.AddInParameter(dbCommand, "AccessToken", DbType.AnsiString, model.AccessToken);
            db.AddInParameter(dbCommand, "UserState", DbType.AnsiString, model.UserState);
            db.AddInParameter(dbCommand, "Remark", DbType.String, model.Remark);
            db.AddInParameter(dbCommand, "RoleName", DbType.String, model.RoleName);
            db.AddInParameter(dbCommand, "RoleMaxWeight", DbType.Int32, model.RoleMaxWeight);
            db.AddInParameter(dbCommand, "RecordState", DbType.AnsiString, model.RecordState);
            db.AddInParameter(dbCommand, "CreateTime", DbType.DateTime, model.CreateTime);
            db.AddInParameter(dbCommand, "CreaterID", DbType.Int64, model.CreaterID);
            db.AddInParameter(dbCommand, "CreaterName", DbType.String, model.CreaterName);
            db.AddInParameter(dbCommand, "UpdateTime", DbType.DateTime, model.UpdateTime);
            db.AddInParameter(dbCommand, "UpdaterID", DbType.Int64, model.UpdaterID);
            db.AddInParameter(dbCommand, "UpdaterName", DbType.String, model.UpdaterName);

            db.AddOutParameter(dbCommand, "ResultCode", DbType.Int32, 4);
            db.AddOutParameter(dbCommand, "ResultMessage", DbType.String, 1000);
            db.ExecuteNonQuery(dbCommand);

            var result = XCLCMS.Data.DAL.Common.Common.GetProcedureResult(dbCommand.Parameters);
            if (result.IsSuccess)
            {
                return true;
            }
            else
            {
                throw new Exception(result.ResultMessage);
            }
        }

        #endregion MethodEx
    }
}