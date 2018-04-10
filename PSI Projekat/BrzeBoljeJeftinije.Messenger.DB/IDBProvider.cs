using System;
using System.Collections.Generic;
using System.Text;
using BrzeBoljeJeftinije.Messenger.DB.Entities;

namespace BrzeBoljeJeftinije.Messenger.DB
{
    public interface IDBProvider
    {
        void StoreUser(User user);
        void UpdateUser(User user);
        User GetUserByID(int id, bool includePicture);
        User GetUserByCertHash(string certHash, bool includePicture);
        List<User> GetUsersInGroup(Group group);
        void AddUsersToGroup(List<User> user, Group group, bool isAdmin);
        List<Group> GetGroupsForUser(User user);
        List<User> SearchUsersByName(string name);
        bool CheckIfUserIsAdmin(User user, Group group);
        Group CreateGroup(Group group);
    
        void StoreMessage(Message message);
        void StoreCryptographicMaterial(MessageCryptoMaterial material);
        MessageCryptoMaterial GetCryptographicMaterial(User user, Message message);
        void StoreAttachment(Attachment attachment);
        List<Message> GetMessagesForGroup(Group group, int pageNumber, int pageSize);
        List<Attachment> GetAttachmentsForMessage(Message message);
        

        int CountUnreadMessages(User user, Group group);
        void MarkMessageAsRead(User user, Message message);

        FriendRequest GetRequestBetween(User sender, User receiver);
        void CreateFriendRequest(FriendRequest request);
        void UpdateFriendRequest(FriendRequest request);
        List<FriendRequest> GetUnresolvedFriendRequests(User user);
        List<FriendRequest> GetSentFriendRequests(User user);
        List<User> GetFriends(User user);
        void AddFriendship(User user1, User user2);
        void DeleteFriendRequest(FriendRequest request);

        AdminUser GetAdminUser(string username);
        void StoreAdminUser(AdminUser user);
        void UpdateAdminUser(AdminUser user);

        void CommitIfNecessary();
        void RollbackIfNecessary();
    }
}
