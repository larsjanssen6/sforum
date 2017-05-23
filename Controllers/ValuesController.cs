using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Proftaak.Controllers
{
       [Route("api/[controller]/[action]")]
       public class ValuesController : Controller
       {
        private static readonly List<string> values = new List<string>(new[] { "value1", "value2" });

        [HttpPost]
        [Authorize(Roles = "user")]
        public IEnumerable<string> Values()
        {
          return values;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        [Authorize(Roles = "user")]
        public JsonResult Get(int id)
        {
          return Json("value");
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
