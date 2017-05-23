using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Killerapp.Repositories.RForum;
using Proftaak;
using Microsoft.AspNetCore.Authorization;
using Killerapp.Repositories.RMessage;

namespace Killerapp.Controllers.Message
{
    [Route("api/[controller]/[action]")]
    public class MessageController : Controller
    {
        IMessageRepo messageRepo;

        public MessageController()
        {
            messageRepo = new MessageRepo(new Connection());
        }

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult index([FromBody] int forumId)
        {
            return Json(messageRepo.index(forumId));
        }
    }
}