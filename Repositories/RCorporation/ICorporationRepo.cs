using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RCorporation
{
    interface ICorporationRepo
    {
        List<CorporationModel> index();
        void destroy(int id);
    }
}
