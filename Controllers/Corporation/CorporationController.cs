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
        LogErrors errors;

        //Init constructor

        public CorporationController()
        {
            corporationRepo = new CorporationRepo(new Connection());
            errors = new LogErrors();
        }
        
        
        //Return all corporations

        [HttpPost]
        public JsonResult index()
        {
            try
            {
                return Json(corporationRepo.index());
            }

            catch (Exception ex)
            {
               errors.logError(ex);
               return Json(null);      
            }
        }

        //Return one corporation

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult show([FromBody] int id)
        {
            try
            {
                return Json(corporationRepo.find(id));
            }

            catch(Exception ex)
            {
                errors.logError(ex);
                return Json(null);
            }
        }

        //Store a corporation

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult store([FromBody] CorporationModel corporation)
        {
            try
            {
                corporationRepo.store(corporation);
                return StatusCode(200);
            }

            catch (Exception ex)
            {
                errors.logError(ex);
                return Json(null);
            }
        }

        //Update a corporation

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult update([FromBody] CorporationModel corporation)
        {
            try
            {
                corporationRepo.update(corporation);
                return StatusCode(200);
            }

            catch (Exception ex)
            {
                errors.logError(ex);
                return Json(null);
            }
        }

        //Destroy a corporation 

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult destroy([FromBody] CorporationModel corporation)
        {
            try
            {
                corporationRepo.destroy(corporation.id);
                return StatusCode(200);
            }

            catch (Exception ex)
            {
                errors.logError(ex);
                return Json(null);
            }
        }
    }
}