using System.Collections.Generic;

namespace XCLCMS.View.AdminWeb.Models.Product
{
    public class ProductListVM
    {
        /// <summary>
        /// 查询控件
        /// </summary>
        public XCLNetSearch.Search Search { get; set; }

        /// <summary>
        /// 分页控件
        /// </summary>
        public XCLNetTools.Entity.PagerInfo PagerModel { get; set; }

        /// <summary>
        /// 产品信息列表
        /// </summary>
        public List<XCLCMS.Data.Model.View.v_Product> ProductList { get; set; }
    }
}