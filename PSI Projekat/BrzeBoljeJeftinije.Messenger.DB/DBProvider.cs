using System;
using System.Collections.Generic;
using System.Text;
using BrzeBoljeJeftinije.Messenger.DB.Entities;

namespace BrzeBoljeJeftinije.Messenger.DB
{
    class DBProvider : IDBProvider
    {
        public void AddUsersToGroup(List<User> users, Group group, bool isAdmin)
        {
            throw new NotImplementedException();
        }

        public bool CheckIfUserIsAdmin(User user, Group group)
        {
            throw new NotImplementedException();
        }

        public int CountUnreadMessages(User user, Group group)
        {
            throw new NotImplementedException();
        }

        public void CreateFriendRequest(FriendRequest request)
        {
            throw new NotImplementedException();
        }

        public List<Attachment> GetAttachmentsForMessage(Message message)
        {
            throw new NotImplementedException();
        }

        public MessageCryptoMaterial GetCryptographicMaterial(User user, Message message)
        {
            throw new NotImplementedException();
        }

        public List<Group> GetGroupsForUser(User user)
        {
            throw new NotImplementedException();
        }

        public List<Message> GetMessagesForGroup(Group group, int pageNumber, int pageSize)
        {
            throw new NotImplementedException();
        }

        public void GetUnseenFriendRequestForUser(User user)
        {
            throw new NotImplementedException();
        }

        public User GetUserByCertHash(string certHash, bool includePicture)
        {
            throw new NotImplementedException();
        }

        public User GetUserByID(int id, bool includePicture)
        {
            throw new NotImplementedException();
        }

        public List<User> GetUsersInGroup(Group group)
        {
            throw new NotImplementedException();
        }

        public void MarkMessageAsRead(User user, Message message)
        {
            throw new NotImplementedException();
        }

        public void StoreAttachment(Attachment attachment)
        {
            throw new NotImplementedException();
        }

        public void StoreCryptographicMaterial(MessageCryptoMaterial material)
        {
            throw new NotImplementedException();
        }

        public void StoreMessage(Message message)
        {
            throw new NotImplementedException();
        }

        public void StoreUser(User user)
        {
            throw new NotImplementedException();
        }

        public void UpdateFriendRequest(FriendRequest request)
        {
            throw new NotImplementedException();
        }

        public void UpdateUser(User user)
        {
            throw new NotImplementedException();
        }
    }
}
