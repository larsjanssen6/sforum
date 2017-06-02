using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Killerapp.Repositories.RForum;
using Proftaak;
using Microsoft.AspNetCore.Authorization;
using Killerapp.Repositories.RReaction;

namespace Killerapp.Controllers.Message
{
    [Route("api/[controller]/[action]")]
    public class ReactionController : Controller
    {
        IReactionRepo reactionRepo;

        //Init constructor

        public ReactionController()
        {
            reactionRepo = new ReactionRepo(new Connection());
        }

        //Store a reaction

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult store([FromBody] ReactionModel reaction)
        {
            int authId = Convert.ToInt32(User.Claims.Single(c => c.Type == "id").Value);
            int id = reactionRepo.store(reaction, authId);
            return Json(reactionRepo.find(id));
        }

        //Update a reaction

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult update([FromBody] ReactionModel reaction)
        {
            reactionRepo.update(reaction);
            return StatusCode(200);
        }

        //Destroy a reaction

        [HttpPost]
        [Authorize(Roles = "user")]
        public IActionResult destroy([FromBody] ReactionModel reaction)
        {
            reactionRepo.destroy(reaction.id);
            return StatusCode(200);
        }
    }
}