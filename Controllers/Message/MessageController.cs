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

        //Init constructor 

        public MessageController()
        {
            messageRepo = new MessageRepo(new Connection(), new ReactionRepo(new Connection()));
        }

        //Return all messages

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult index([FromBody] int forumId)
        {
            return Json(messageRepo.index(forumId));
        }

        //Store a user

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult store([FromBody] MessageModel message)
        {
            int authId = Convert.ToInt32(User.Claims.Single(c => c.Type == "id").Value);
            messageRepo.store(message, authId);
            return StatusCode(200);
        }

        //Show a message

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult show([FromBody] int id)
        {
            return Json(messageRepo.find(id));
        }

        //Update a message

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult update([FromBody] MessageModel message)
        {
            messageRepo.update(message);
            return StatusCode(200);
        }

        //Destroy a message

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult destroy([FromBody] MessageModel message)
        {
          messageRepo.destroy(message.id);
          return StatusCode(200);
        }
    }
}