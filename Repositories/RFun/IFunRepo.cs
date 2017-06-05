using Killerapp.Repositories.RFun.models;
using Killerapp.Repositories.Software;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RFun
{
    interface IFunRepo
    {
        List<GroupByModel> groupBy();
        List<GroupByModel> groupByHaving();
        List<SoftwareModel> outerJoin();
        List<RecursiveModel> recursive();
        List<GecorreleerdModel> gecorreleerde();
        void challengeTrigger();
    }
}
