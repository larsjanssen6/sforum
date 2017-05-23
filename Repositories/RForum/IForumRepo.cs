using Proftaak;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RForum
{
    interface IForumRepo
    {
        List<ForumModel> index();
        ForumModel find(int id);
        void store(ForumModel forum);
        void update(ForumModel forum);
        void destroy(int id);
    }
}
