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

        //Init constructor
        public SoftwareController()
        {
            softwareRepo = new SoftwareRepo(new Connection());
        }

        //Return all software

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult index([FromBody] int corporationId)
        {
            return Json(softwareRepo.index(corporationId));
        }

        //Return software

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult show([FromBody] int id)
        {
            return Json(softwareRepo.find(id));
        }

        //Store software

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult store([FromBody] SoftwareModel software)
        {
            softwareRepo.store(software);
            return StatusCode(200);
        }

        //Update software

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult update([FromBody] SoftwareModel software)
        {
            softwareRepo.update(software);
            return StatusCode(200);
        }

        //Destroy software

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult destroy([FromBody] SoftwareModel software)
        {
            softwareRepo.destroy(software.id);
            return StatusCode(200);
        }
    }
}