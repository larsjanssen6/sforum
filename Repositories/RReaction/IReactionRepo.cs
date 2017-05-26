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
        void store(ReactionModel reaction, int authId);
    }
}
