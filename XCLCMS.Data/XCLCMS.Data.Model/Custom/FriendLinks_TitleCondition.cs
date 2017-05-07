using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XCLCMS.Data.Model.Custom
{
    [Serializable]
    public class FriendLinks_TitleCondition
    {
        public string Title { get; set; }

        public long FK_MerchantID { get; set; }

        public long FK_MerchantAppID { get; set; }
    }
}
