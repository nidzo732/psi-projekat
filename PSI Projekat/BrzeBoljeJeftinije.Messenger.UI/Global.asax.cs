using BrzeBoljeJeftinije.Messenger.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Unity;
using Unity.AspNet.Mvc;

namespace BrzeBoljeJeftinije.Messenger.UI
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            DependencyResolver.SetResolver(new UnityDependencyResolver(BuildUnityContainer()));
        }

        protected IUnityContainer BuildUnityContainer()
        {
            var container = new UnityContainer();

            container.RegisterType<IDBProvider, MockDBProvider>();

            return container;
        }
    }
}
