using System;
using Crocodile.DataBase.GameDB;
using Crocodile.DataBase.UserDB;
using Crocodile.DataBase.WordDB;
using Microsoft.AspNetCore.Mvc;

namespace Crocodile.Controllers
{
    public class GameController : Controller
    {
        private readonly IGameRepository _gameRepository;
        private readonly IUserRepository _userRepository;
        private readonly IWordRepository _wordRepository;

        public GameController(IGameRepository gameRepository, IUserRepository userRepository, IWordRepository wordRepository)
        {
            _gameRepository = gameRepository;
            _userRepository = userRepository;
            _wordRepository = wordRepository;
        }

        public IActionResult CreateGame([FromBody]bool isOpen, [FromBody]int maxRounds, [FromBody]string userLogin)
        {
            var user = _userRepository.FindByLogin(userLogin);
            if (user == null)
            {
                return NotFound(userLogin);
            }
            var game = new GameEntity(isOpen, maxRounds, user);
            var gameEntity = _gameRepository.Insert(game);
            return Content(gameEntity.Id.ToString());
        }

        public IActionResult JoinToGame([FromBody]string gameId, [FromBody]string userLogin)
        {
            var user = _userRepository.FindByLogin(userLogin);
            if (user == null)
            {
                return NotFound(userLogin);
            }
            var game = _gameRepository.FindById(Guid.Parse(gameId));
            if (game == null)
            {
                return NotFound(gameId);
            }
            game.AddUser(user);
            return Ok();
        }
        
        public IActionResult GetWords()
        {
            return Json(_wordRepository.TakeWords().ToArray());
        }

        public IActionResult StartGame([FromBody]string gameId)
        {
            var game = _gameRepository.FindById(Guid.Parse(gameId));
            if (game == null)
            {
                return NotFound(gameId);
            }
            game.StartGame();
            return Ok();
        }

        public IActionResult GetLeaderBoard([FromBody]string gameId)
        {
            var game = _gameRepository.FindById(Guid.Parse(gameId));
            if (game == null)
            {
                return NotFound(gameId);
            }
            return Json(game.Scores);
        }
    }
}
