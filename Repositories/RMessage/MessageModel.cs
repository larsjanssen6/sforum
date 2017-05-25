using Killerapp.Repositories.RReaction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RMessage
{
    public class MessageModel
    {
        public int id;
        public string forum;
        public string user;
        public string software;
        public string subject;
        public string message;
        public List<ReactionModel> reactions;
    }
}
