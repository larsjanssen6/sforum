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
        LogErrors errors;  
      
        //Init constructor
        public SoftwareController()
        {
            softwareRepo = new SoftwareRepo(new Connection());
            errors = new LogErrors();
        }

        //Return all software

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult index([FromBody] int corporationId)
        {
            try
            {
                return Json(softwareRepo.index(corporationId));
            }

            catch (Exception ex)
            {
                errors.log(ex);
                return Json(null);
            }
        }

        //Return software

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult show([FromBody] int id)
        {
            try
            {
                return Json(softwareRepo.find(id));
            }

            catch (Exception ex)
            {
                errors.log(ex);
                return Json(null);
            }
        }

        //Store software

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult store([FromBody] SoftwareModel software)
        {
            try
            {
                softwareRepo.store(software);
                return StatusCode(200);
            }

            catch (Exception ex)
            {
                errors.log(ex);
                return Json(null);
            }         
        }

        //Update software

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult update([FromBody] SoftwareModel software)
        {
            try
            {
                softwareRepo.update(software);
                return StatusCode(200);
            }

            catch (Exception ex)
            {
                errors.log(ex);
                return Json(null);
            }          
        }

        //Destroy software

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult destroy([FromBody] SoftwareModel software)
        {
            try
            {
                softwareRepo.destroy(software.id);
                return StatusCode(200);
            }

            catch (Exception ex)
            {
                errors.log(ex);
                return Json(null);
            }          
        }
    }
}