using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Killerapp.Repositories.RForum;
using Proftaak;
using Microsoft.AspNetCore.Authorization;

namespace Killerapp.Controllers.Forum
{
      [Route("api/[controller]/[action]")]
      public class ForumController : Controller
      {
          IForumRepo forumRepo;

          public ForumController()
          {
              forumRepo = new ForumRepo(new Connection());              
          }

          [HttpPost]
          [Authorize(Roles = "user")]
          public JsonResult index()
          {
              return Json(forumRepo.index());
          }

          [HttpPost]
          [Authorize(Roles = "user")]
          public JsonResult show([FromBody] int id)
          {
              return Json(forumRepo.find(id));
          }

          [HttpPost]
          [Authorize(Roles = "user")]
          public IActionResult store([FromBody] ForumModel forum)
          {
              forumRepo.store(forum);
              return StatusCode(200);
          }

          [HttpPost]
          [Authorize(Roles = "user")]
          public IActionResult update([FromBody] ForumModel forum)
          {
            forumRepo.update(forum);
            return StatusCode(200);
          }

          [HttpPost]
          [Authorize(Roles = "user")]
          public IActionResult destroy([FromBody] ForumModel forum)
          {
              ForumModel model = forum;
              forumRepo.destroy(forum.id);
              return StatusCode(200);
          }
      }
}