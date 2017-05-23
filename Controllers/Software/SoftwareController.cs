using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Killerapp.Repositories.RForum;
using Proftaak;
using Microsoft.AspNetCore.Authorization;
using Killerapp.Repositories.Software;

namespace Killerapp.Controllers.Software
{
    [Route("api/[controller]/[action]")]
    public class SoftwareController : Controller
    {
        ISoftwareRepo softwareRepo;

        public SoftwareController()
        {
            softwareRepo = new SoftwareRepo(new Connection());
        }

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult index([FromBody] int corporation_id)
        {
            return Json(softwareRepo.index(corporation_id));
        }
    }
}