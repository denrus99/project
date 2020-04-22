using System;
using Microsoft.AspNetCore.Mvc;

namespace Crocodile.Controllers
{
    public class ChatController : Controller
    {
        public ChatController()
        {

        }

        public IActionResult SendMessage()
        {
            throw new Exception();
        }

        public IActionResult SendReaction()
        {
            throw new Exception();
        }
    }
}
