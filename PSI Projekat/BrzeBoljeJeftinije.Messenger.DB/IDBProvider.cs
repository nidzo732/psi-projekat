using System;
using System.Collections.Generic;
using System.Text;
using BrzeBoljeJeftinije.Messenger.DB.Entities;

namespace BrzeBoljeJeftinije.Messenger.DB
{
    interface IDBProvider
    {
        void StoreUser(User user);
        void UpdateUser(User user);
        User GetUserByID(int id, bool includePicture);
        User GetUserByCertHash(string certHash, bool includePicture);
        List<User> GetUsersInGroup(Group group);
        void AddUsersToGroup(List<User> user, Group group, bool isAdmin);
        List<Group> GetGroupsForUser(User user);
        bool CheckIfUserIsAdmin(User user, Group group);
    
        void StoreMessage(Message message);
        void StoreCryptographicMaterial(MessageCryptoMaterial material);
        MessageCryptoMaterial GetCryptographicMaterial(User user, Message message);
        void StoreAttachment(Attachment attachment);
        List<Message> GetMessagesForGroup(Group group, int pageNumber, int pageSize);   //Ovo nek sortira po TimeStamp-u
        List<Attachment> GetAttachmentsForMessage(Message message);
        

        int CountUnreadMessages(User user, Group group);
        void MarkMessageAsRead(User user, Message message);

        void CreateFriendRequest(FriendRequest request);
        void UpdateFriendRequest(FriendRequest request);
        void GetUnseenFriendRequestForUser(User user);
        
    }
}
