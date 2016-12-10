using System.Web.Mvc;

namespace XCLCMS.WebAPI.Controllers
{
    /// <summary>
    /// api
    /// </summary>
    public class HomeController : Controller
    {
        /// <summary>
        /// api契约首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return Redirect("~/Help/");
        }
    }
}