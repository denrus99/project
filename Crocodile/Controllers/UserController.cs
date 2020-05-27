using Crocodile.DataBase.UserDB;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Crocodile.Controllers
{
    public class UserProfileDTO
    {
        public string Login { get; set; }
        public byte[] Photo { get; set; }
        public int CountGames { get; set; }
        public int Record { get; set; }
        public int Guessed { get; set; }
        public int AlmostGuessed { get; set; }
    }

    public class UserController : Controller
    {
        private readonly MongoUserRepository _userRepository;

        public UserController(MongoUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet("user/profile/{login}")]
        public IActionResult Profile([FromRoute] string login)
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            var user = _userRepository.FindByLogin(login);
            if (user == null)
            {
                return NotFound();
            }
            var profile = new UserProfileDTO
            {
                Login = user.Login,
                Photo = user.Photo,
                CountGames = user.CountGames,
                Record = user.Record,
                Guessed = user.Guessed,
                AlmostGuessed = user.AlmostGuessed
            };
            return Json(profile);
        }
    }
}
