using BrzeBoljeJeftinije.Messenger.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BrzeBoljeJeftinije.Messenger.UI.Controllers
{
    public abstract class BaseController:Controller
    {
        protected readonly IDBProvider dbProvider;
        protected BaseController(IDBProvider dbProvider)
        {
            this.dbProvider = dbProvider;
        }

        protected override void EndExecute(IAsyncResult asyncResult)
        {
            try
            {
                base.EndExecute(asyncResult);
                dbProvider.CommitIfNecessary();
            }
            catch
            {
                dbProvider.RollbackIfNecessary();
            }
        }
    }
}