using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XCLCMS.Data.BLL
{
    internal class KeyValueInfoType
    {
        private readonly XCLCMS.Data.DAL.KeyValueInfoType dal = new XCLCMS.Data.DAL.KeyValueInfoType();

        /// <summary>
        /// 增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.KeyValueInfoType model)
        {
            return dal.Add(model);
        }

        /// <summary>
        /// 批量删除
        /// </summary>
        public bool Delete(long keyValueInfoID)
        {
            return dal.Delete(keyValueInfoID);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        public bool Add(List<XCLCMS.Data.Model.KeyValueInfoType> lst)
        {
            return dal.Add(lst);
        }

        /// <summary>
        /// 批量添加
        /// </summary>
        public bool Add(long keyValueInfoID, List<long> keyValueInfoTypeIDList, XCLCMS.Data.Model.Custom.ContextModel context = null)
        {
            return dal.Add(keyValueInfoID, keyValueInfoTypeIDList, context);
        }
    }
}