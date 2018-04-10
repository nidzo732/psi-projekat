using BrzeBoljeJeftinije.Messenger.DB;
using BrzeBoljeJeftinije.Messenger.UI.Helpers;
using BrzeBoljeJeftinije.Messenger.UI.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BrzeBoljeJeftinije.Messenger.UI.Controllers
{
    [CardAuthorize]
    public class UserController : BaseController
    {
        public UserController(IDBProvider dbProvider)
            : base(dbProvider)
        {
        }
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult MyPicture()
        {
            var user = dbProvider.GetUserByID(SessionData.User.Id, true);
            return File(user.Picture, user.PictureType);
        }

        [HttpGet]
        public ActionResult Picture(int? id)
        {
            if (id == null) return HttpNotFound();
            var user = dbProvider.GetUserByID((int)id, true);
            if (user == null) return HttpNotFound();
            return File(user.Picture, user.PictureType);
        }

        [HttpPost]
        public ActionResult SendRequest(int? id)
        {
            if (id == null) return HttpNotFound();
            if (id == SessionData.User.Id) return HttpNotFound();
            var other = dbProvider.GetUserByID((int)id, false);
            if (other == null) return HttpNotFound();
            if (dbProvider.GetSentFriendRequests(SessionData.User).Any(x => x.ReceiverId == id)
                || dbProvider.GetUnresolvedFriendRequests(SessionData.User).Any(x => x.SenderId == id))
            {
                return HttpNotFound();
            }
            if (dbProvider.GetFriends(SessionData.User).Any(x => x.Id == id))
            {
                return HttpNotFound();
            }
            dbProvider.CreateFriendRequest(new DB.Entities.FriendRequest
            {
                ReceiverId = (int)id,
                Resolved = false,
                Seen = false,
                SenderId = SessionData.User.Id,
                Timestamp = DateTime.Now
            });
            MessengerHub.CallRefresh(other.RtID);
            return Content("OK");
        }

        [HttpPost]
        public ActionResult Accept(int? otherId)
        {
            if (otherId == null) return HttpNotFound();
            var request = dbProvider.GetRequestBetween(new DB.Entities.User { Id = (int)otherId }, SessionData.User);
            if (request == null) return HttpNotFound();
            request.Resolved = true;
            var group = dbProvider.CreateGroup(new DB.Entities.Group
            {
                Binary = true,
                IsAdmin = false,
                Name = null,
                Picture = null,
                PictureType = null,
                Timestamp = DateTime.Now
            });
            dbProvider.AddUsersToGroup(new List<DB.Entities.User>()
            {
                SessionData.User,
                new DB.Entities.User
                {
                    Id=(int)otherId
                }
            }, group, false);
            dbProvider.AddFriendship(SessionData.User, new DB.Entities.User
            {
                Id = (int)otherId
            });
            dbProvider.DeleteFriendRequest(request);
            var other = dbProvider.GetUserByID((int)otherId, false);
            MessengerHub.CallRefresh(other.RtID);
            return Content("OK");
        }

        [HttpPost]
        public ActionResult Reject(int? otherId)
        {
            if (otherId == null) return HttpNotFound();
            var request = dbProvider.GetRequestBetween(new DB.Entities.User { Id = (int)otherId }, SessionData.User);
            if (request == null) return HttpNotFound();
            request.Resolved = true;
            dbProvider.UpdateFriendRequest(request);
            return Content("OK");
        }

        [HttpPost]
        public ActionResult MyPicture(HttpPostedFileBase picture)
        {
            try
            {
                if (picture.ContentType == null || !picture.ContentType.StartsWith("image"))
                {
                    TempData["ErrorMessage"] = "Niste poslali sliku";
                    return RedirectToAction("Index", "Settings");
                }
                var user = SessionData.User;
                Image image = Image.FromStream(picture.InputStream);
                image = ResizeImage(image, 320, 320);
                using (var mStream = new MemoryStream())
                {
                    image.Save(mStream, ImageFormat.Jpeg);
                    user.Picture = mStream.ToArray();
                    user.PictureType = "image/jpeg";
                    SessionData.User = user;
                }
                dbProvider.UpdateUser(user);
                return RedirectToAction("Index", "Settings");
            }
            catch (Exception)
            {
                ViewBag.ErrorMessage = "Slika koju ste poslali nije ispravna";
                return RedirectToAction("Index", "Settings");
            }
        }

        private Image ResizeImage(Image img, int maxWidth, int maxHeight)
        {
            if (img.Height < maxHeight && img.Width < maxWidth) return img;
            using (img)
            {
                Bitmap newImage = new Bitmap(maxWidth, maxHeight, PixelFormat.Format32bppArgb);
                using (Graphics gr = Graphics.FromImage(newImage))
                {
                    gr.Clear(Color.Transparent);
                    gr.InterpolationMode = InterpolationMode.HighQualityBicubic;

                    gr.DrawImage(img,
                        new Rectangle(0, 0, maxWidth, maxHeight),
                        new Rectangle(0, 0, img.Width, img.Height),
                        GraphicsUnit.Pixel);
                }
                return newImage;
            }

        }
        [HttpPost]
        public ActionResult Search(string name)
        {
            if (name == null) return HttpNotFound();
            var users = dbProvider.SearchUsersByName(name);
            var result = users.Where(x => x.Id != SessionData.User.Id).Select(x => new
            {
                id = x.Id,
                name = x.Name,
                picture = UserHelper.GetPictureUrl(x.Id),
            }).ToList();
            return Json(result);
        }
    }
}