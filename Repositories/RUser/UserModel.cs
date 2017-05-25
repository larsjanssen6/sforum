using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.User
{
    public class UserModel
    {
        public int id { get; set; }
        public int corporation_id { get; set; }
        public int role { get; set; }
        public string password { get; set; }
        public int salary { get; set; }
        public string email { get; set; }
        public string name { get; set; }
        public string lastName { get; set; }
        public string about { get; set; }
        public int gender { get; set; }
        public DateTime birthDate { get; set; }
    }
}
