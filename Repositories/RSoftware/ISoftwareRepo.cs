using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.Software
{
    interface ISoftwareRepo
    {
        List<Software> index(int id);
    }
}
