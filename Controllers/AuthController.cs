using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using Proftaak;
using Proftaak.Repositories.UserRepo;
using Newtonsoft.Json;
using Killerapp.Repositories.User;

namespace AureliaTest.Controllers
{
    public class AccessToken
    {
        public string access_token { get; set; }
    }

    public class UserCredentials
    {
        public string username { get; set; }
        public string password { get; set; }
    }

    public class OpenIdToken
    {
        public string clientId { get; set; }
        public string redirectUri { get; set; }
        public string state { get; set; }
        public string code { get; set; }
        public string authuser { get; set; }
        public string session_state { get; set; }
        public string prompt { get; set; }
        public string consent { get; set; }
    }

    [Route("api/[controller]/[action]")]
    public class AuthController : Controller
    {

        IUserRepo userRepo;

        public AuthController()
        {
            userRepo = new UserRepo(new Connection());
        }

        [HttpPost]
        public AccessToken Login([FromBody] dynamic credentials)
        {
            string email = credentials.email;
            string password = credentials.password;

            if (!userRepo.login(email,password)) throw new UnauthorizedAccessException();
            UserModel user = userRepo.find(email);


            return CreateAccessToken(user.id.ToString(), user.email, user.name, user.corporation_id.ToString(), new[] { "user" });
        }
   

        private static AccessToken CreateAccessToken(string id, 
                                                     string email, 
                                                     string name,
                                                     string corporation_id,
                                                     string[] roles)
        {
            var claims = new List<Claim>();

            foreach (string role in roles)
            {
                claims.Add(new Claim("roles", role));
            }

            claims.Add(new Claim("id", id));
            claims.Add(new Claim("email", email));
            claims.Add(new Claim("name", name));
            claims.Add(new Claim("corporation_id", corporation_id));



      var signing = new SigningCredentials(new SymmetricSecurityKey(new byte[32]), SecurityAlgorithms.HmacSha256);

            var jwt = new JwtSecurityToken(
              issuer: "theIssuer",
              audience: "theAudience",
              claims: claims,
              notBefore: DateTime.UtcNow,
              expires: DateTime.UtcNow + TimeSpan.FromHours(24),
              signingCredentials: signing);


            string encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
            return new AccessToken { access_token = encodedJwt };
        }
    }
}
