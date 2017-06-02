using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.Software
{
    public class SoftwareModel
    {
        //These values belong to software 

        public int id { get; set; }
        public int corporation_id { get; set; }
        public string name { get; set; }
        public string corporation { get; set; }
    }
}
