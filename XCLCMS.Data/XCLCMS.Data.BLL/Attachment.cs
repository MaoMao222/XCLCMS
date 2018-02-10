using System.Collections.Generic;

namespace XCLCMS.Data.BLL
{
    /// <summary>
    /// 附件表
    /// </summary>
    public partial class Attachment
    {
        private readonly XCLCMS.Data.DAL.Attachment dal = new XCLCMS.Data.DAL.Attachment();

        /// <summary>
        /// 增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.Attachment model)
        {
            return dal.Add(model);
        }

        /// <summary>
        /// 更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.Attachment model)
        {
            return dal.Update(model);
        }

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.Attachment GetModel(long AttachmentID)
        {
            return dal.GetModel(AttachmentID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.Attachment> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 获取指定id的子记录信息
        /// </summary>
        public List<XCLCMS.Data.Model.Attachment> GetListByParentID(long parentId)
        {
            return dal.GetListByParentID(parentId);
        }

        /// <summary>
        /// 获取与指定附件相关的附件列表（不包含该指定的附件id）
        /// </summary>
        public List<XCLCMS.Data.Model.Attachment> GetCorrelativeList(long attachmentID)
        {
            return dal.GetCorrelativeList(attachmentID);
        }

        /// <summary>
        /// 批量删除
        /// </summary>
        public bool Delete(List<long> idLst, XCLCMS.Data.Model.Custom.ContextModel context)
        {
            return dal.Delete(idLst, context);
        }

        /// <summary>
        /// 根据文件id查询文件信息
        /// </summary>
        public List<XCLCMS.Data.Model.Attachment> GetList(List<long> ids)
        {
            return dal.GetList(ids);
        }
    }
}