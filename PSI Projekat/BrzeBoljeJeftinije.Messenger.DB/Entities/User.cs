using System;
using System.Collections.Generic;
using System.Text;

namespace BrzeBoljeJeftinije.Messenger.DB.Entities
{
    class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CertHash { get; set; }
        public byte[] Certificate { get; set; }
        public byte[] Picture { get; set; }
        public string PictureType { get; set; }
    }
}
