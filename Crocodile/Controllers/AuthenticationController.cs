using System;
using Microsoft.AspNetCore.Mvc;

namespace Crocodile.Controllers
{
    public class AuthenticationController : Controller
    {
        public AuthenticationController()
        {

        }

        public IActionResult Login()
        {
            return Content("Hello");
        }

        public IActionResult Register()
        {
            throw new Exception();
        }
    }
}
