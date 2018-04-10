using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;

namespace BrzeBoljeJeftinije.Messenger.UI.Helpers
{
    public static class Config
    {
        public static bool SimLoginEnabled
        {
            get
            {
                return ConfigurationManager.AppSettings["SimLoginEnabled"] == "true";
            }
        }
    }
}