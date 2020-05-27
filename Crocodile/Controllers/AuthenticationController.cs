using Crocodile.DataBase.UserDB;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Crocodile.Controllers
{
#pragma warning disable 1591
    public class UserDTO
    {
        [Required(ErrorMessage = "Не указан login")]
        public string Login { get; set; }
        [Required(ErrorMessage = "Не указан пароль")]
        public string Password { get; set; }
    }

    public class AuthenticationController : Controller
    {
        private readonly MongoUserRepository userRepository;


        public AuthenticationController(MongoUserRepository userRepository)

        {
            this.userRepository = userRepository;
        }

        /// <summary>
        /// Get existing User
        /// </summary>
        /// <returns>A newly created User</returns>
        /// <response code="200">Returns User's Login </response>
        /// <response code="404">If the User's Login not found or Password does not match Login</response>
        [HttpPost("authentication/login")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), 404)]
        public async Task<IActionResult> Login([FromBody] UserDTO userDTO)
        {
            var user = userRepository.FindByLogin(userDTO.Login);
            if (user == null)
            {
                return NotFound(userDTO.Login);
            }
            if (user.Password.CompareTo(DecodePassword(userDTO.Password)) != 0)
            {
                return NotFound(userDTO.Password);
            }
            await Authenticate(userDTO.Login);
            return Ok(userDTO.Login);
        }


        /// <summary>
        /// Add new User
        /// </summary>
        /// <returns>A newly created User</returns>
        /// <response code="201">Returns the newly created User</response>
        /// <response code="400">If the User with current Login is already exist</response>
        [HttpPost("authentication/register")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(UserEntity), 201)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] UserDTO userDto)
        {
            var user = userRepository.FindByLogin(userDto.Login);
            if (user != null)
            {
                return BadRequest();
            }
            user = new UserEntity(userDto.Login, DecodePassword(userDto.Password));
            userRepository.Insert(user);
            await Authenticate(userDto.Login);
            return Created(user.Login, userDto);
        }

        [HttpGet]
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

        private string DecodePassword(string codedPassword)
        {
            byte[] data = Convert.FromBase64String(codedPassword);
            return Encoding.ASCII.GetString(data);
        }
    }
#pragma warning restore 1591
}