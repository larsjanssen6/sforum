using System;
using System.Collections.Generic;

namespace Killerapp.Repositories.RMessage
{
    interface IMessageRepo
    {
        List<MessageModel> index(int forumId);
        void store(MessageModel message, int accountId);
        MessageModel find(int id);
        void update(MessageModel message);
        void destroy(int id);
    }
}
