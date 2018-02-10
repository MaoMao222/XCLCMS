using System.Collections.Generic;

namespace XCLCMS.Data.BLL
{
    /// <summary>
    /// 系统字典表
    /// </summary>
    public partial class SysDic
    {
        private readonly XCLCMS.Data.DAL.SysDic dal = new XCLCMS.Data.DAL.SysDic();

        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public XCLCMS.Data.Model.SysDic GetModel(long SysDicID)
        {
            return dal.GetModel(SysDicID);
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public List<XCLCMS.Data.Model.SysDic> GetModelList(string strWhere)
        {
            return dal.GetModelList(strWhere);
        }

        /// <summary>
        /// 获取当前sysDicID所属的层级list
        /// 如:根目录/子目录/文件
        /// </summary>
        public List<XCLCMS.Data.Model.Custom.SysDicSimple> GetLayerListBySysDicID(long sysDicID)
        {
            return dal.GetLayerListBySysDicID(sysDicID);
        }

        /// <summary>
        /// 判断指定唯一标识是否存在
        /// </summary>
        public bool IsExistCode(string code)
        {
            return dal.IsExistCode(code);
        }

        /// <summary>
        /// 删除指定sysDicID下面的子节点
        /// </summary>
        public bool DelChild(XCLCMS.Data.Model.SysDic model)
        {
            return dal.DelChild(model);
        }

        /// <summary>
        /// 根据code查询其子项
        /// </summary>
        public List<XCLCMS.Data.Model.SysDic> GetChildListByCode(string code)
        {
            return dal.GetChildListByCode(code);
        }

        /// <summary>
        /// 根据SysDicID查询其子项
        /// </summary>
        public List<XCLCMS.Data.Model.SysDic> GetChildListByID(long sysDicID)
        {
            return dal.GetChildListByID(sysDicID);
        }

        /// <summary>
        ///  增加一条数据
        /// </summary>
        public bool Add(XCLCMS.Data.Model.SysDic model)
        {
            return dal.Add(model);
        }

        /// <summary>
        ///  更新一条数据
        /// </summary>
        public bool Update(XCLCMS.Data.Model.SysDic model)
        {
            return dal.Update(model);
        }

        /// <summary>
        /// 根据字典库code返回该 code子项dictionary
        /// key:DicName,value:DicValue
        /// </summary>
        public Dictionary<string, string> GetDictionaryByCode(string code)
        {
            Dictionary<string, string> result = null;
            var lst = this.GetChildListByCode(code);
            if (null != lst && lst.Count > 0)
            {
                result = new Dictionary<string, string>();
                lst.ForEach(k =>
                {
                    result.Add(k.DicName, k.DicValue);
                });
            }
            return result;
        }

        /// <summary>
        /// 根据字典库code返回该 code子项dictionary
        /// key:DicName,value:SysDicID
        /// </summary>
        public Dictionary<string, long> GetDictionaryByCodeWithID(string code)
        {
            Dictionary<string, long> result = null;
            var lst = this.GetChildListByCode(code);
            if (null != lst && lst.Count > 0)
            {
                result = new Dictionary<string, long>();
                lst.ForEach(k =>
                {
                    result.Add(k.DicName, k.SysDicID);
                });
            }
            return result;
        }

        /// <summary>
        /// 获取证件类型
        /// </summary>
        public Dictionary<string, long> GetPassTypeDic()
        {
            return this.GetDictionaryByCodeWithID(XCLCMS.Data.CommonHelper.SysDicConst.SysDicCodeEnum.PassType.ToString());
        }

        /// <summary>
        /// 根据code查询model
        /// </summary>
        public XCLCMS.Data.Model.SysDic GetModelByCode(string code)
        {
            return dal.GetModelByCode(code);
        }

        /// <summary>
        /// 获取根节点model
        /// </summary>
        public XCLCMS.Data.Model.SysDic GetRootModel()
        {
            return this.GetModelByCode(CommonHelper.SysDicConst.SysDicCodeEnum.Root.ToString());
        }
    }
}