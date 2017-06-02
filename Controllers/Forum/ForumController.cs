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

          //Init constructor
          public ForumController()
          {
              forumRepo = new ForumRepo(new Connection());              
          }

          //Return all forums

          [HttpPost]
          [Authorize(Roles = "user")]
          public JsonResult index()
          {
              return Json(forumRepo.index());
          }

          //Return one forum

          [HttpPost]
          [Authorize(Roles = "user")]
          public JsonResult show([FromBody] int id)
          {
              return Json(forumRepo.find(id));
          }

          //Store a forum

          [HttpPost]
          [Authorize(Roles = "user")]
          public IActionResult store([FromBody] ForumModel forum)
          {
              forumRepo.store(forum);
              return StatusCode(200);
          }

          //Update a forum

          [HttpPost]
          [Authorize(Roles = "user")]
          public IActionResult update([FromBody] ForumModel forum)
          {
              forumRepo.update(forum);
              return StatusCode(200);
          }

          //Destroy a forum

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