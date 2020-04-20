using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineActivity.Controllers
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
