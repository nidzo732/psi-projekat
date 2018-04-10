using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BrzeBoljeJeftinije.Messenger.UI.Helpers
{
    public class UserHelper
    {
        public static string GetPictureUrl(int? id=null)
        {
            if (id == null)
            {
                return "/User/MyPicture?_=" + DateTime.Now.ToString();
            }
            else
            {
                return "/User/Picture?id=" + id + "&_=" + DateTime.Now.ToString();
            }
        }
    }
}