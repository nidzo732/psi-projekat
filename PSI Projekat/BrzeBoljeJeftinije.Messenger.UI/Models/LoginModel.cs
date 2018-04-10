using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BrzeBoljeJeftinije.Messenger.UI.Models
{
    public class LoginModel
    {
        [Required]
        public string Certificate { get; set; }
        
        [Required]
        public string Signature { get; set; }
    }
}