using BrzeBoljeJeftinije.Messenger.DB;
using BrzeBoljeJeftinije.Messenger.UI.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BrzeBoljeJeftinije.Messenger.UI.Controllers
{
    [CardAuthorize]
    public class MessagesController : BaseController
    {
        public MessagesController(IDBProvider dbProvider)
            : base(dbProvider)
        {
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult MyGroups()
        {
            var groups = dbProvider.GetGroupsForUser(SessionData.User);
            var requests = dbProvider.GetUnresolvedFriendRequests(SessionData.User).Union(dbProvider.GetSentFriendRequests(SessionData.User)).ToList();
            var friends = dbProvider.GetFriends(SessionData.User);
            groups.Sort((g1, g2) =>
            {
                var t1 = g1.LastMessage != null ? (DateTime)g1.LastMessage : g1.Timestamp;
                var t2 = g2.LastMessage != null ? (DateTime)g2.LastMessage : g2.Timestamp;
                return (int)((t1 - t2).TotalSeconds);
            });
            requests.Sort((r1, r2) =>
            {
                return (int)((r1.Timestamp - r2.Timestamp).TotalSeconds);
            });
            List<object> result = new List<object>();
            foreach (var group in groups)
            {
                var members = dbProvider.GetUsersInGroup(group);
                string pictureUrl = "";
                string groupName = group.Name;
                int? otherId = null;
                if (group.Binary)
                {
                    otherId = members.First(x => x.Id != SessionData.User.Id).Id;
                    pictureUrl = UserHelper.GetPictureUrl(otherId);
                    groupName = members.First(x => x.Id != SessionData.User.Id).Name;
                }
                else
                {
                    pictureUrl = "/grpp";
                }
                result.Add(new
                {
                    id = group.Id,
                    timestamp = group.LastMessage != null ? group.LastMessage : group.Timestamp,
                    type = "group",
                    unread = group.ContainsUnread,
                    admin = false,
                    binary = group.Binary,
                    members,
                    picture = pictureUrl,
                    otherId,
                    name = groupName
                });
            }
            foreach(var request in requests)
            {
                result.Add(new
                {
                    id = "r"+request.SenderId,
                    timestamp = request.Timestamp,
                    type = "request",
                    sent = request.SenderId==SessionData.User.Id,
                    admin = false,
                    picture=UserHelper.GetPictureUrl(request.SenderId==SessionData.User.Id?request.ReceiverId:request.SenderId),
                    otherId=request.SenderId == SessionData.User.Id ? request.ReceiverId : request.SenderId,
                    name= dbProvider.GetUserByID(request.SenderId == SessionData.User.Id ? request.ReceiverId : request.SenderId, false).Name,
                });
            }
            return Json(result);
        }
    }
}