using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XCLCMS.Data.Model.Custom
{
    [Serializable]
    public class Order_UserProductCondition
    {
        public long Top { get; set; }

        public long UserID { get; set; }

        public string UserName { get; set; }

        public long ProductID { get; set; }

        public string PayStatus { get; set; }

        public string RecordState { get; set; }
    }
}