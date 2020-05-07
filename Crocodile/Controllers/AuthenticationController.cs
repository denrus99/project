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

        public IActionResult Login(string login, string password)
        {
            var user = userRepository.FindByLogin(login);
            if (user == null)
            {
                return NotFound(login);
            }
            if (user.Password.CompareTo(password) != 0)
            {
                return NotFound();
            }
            return Ok(login);
        }

        public IActionResult Register(string login, string password, byte[] photo)
        {
            var user = new UserEntity(login, password, photo);
            userRepository.Insert(user);
            return NoContent();
        }
    }
}
