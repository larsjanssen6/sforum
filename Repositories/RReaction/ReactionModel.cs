using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RReaction
{
    public class ReactionModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public string lastName { get; set; }
        public string reaction { get; set; }
        public int message_id { get; set; }
    }
}
