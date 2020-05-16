using Crocodile.DataBase.UserDB;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Crocodile.Controllers
{
    public class UserDTO
    {
        [Required(ErrorMessage = "Не указан login")]
        public string Login { get; set; }
        [Required(ErrorMessage = "Не указан пароль")]
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
        public async Task<IActionResult> Login([FromBody] UserDTO userDTO)
        {
            var user = userRepository.FindByLogin(userDTO.Login);
            if (user == null)
            {
                return NotFound(userDTO.Login);
            }
            if (user.Password.CompareTo(userDTO.Password) != 0)
            {
                return NotFound(userDTO.Password);
            }
            await Authenticate(userDTO.Login);
            return Ok(userDTO.Login);
        }


        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserDTO userDto)
        {
            var user = new UserEntity(userDto.Login, userDto.Password);
            userRepository.Insert(user);
            await Authenticate(userDto.Login);
            return Created(user.Login, user.Login);
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }

        private async Task Authenticate(string userName)
        {
            // создаем один claim
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, userName)
            };
            // создаем объект ClaimsIdentity
            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            // установка аутентификационных куки
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
        }
    }
}