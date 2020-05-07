using System;
using Crocodile.DataBase.GameDB;
using Crocodile.DataBase.UserDB;
using Crocodile.DataBase.WordDB;
using Microsoft.AspNetCore.Mvc;

namespace Crocodile.Controllers
{
    public class CreateGameDTO
    {
        public bool IsOpen { get; set; }
        public int RoundsCount { get; set; }
        public int RoundsTimeInMinuts { get; set; }
        public string CreatorUserLogin { get; set; }
    }

    public class GameDTO
    {
        public Guid GameId { get; set; }
        public string UserLogin { get; set; }
    }

    public class GameController : Controller
    {

        private readonly MongoGameRepository _gameRepository;
        private readonly MongoUserRepository _userRepository;
        private readonly MongoWordRepository _wordRepository;

        public GameController(MongoGameRepository gameRepository, MongoUserRepository userRepository, MongoWordRepository wordRepository)
        {
            _gameRepository = gameRepository;
            _userRepository = userRepository;
            _wordRepository = wordRepository;
        }

        public IActionResult CreateGame([FromBody] CreateGameDTO gameDTO)
        {
            var user = _userRepository.FindByLogin(gameDTO.CreatorUserLogin);
            if (user == null)
            {
                return NotFound(gameDTO.CreatorUserLogin);
            }
            var game = new GameEntity(gameDTO.IsOpen, gameDTO.RoundsCount, user);
            var gameEntity = _gameRepository.Insert(game);
            return Content(gameEntity.Id.ToString());
        }

        public IActionResult JoinToGame([FromBody] GameDTO gameDTO)
        {
            var user = _userRepository.FindByLogin(gameDTO.UserLogin);
            if (user == null)
            {
                return NotFound(gameDTO);
            }
            var game = _gameRepository.FindById(gameDTO.GameId);
            if (game == null)
            {
                return NotFound(gameDTO);
            }
            game.AddUser(user);
            return Ok();
        }
        
        public IActionResult GetWords()
        {
            return Json(_wordRepository.TakeWords().ToArray());
        }

        public IActionResult StartGame([FromBody] Guid gameId)
        {
            var game = _gameRepository.FindById(gameId);
            if (game == null)
            {
                return NotFound(gameId);
            }
            game.StartGame();
            return Ok();
        }

        public IActionResult GetLeaderBoard([FromBody] Guid gameId)
        {
            var game = _gameRepository.FindById(gameId);
            if (game == null)
            {
                return NotFound(gameId);
            }
            return Json(game.Scores);
        }
    }
}
