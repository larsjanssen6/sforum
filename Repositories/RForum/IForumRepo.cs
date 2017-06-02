using Proftaak;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RForum
{
    interface IForumRepo
    {
        // A forum repo must implement this interface

        List<ForumModel> index();
        ForumModel find(int id);
        void store(ForumModel forum);
        void update(ForumModel forum);
        void destroy(int id);
    }
}
