using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Killerapp.Repositories.RCorporation;
using Microsoft.AspNetCore.Authorization;
using Proftaak;

namespace Killerapp.Controllers.Corporation
{
    [Route("api/[controller]/[action]")]
    public class CorporationController : Controller
    {
        ICorporationRepo corporationRepo;

        //Init constructor

        public CorporationController()
        {
            corporationRepo = new CorporationRepo(new Connection());
        }
        
        
        //Return all corporations

        [HttpPost]
        public JsonResult index()
        {
            return Json(corporationRepo.index());
        }

        //Return one corporation

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult show([FromBody] int id)
        {
          return Json(corporationRepo.find(id));
        }

        //Store a corporation

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult store([FromBody] CorporationModel corporation)
        {
            corporationRepo.store(corporation);
            return StatusCode(200);
        }

        //Update a corporation

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult update([FromBody] CorporationModel corporation)
        {
            corporationRepo.update(corporation);
            return StatusCode(200);
        }

        //Destroy a corporation 
        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult destroy([FromBody] CorporationModel corporation)
        {
            corporationRepo.destroy(corporation.id);
            return StatusCode(200);
        }
    }
}