using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Killerapp.Repositories.RForum;
using Proftaak;
using Microsoft.AspNetCore.Authorization;
using Proftaak.Repositories.UserRepo;

namespace Killerapp.Controllers.User
{
    [Route("api/[controller]/[action]")]
    public class UserController : Controller
    {
        IUserRepo userRepo;

        public UserController()
        {
            userRepo = new UserRepo(new Connection());
        }

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult index()
        {
            return Json(userRepo.index());
        }
    }
}