using System;
using System.Collections.Generic;
using System.Text;

namespace BrzeBoljeJeftinije.Messenger.DB.Entities
{
    class FriendRequest
    {
        public int SenderId { get; set; }
        public int Receiver_ID { get; set; }
        public bool Rejected { get; set; }
        public bool Seen { get; set; }
        public DateTime TimeStamp { get; set; }
    }
}
