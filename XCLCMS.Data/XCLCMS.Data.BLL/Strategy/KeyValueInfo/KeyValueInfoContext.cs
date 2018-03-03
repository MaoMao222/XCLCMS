using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XCLCMS.Data.BLL.Strategy.KeyValueInfo
{
    /// <summary>
    /// 自定义结构数据存储上下文
    /// </summary>
    public class KeyValueInfoContext : BaseContext
    {
        /// <summary>
        /// 自定义结构数据存储信息
        /// </summary>
        public XCLCMS.Data.Model.KeyValueInfo KeyValueInfo { get; set; }

        /// <summary>
        /// 分类id
        /// </summary>
        public List<long> KeyValueInfoTypeIDList { get; set; }
    }
}