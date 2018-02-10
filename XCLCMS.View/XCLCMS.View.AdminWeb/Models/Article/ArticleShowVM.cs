using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XCLCMS.View.AdminWeb.Models.Article
{
    public class ArticleShowVM
    {
        public XCLCMS.Data.Model.View.v_Article Article { get; set; }

        public List<XCLCMS.Data.Model.Attachment> MainImgList { get; set; }

        public List<XCLCMS.Data.Model.Attachment> AttactmentList { get; set; }

        public List<XCLCMS.Data.Model.Product> ProductList { get; set; }
    }
}