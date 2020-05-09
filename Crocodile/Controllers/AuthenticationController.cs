﻿using Crocodile.DataBase.UserDB;
using Microsoft.AspNetCore.Mvc;


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
        public IActionResult Login(UserDTO request)
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
        public IActionResult Register(UserDTO userDto)
        {
            var user = new UserEntity(userDto.Login, userDto.Password);
            userRepository.Insert(user);
            return Created(user.Login, user);
        }
    }
}