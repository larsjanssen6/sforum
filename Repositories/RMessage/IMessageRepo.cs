using System;
using System.Collections.Generic;

namespace Killerapp.Repositories.RMessage
{
    interface IMessageRepo
    {
        // A message repo must implement this interface

        List<MessageModel> index(int forumId);
        int store(MessageModel message, int accountId);
        MessageModel find(int id);
        void update(MessageModel message);
        void destroy(int id);
    }
}
