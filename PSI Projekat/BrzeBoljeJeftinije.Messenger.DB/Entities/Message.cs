using System;
using System.Collections.Generic;
using System.Text;

namespace BrzeBoljeJeftinije.Messenger.DB.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int GroupId { get; set; }
        public int SenderId { get; set; }
        public DateTime TimeStamp { get; set; }
    }
}
