using System;
using System.Collections.Generic;
using System.Text;

namespace BrzeBoljeJeftinije.Messenger.DB.Entities
{
    public class Attachment
    {
        public int Id { get; set; }
        public int MessageId { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public byte[] Content { get; set; }
    }
}
