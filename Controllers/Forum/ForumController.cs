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
          LogErrors errors;

          //Init constructor
          public ForumController()
          {
              forumRepo = new ForumRepo(new Connection());
              errors = new LogErrors();
          }

          //Return all forums

          [HttpPost]
          [Authorize(Roles = "user")]
          public JsonResult index()
          {
              try
              {
                  return Json(forumRepo.index());
              }

              catch (Exception ex)
              {
                  errors.log(ex);
                  return Json(null);
              }
          }

          //Return one forum

          [HttpPost]
          [Authorize(Roles = "user")]
          public JsonResult show([FromBody] int id)
          {
              try
              {
                  return Json(forumRepo.find(id));
              }

              catch (Exception ex)
              {
                  errors.log(ex);
                  return Json(null);
              }
          }

          //Store a forum

          [HttpPost]
          [Authorize(Roles = "user")]
          public IActionResult store([FromBody] ForumModel forum)
          {
              try
              {
                  forumRepo.store(forum);
                  return StatusCode(200);
              }

              catch (Exception ex)
              {
                  errors.log(ex);
                  return Json(null);
              }           
          }

          //Update a forum

          [HttpPost]
          [Authorize(Roles = "user")]
          public IActionResult update([FromBody] ForumModel forum)
          {
              try
              {
                  forumRepo.update(forum);
                  return StatusCode(200);
              }

              catch (Exception ex)
              {
                  errors.log(ex);
                  return Json(null);
              }            
          }

          //Destroy a forum

          [HttpPost]
          [Authorize(Roles = "user")]
          public IActionResult destroy([FromBody] ForumModel forum)
          {
              try
              {
                  ForumModel model = forum;
                  forumRepo.destroy(forum.id);
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