using BrzeBoljeJeftinije.Messenger.DB;
using BrzeBoljeJeftinije.Messenger.UI.Helpers;
using BrzeBoljeJeftinije.Messenger.UI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BrzeBoljeJeftinije.Messenger.UI.Controllers
{
    public class AdminController : BaseController
    {

        public AdminController(IDBProvider dbProvider)
            : base(dbProvider)
        {
        }

        [AdminAuthorize]
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
            var user = dbProvider.GetAdminUser(model.Username);
            if (user == null || !user.ValidatePassword(model.Password))
            {
                ViewData["AdminError"] = "Neispravno ime ili lozinka";
                return View();
            }
            SessionData.AdminUser = user;
            return Redirect(Url.Action("Index"));
        }

        [HttpPost]
        [AdminAuthorize]
        public ActionResult Search(string name)
        {
            if (name == null) return HttpNotFound();
            var users = dbProvider.SearchUsersByName(name);
            var result = users.Select(x => new
            {
                id = x.Id,
                name = x.Name,
                picture = UserHelper.GetPictureUrl(x.Id),
                banDate= x.BannedUntil==null?DateTime.Now:x.BannedUntil,
                status= (x.BannedUntil==null || x.BannedUntil<=DateTime.Now.Date)?"ok":"ban",
            }).ToList();
            return Json(result);
        }

        [HttpPost]
        [AdminAuthorize]
        public ActionResult UpdateStatus(UpdateStatusModel model)
        {
            if (!ModelState.IsValid) return HttpNotFound();
            var user = dbProvider.GetUserByID(model.Id, false);
            if (user == null) return HttpNotFound();
            if(model.Status=="ok")
            {
                user.BannedUntil = null;
                dbProvider.UpdateUser(user);
                return Content("OK");
            }
            else
            {
                if(model.ExpiryDate<=DateTime.Now)
                {
                    return Content("FAIL:Datum bana je neispravan");
                }
                user.BannedUntil = model.ExpiryDate.Date;
                dbProvider.UpdateUser(user);
                return Content("OK");
            }
        }

        [HttpPost]
        [AdminAuthorize]
        public ActionResult MyPassword(string password)
        {
            if (password == null) return HttpNotFound();
            if (password.Length == 0) return HttpNotFound();
            var user = SessionData.AdminUser;
            user.SetPassword(password);
            SessionData.AdminUser = user;
            dbProvider.StoreAdminUser(user);
            return Content("OK");
        }

        [HttpPost]
        [AdminAuthorize]
        public ActionResult Register(AdminUser user)
        {
            if(string.IsNullOrWhiteSpace(user.Username) || string.IsNullOrWhiteSpace(user.Password))
            {
                return HttpNotFound();
            }
            var oldUser = dbProvider.GetAdminUser(user.Username);
            if(oldUser!=null)
            {
                return Content("FAIL:Već postoji administrator pod tim imenom");
            }
            var newAdmin = new DB.Entities.AdminUser
            {
                Username=user.Username
            };
            newAdmin.SetPassword(user.Password);
            dbProvider.StoreAdminUser(newAdmin);
            return Content("OK");
            
        }
    }
}