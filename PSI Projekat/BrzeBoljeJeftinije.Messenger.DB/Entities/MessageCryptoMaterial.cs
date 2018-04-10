using System;
using System.Collections.Generic;
using System.Text;

namespace BrzeBoljeJeftinije.Messenger.DB.Entities
{
    public class MessageCryptoMaterial
    {
        public int Id { get; set; }
        public int MessageId { get; set; }
        public int UserId { get; set; }
        public string Material { get; set; }
    }
}
