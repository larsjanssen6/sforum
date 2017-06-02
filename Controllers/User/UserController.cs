using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Killerapp.Repositories.RForum;
using Proftaak;
using Microsoft.AspNetCore.Authorization;
using Proftaak.Repositories.UserRepo;
using Killerapp.Repositories.User;

namespace Killerapp.Controllers.User
{
    [Route("api/[controller]/[action]")]
    public class UserController : Controller
    {
        IUserRepo userRepo;

        //Init constructor

        public UserController()
        {
            userRepo = new UserRepo(new Connection());
        }
        
        //Return all users

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult index()
        {
            return Json(userRepo.index());
        }

        //Return one user

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult show([FromBody] int id)
        {
            return Json(userRepo.find(id));
        }

        //Store a user

        [HttpPost]
        public IActionResult store([FromBody] UserModel user)
        {
           userRepo.store(user);
           return StatusCode(200);
        }

        //Update a user

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult update([FromBody] UserModel user)
        {
            userRepo.update(user);
            return StatusCode(200);
        }

        //Destroy a reaction

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult destroy([FromBody] UserModel user)
        {
            userRepo.destroy(user.id);
            return StatusCode(200);
        }
    }
}