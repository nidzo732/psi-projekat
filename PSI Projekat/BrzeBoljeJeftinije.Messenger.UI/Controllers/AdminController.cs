using BrzeBoljeJeftinije.Messenger.UI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BrzeBoljeJeftinije.Messenger.UI.Controllers
{
    public class AdminController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Login(AdminUser model)
        {
            return Redirect(Url.Action("Index"));
        }
    }
}