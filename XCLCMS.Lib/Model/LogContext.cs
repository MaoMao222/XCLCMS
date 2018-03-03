using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace XCLCMS.Lib.Model
{
    [Serializable]
    public class LogContext
    {
        public string UserToken { get; set; }
        public long MerchantID { get; set; }
        public long MerchantAppID { get; set; }
        public string ClientIP { get; set; }
    }
}