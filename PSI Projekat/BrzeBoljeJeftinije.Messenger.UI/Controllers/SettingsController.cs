using BrzeBoljeJeftinije.Messenger.UI.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BrzeBoljeJeftinije.Messenger.UI.Controllers
{
    [CardAuthorize]
    public class SettingsController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}