using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Crocodile.DataBase.UserDB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace Crocodile.Controllers
{
#pragma warning disable 1591
    public class UserDTO
    {
        [Required]
        public string Login { get; set; }
        [AllowNull]
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
        [HttpGet("authentication/login")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), 404)]
        public IActionResult Login([FromBody] UserDTO userDto)
        {
            var user = userRepository.FindByLogin(userDto.Login);
            if (user == null)
            {
                return NotFound(userDto.Login);
            }
            
            if (user.Password.CompareTo(userDto.Password) != 0)
            {
                return NotFound(userDto.Password);
            }
            return Ok(userDto.Login);
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
        public IActionResult Register([FromBody]UserDTO userDto)
        {
            var user = userRepository.FindByLogin(userDto.Login);
            if (user != null)
            {
                return BadRequest();
            }
            user = new UserEntity(userDto.Login,userDto.Password);
            userRepository.Insert(user);
            return Created(user.Login, user);
        }
    }
#pragma warning restore 1591
}