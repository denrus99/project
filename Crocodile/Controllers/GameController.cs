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
        public int RoundsTimeInMinutes { get; set; }
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
        
        public IActionResult CreateGame(CreateGameDTO gameDto)
        {
            var user = _userRepository.FindByLogin(gameDto.CreatorUserLogin);
            if (user == null)
            {
                return NotFound(gameDto.CreatorUserLogin);
            }
            var game = new GameEntity(gameDto.IsOpen, gameDto.RoundsCount, gameDto.RoundsTimeInMinutes, user.Login);
            var gameEntity = _gameRepository.Insert(game);
            return Content(gameEntity.GameId.ToString());
        }

        public IActionResult JoinToGame(GameDTO gameDto)
        {
            var user = _userRepository.FindByLogin(gameDto.UserLogin);
            if (user == null)
            {
                return NotFound(gameDto);
            }
            var game = _gameRepository.FindById(gameDto.GameId);
            if (game == null)
            {
                return NotFound(gameDto);
            }
            game.AddUser(user.Login);
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
