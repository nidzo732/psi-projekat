using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BrzeBoljeJeftinije.Messenger.UI.Models
{
    public class UpdateStatusModel
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [RegularExpression("(?:ok)|(?:ban)")]
        public string Status { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }
    }
}