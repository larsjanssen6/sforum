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

        //Return all forums

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult groupBy()
        {
            return Json(funRepo.groupBy());
        }

        //Return all forums

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult groupByHaving()
        {
            return Json(funRepo.groupByHaving());
        }
    }
}