using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RCorporation
{
    public class CorporationModel
    {
        //These values belong to a corporation

        public int id { get; set; }
        public string name { get; set; }
        public string address { get; set; }
        public string zip { get; set; }
        public string email { get; set; }
    }
}
