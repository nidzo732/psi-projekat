using System;
using System.Collections.Generic;
using System.Text;

namespace BrzeBoljeJeftinije.Messenger.DB.Entities
{
    public class FriendRequest
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public bool Resolved { get; set; }
        public bool Seen { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
