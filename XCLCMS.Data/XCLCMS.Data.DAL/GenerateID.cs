using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Data;
using System.Data.Common;

namespace XCLCMS.Data.DAL
{
    /// <summary>
    /// 数据访问类:GenerateID
    /// </summary>
    public partial class GenerateID : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        /// 生成主键
        /// </summary>
        /// <param name="IDType">类型</param>
        /// <param name="remark">备注</param>
        public long GetGenerateID(string IDType, string remark = "")
        {
            Database db = base.CreateDatabase();
            DbCommand dbCommand = db.GetStoredProcCommand("sp_GenerateID");
            db.AddOutParameter(dbCommand, "ResultCode", DbType.Int32, 4);
            db.AddOutParameter(dbCommand, "ResultMessage", DbType.String, 1000);
            db.AddOutParameter(dbCommand, "IDValue", DbType.Int64, 8);
            db.AddOutParameter(dbCommand, "IDCode", DbType.Int64, 8);

            db.AddInParameter(dbCommand, "IDType", DbType.AnsiString, IDType);
            db.AddInParameter(dbCommand, "Remark", DbType.String, remark);
            db.ExecuteNonQuery(dbCommand);
            var result = XCLCMS.Data.DAL.Common.Common.GetProcedureResult(dbCommand.Parameters);
            if (result.IsSuccess)
            {
                return XCLNetTools.Common.DataTypeConvert.ToLong(dbCommand.Parameters["@IDCode"].Value);
            }
            else
            {
                throw new Exception(result.ResultMessage);
            }
        }
    }
}