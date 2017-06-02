using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.Software
{
    interface ISoftwareRepo
    {
        // A  software repo must implement this interface

        List<SoftwareModel> index(int id);
        void destroy(int id);
        void update(SoftwareModel software);
        SoftwareModel find(int id);
        void store(SoftwareModel software);
    }
}
