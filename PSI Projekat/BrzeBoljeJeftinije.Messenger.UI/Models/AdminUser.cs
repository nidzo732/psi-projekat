using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace BrzeBoljeJeftinije.Messenger.UI.Models
{
    public class AdminUser
    {
        [DisplayName("Korisničko ime")]
        public string Username { get; set; }
        [DisplayName("Šifra")]
        public string Password { get; set; }
    }
}