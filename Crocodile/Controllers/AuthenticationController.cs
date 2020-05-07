using Crocodile.DataBase.UserDB;
using Microsoft.AspNetCore.Mvc;

namespace Crocodile.Controllers
{
    public class AuthenticationController : Controller
    {
        public readonly IUserRepository userRepository;

        public AuthenticationController(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        public IActionResult Login([FromBody]string login, [FromBody]string password)
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

        public IActionResult Register([FromBody]string login, [FromBody]string password, [FromBody]byte[] photo)
        {
            var user = new UserEntity(login, password, photo);
            userRepository.Insert(user);
            return Created(user.Login, user);
        }
    }
}
