using Crocodile.DataBase.UserDB;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Net.Http;

namespace Crocodile.Controllers
{
    public class UserDTO
    {
        public string Login { get; set; }
        public string Password { get; set; }
    }

    public class AuthenticationController : Controller
    {
        public readonly MongoUserRepository userRepository;

        public AuthenticationController(MongoUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        [HttpPost]
        public IActionResult Login([FromBody] UserDTO request)
        {
            var user = userRepository.FindByLogin(request.Login);
            if (user == null)
            {
                return NotFound(request.Login);
            }

            if (user.Password.CompareTo(request.Password) != 0)
            {
                return NotFound(request.Password);
            }
            
            return Ok(request.Login);
        }


        [HttpPost]
        public IActionResult Register(string login, string password)
        {
            var user = new UserEntity(login, password);
            userRepository.Insert(user);
            return Created(user.Login, user);
        }
    }
}