using System;
using System.Security.Claims;
using Crocodile.DataBase.GameDB;
using Crocodile.DataBase.UserDB;
using Crocodile.DataBase.WordDB;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Crocodile.Controllers
{
    public class CreateGameDTO
    {
        public bool IsOpen { get; set; }
        public int RoundsCount { get; set; }
        public int RoundTime { get; set; }
    }

    public class GameDTO
    {
        public Guid GameId { get; set; }
    }

    public class GameController : Controller
    {

        private readonly MongoGameRepository _gameRepository;
        private readonly MongoWordRepository _wordRepository;

        public GameController(MongoGameRepository gameRepository, MongoWordRepository wordRepository)
        {
            _gameRepository = gameRepository;
            _wordRepository = wordRepository;
        }
        

        public IActionResult Create([FromBody] CreateGameDTO gameDto)
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            var game = new GameEntity(gameDto.IsOpen, gameDto.RoundsCount, gameDto.RoundTime, HttpContext.User.Identity.Name);
            var gameEntity = _gameRepository.Insert(game);
            return Content(gameEntity.GameId.ToString());
        }

        public IActionResult Join([FromBody] GameDTO gameDto)
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            var game = _gameRepository.FindById(gameDto.GameId);
            if (game == null)
            {
                return NotFound(gameDto);
            }
            if (!game.Players.Contains(HttpContext.User.Identity.Name))
            {
                game.AddUser(HttpContext.User.Identity.Name);
            }
            return Ok();
        }
        
        public IActionResult GetWords()
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            return Json(_wordRepository.TakeWords().ToArray());
        }

        public IActionResult StartGame([FromBody] GameDTO gameDto)
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            var game = _gameRepository.FindById(gameDto.GameId);
            if (game == null)
            {
                return NotFound(gameDto.GameId);
            }
            game.StartGame();
            return Ok();
        }

        public IActionResult GetLeaderBoard([FromBody] GameDTO gameDto)
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            var game = _gameRepository.FindById(gameDto.GameId);
            if (game == null)
            {
                return NotFound(gameDto.GameId);
            }
            return Json(game.Scores);
        }
    }
}
