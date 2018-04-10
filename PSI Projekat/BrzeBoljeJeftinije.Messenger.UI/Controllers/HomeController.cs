using BrzeBoljeJeftinije.Messenger.UI.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BrzeBoljeJeftinije.Messenger.UI.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            SessionData.SignatureAuthToken = CryptoHelper.GetRandomToken();
            return View();
        }
    }
}