using System.Collections.Generic;

namespace XCLCMS.Data.BLL
{
    public class ObjectProduct
    {
        private readonly XCLCMS.Data.DAL.ObjectProduct dal = new XCLCMS.Data.DAL.ObjectProduct();

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.ObjectProduct> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 批量删除
        /// </summary>
        public bool Delete(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum objectType, long objectID)
        {
            return dal.Delete(objectType, objectID);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        public bool Add(List<XCLCMS.Data.Model.ObjectProduct> lst)
        {
            return dal.Add(lst);
        }

        /// <summary>
        /// 批量添加（先删再加）
        /// </summary>
        public bool Add(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum objectType, long objectID, List<long> ProductIDList, XCLCMS.Data.Model.Custom.ContextModel context = null)
        {
            return dal.Add(objectType, objectID, ProductIDList, context);
        }

        /// <summary>
        /// 返回指定类型的数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.ObjectProduct> GetModelList(XCLCMS.Data.CommonHelper.EnumType.ObjectTypeEnum objectType, long objectID)
        {
            return dal.GetModelList(objectType, objectID);
        }
    }
}