using Crocodile.DataBase.UserDB;
using Microsoft.AspNetCore.Mvc;

namespace Crocodile.Controllers
{
    public class AuthenticationController : Controller
    {
        public readonly MongoUserRepository userRepository;

        public AuthenticationController(MongoUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        [HttpPost]
        [Produces("application/json")]
        public IActionResult Login( [FromBody] string login, [FromBody] string password)
        {
            var user = userRepository.FindByLogin(login);
            if (user == null)
            {
                return NotFound(login);
            }

            if (user.Password.CompareTo(password) != 0)
            {
                return NotFound(password);
            }
            
            return Ok(login);
        }


        [HttpPost]
        public IActionResult Register( string login, string password, byte[] photo)
        {
            var user = new UserEntity(login, password, photo);
            userRepository.Insert(user);
            return Created(user.Login, user);
        }
    }
}