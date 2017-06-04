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
        LogErrors errors;    

        //Init constructor

        public UserController()
        {
            userRepo = new UserRepo(new Connection());
            errors = new LogErrors();
        }
        
        //Return all users

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult index()
        {
            try
            {
                return Json(userRepo.index());
            }

            catch (Exception ex)
            {
                errors.log(ex);
                return Json(null);
            }
        }

        //Return one user

        [HttpPost]
        [Authorize(Roles = "user")]
        public JsonResult show([FromBody] int id)
        {
            try
            {
                return Json(userRepo.find(id));
            }

            catch (Exception ex)
            {
                errors.log(ex);
                return Json(null);
            }
        }

        //Store a user

        [HttpPost]
        public IActionResult store([FromBody] UserModel user)
        {
            try
            {
                userRepo.store(user);
                return StatusCode(200);
            }

            catch (Exception ex)
            {
                errors.log(ex);
                return Json(null);
            }         
        }

        //Update a user

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult update([FromBody] UserModel user)
        {
            try
            {
                userRepo.update(user);
                return StatusCode(200);
            }

            catch (Exception ex)
            {
                errors.log(ex);
                return Json(null);
            }            
        }

        //Destroy a reaction

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult destroy([FromBody] UserModel user)
        {
            try
            {
                userRepo.destroy(user.id);
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