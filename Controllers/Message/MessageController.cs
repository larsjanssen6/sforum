using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Killerapp.Repositories.RForum;
using Proftaak;
using Microsoft.AspNetCore.Authorization;
using Killerapp.Repositories.RMessage;
using Killerapp.Repositories.RReaction;

namespace Killerapp.Controllers.Message
{
    [Route("api/[controller]/[action]")]
    public class MessageController : Controller
    {
        IMessageRepo messageRepo;
        LogErrors errors;

        //Init constructor 

        public MessageController()
        {
            messageRepo = new MessageRepo(new Connection(), new ReactionRepo(new Connection()));
            errors = new LogErrors();
        }

        //Return all messages

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult index([FromBody] int forumId)
        {
            try
            {
                return Json(messageRepo.index(forumId));
            }

            catch (Exception ex)
            {
                errors.log(ex);
                return Json(null);
            }
        }

        //Store a user

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult store([FromBody] MessageModel message)
        {
            try
            {
                int authId = Convert.ToInt32(User.Claims.Single(c => c.Type == "id").Value);
                messageRepo.store(message, authId);
                return StatusCode(200);
            }

            catch (Exception ex)
            {
                errors.log(ex);
                return Json(null);
            }           
        }

        //Show a message

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult show([FromBody] int id)
        {
            try
            {
                return Json(messageRepo.find(id));
            }

            catch (Exception ex)
            {
                errors.log(ex);
                return Json(null);
            }
        }

        //Update a message

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult update([FromBody] MessageModel message)
        {
            try
            {
                messageRepo.update(message);
                return StatusCode(200);
            }

            catch (Exception ex)
            {
                errors.log(ex);
                return Json(null);
            }          
        }

        //Destroy a message

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult destroy([FromBody] MessageModel message)
        {
            try
            {
                messageRepo.destroy(message.id);
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