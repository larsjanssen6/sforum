using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RReaction
{
    public interface IReactionRepo
    {
        List<ReactionModel> index(int messageId);
        void destroy(int id);
        int store(ReactionModel reaction, int authId);
        void update(ReactionModel reaction);
        ReactionModel find(int id);
    }
}
