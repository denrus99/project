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
        public int RoundTime { get; set; }
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
            var game = new GameEntity(gameDto.IsOpen, gameDto.RoundsCount, gameDto.RoundTime, user.Login);
            var gameEntity = _gameRepository.Insert(game);
            return Content(gameEntity.GameId.ToString());
        }

        public IActionResult JoinToGame(GameDTO gameDto)
        {
            var user = _userRepository.FindByLogin(gameDto.UserLogin);
            if (user == null)
            {
                return NotFound(gameDto.UserLogin);
            }
            var game = _gameRepository.FindById(gameDto.GameId);
            if (game == null)
            {
                return NotFound(gameDto.GameId);
            }

            if (game.Players.Contains(gameDto.UserLogin))
            {
                return NotFound(gameDto.UserLogin);
            }
            game.AddUser(user.Login);
            _gameRepository.UpdateGame(game);
            return Ok();
        }
        
        public IActionResult GetWords()
        {
            return Json(_wordRepository.TakeWords().ToArray());
        }

        public IActionResult StartGame(GameDTO gameDto)
        {
            var game = _gameRepository.FindById(gameDto.GameId);
            if (game == null)
            {
                return NotFound(gameDto.GameId);
            }
            game.StartGame();
            _gameRepository.UpdateGame(game);
            return Ok();
        }

        public IActionResult GetLeaderBoard(GameDTO gameDto)
        {
            var game = _gameRepository.FindById(gameDto.GameId);
            if (game == null)
            {
                return NotFound(gameDto.GameId);
            }
            return Json(game.Scores);
        }
    }
}
