using Microsoft.AspNetCore.Mvc;
using Proftaak;
using Microsoft.AspNetCore.Authorization;
using Killerapp.Repositories.RFun;

namespace Killerapp.Controllers.Fun
{
    [Route("api/[controller]/[action]")]
    public class FunController : Controller
    {
        IFunRepo funRepo;

        //Init constructor
        public FunController()
        {
           funRepo = new FunRepo(new Connection());
        }

        //Return all forums with a group by

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult groupBy()
        {
            return Json(funRepo.groupBy());
        }

        //Return all forums with a group by 

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult groupByHaving()
        {
            return Json(funRepo.groupByHaving());
        }
        
        //Return all software that user Lars has

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult outerJoin()
        {
          return Json(funRepo.groupByHaving());
        }

        //Return all corporations that have a recursive relationship

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult recursive()
        {
          return Json(funRepo.recursive());
        }

        //Return all corporations that have a recursive relationship

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult gecorreleerd()
        {
          return Json(funRepo.gecorreleerde());
        }

        //Return all corporations that have a recursive relationship

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult checkSwearWords()
        {
            funRepo.challengeTrigger();
            return StatusCode(200);
        }
    }
}