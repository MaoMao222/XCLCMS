using System;

namespace XCLCMS.Data.Model
{
    /// <summary>
    /// ID生成表
    /// </summary>
    [Serializable]
    public partial class GenerateID
    {
        private string _idtype;
        private long _idvalue;
        private long? _idcode;
        private DateTime _createtime;
        private string _remark;

        /// <summary>
        /// ID类型(IDTypeEnum)
        /// </summary>
        public string IDType
        {
            set { _idtype = value; }
            get { return _idtype; }
        }

        /// <summary>
        /// 生成的ID值
        /// </summary>
        public long IDValue
        {
            set { _idvalue = value; }
            get { return _idvalue; }
        }

        /// <summary>
        /// 唯一值
        /// </summary>
        public long? IDCode
        {
            set { _idcode = value; }
            get { return _idcode; }
        }

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreateTime
        {
            set { _createtime = value; }
            get { return _createtime; }
        }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark
        {
            set { _remark = value; }
            get { return _remark; }
        }
    }
}