using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RMessage
{
    interface IMessageRepo
    {
        List<MessageModel> index(int forumId);
    }
}
