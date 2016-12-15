using System.Collections.Generic;
using System.Data;

namespace XCLCMS.Data.DAL.View
{
    public class v_Attachment : XCLCMS.Data.DAL.Common.BaseDAL
    {
        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.View.v_Attachment GetModel(long AttachmentID)
        {
            var db = base.CreateDatabase();
            var dbCommand = db.GetSqlStringCommand("select * from v_Attachment WITH(NOLOCK)   where AttachmentID=@AttachmentID");
            db.AddInParameter(dbCommand, "AttachmentID", DbType.Int64, AttachmentID);
            var ds = db.ExecuteDataSet(dbCommand);
            var lst = XCLNetTools.Generic.ListHelper.DataTableToList<XCLCMS.Data.Model.View.v_Attachment>(ds.Tables[0]);
            return null != lst && lst.Count > 0 ? lst[0] : null;
        }

        /// <summary>
        /// 分页数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Attachment> GetPageList(XCLNetTools.Entity.PagerInfo pageInfo, XCLNetTools.Entity.SqlPagerConditionEntity condition)
        {
            condition.TableName = "v_Attachment";
            return XCLCMS.Data.DAL.Common.Common.GetPageList<XCLCMS.Data.Model.View.v_Attachment>(pageInfo, condition);
        }
    }
}