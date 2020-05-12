using System.ComponentModel.DataAnnotations;
using Crocodile.DataBase.UserDB;
using Microsoft.AspNetCore.Mvc;


namespace Crocodile.Controllers
{
    public class UserDTO
    {
        [Required]
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

        [HttpGet("authentication/login")]
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
        
        [HttpPost("authentication/register")]
        public IActionResult Register([FromBody] UserDTO userDto)
        {
            var user = userRepository.FindByLogin(userDto.Login);
            if (user != null)
            {
                //TODO: Поменять код ошибки
                return NotFound(userDto.Login);
            }
            user = new UserEntity(userDto.Login, userDto.Password);
            userRepository.Insert(user);
            return Created(user.Login, user);
        }
    }
}