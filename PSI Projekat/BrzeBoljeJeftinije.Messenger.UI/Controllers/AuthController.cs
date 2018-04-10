using BrzeBoljeJeftinije.Messenger.DB;
using BrzeBoljeJeftinije.Messenger.DB.Entities;
using BrzeBoljeJeftinije.Messenger.UI.Helpers;
using BrzeBoljeJeftinije.Messenger.UI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.Security;
using System.Text;
namespace BrzeBoljeJeftinije.Messenger.UI.Controllers
{
    public class AuthController : BaseController
    {
        public AuthController(IDBProvider dbProvider)
            : base(dbProvider)
        {
        }
        [HttpPost]
        public ActionResult Index(LoginModel model)
        {
            if (ModelState.IsValid)
            {
                if(model.Signature=="sim")
                {
                    if (!Config.SimLoginEnabled) return HttpNotFound();
                    var name = model.Certificate.Split(':')[1];
                    var id= model.Certificate.Split(':')[0];
                    var secret = model.Certificate.Split(':')[2];
                    var user = GetOrCreateUser(name, id, secret);
                    if (user == null) return HttpNotFound();
                    if(user.BannedUntil!=null && user.BannedUntil>DateTime.Now.Date)
                    {
                        return Content("FAIL:Vaš korisnički nalog je blokiran do " + ((DateTime)user.BannedUntil).ToString("dd.MM.yyyy."));
                    }
                    SessionData.User = user;
                    return Content("OK");
                }
                else
                {
                    var certificate = CryptoHelper.LoadCert(model.Certificate);
                    if (!CryptoHelper.ValidateCert(certificate) || !CryptoHelper.VerifySignature(certificate, SessionData.SignatureAuthToken, model.Signature))
                    {
                        return HttpNotFound();
                    }
                    else
                    {
                        var user = GetOrCreateUser(certificate);
                        if (user.BannedUntil != null && user.BannedUntil > DateTime.Now.Date)
                        {
                            return Content("FAIL:Vaš korisnički nalog je blokiran do " + ((DateTime)user.BannedUntil).ToString("dd.MM.yyyy."));
                        }
                        SessionData.User = user;
                        return Content("OK");
                    }
                }
            }
            else
            {
                return Content("FAIL:Došlo je do nepoznate greške");
            }
        }

        [HttpGet]
        [CardAuthorize]
        public ActionResult Logout()
        {
            SessionData.User = null;
            return RedirectToAction("Index", "Home");
        }

        private User GetOrCreateUser(string simName, string simId, string secret)
        {
            var user = dbProvider.GetUserByCertHash(simId, false);
            if (user != null)
            {
                if (Encoding.UTF8.GetString(user.Certificate) != secret) return null;
                user.RtID = HttpContext.Request.Cookies["ASP.NET_SessionId"].Value;
                dbProvider.UpdateUser(user);
                return user;
            }
            user = new User
            {
                CertHash = simId,
                Certificate = Encoding.UTF8.GetBytes(secret),
                Name = simName,
                RtID = HttpContext.Request.Cookies["ASP.NET_SessionId"].Value
            };
            user.PictureType = "image/png";
            user.Picture = System.IO.File.ReadAllBytes(HostingEnvironment.MapPath(@"~/Content/img/user.png"));
            dbProvider.StoreUser(user);
            return user;
        }

        private User GetOrCreateUser(X509Certificate2 cert)
        {
            var user = dbProvider.GetUserByCertHash(cert.GetSerialNumberString(), false);
            if (user != null)
            {
                user.RtID= HttpContext.Request.Cookies["ASP.NET_SessionId"].Value;
                dbProvider.UpdateUser(user);
                return user;
            }
            user = CryptoHelper.GetUserFromCert(cert);
            user.PictureType = "image/png";
            user.Picture = System.IO.File.ReadAllBytes(HostingEnvironment.MapPath(@"~/Content/img/user.png"));
            user.RtID = HttpContext.Request.Cookies["ASP.NET_SessionId"].Value;
            dbProvider.StoreUser(user);
            return user;
        }
    }
}