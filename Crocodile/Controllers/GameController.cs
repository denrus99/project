using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Crocodile.DataBase;
using Crocodile.DataBase.GameDB;
using Crocodile.DataBase.UserDB;
using Crocodile.DataBase.WordDB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Crocodile.Controllers
{
    public class CreateGameDTO
    {
#pragma warning disable 1591
        [Required]
        public bool IsOpen { get; set; }
        [Required]
        public int RoundsCount { get; set; }
        [Required]
        public int RoundTime { get; set; }
        public string CreatorUserLogin { get; set; }

    }

    public class GameDTO
    {
        public Guid GameId { get; set; }
        public string UserLogin { get; set; }
    }
    
    public class UpdateGameDTO
    {
        public Guid GameId { get; set; }
        public List<Score> Scores { get; set; }
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
        
        /// <summary>
        /// Add new game
        /// </summary>
        /// <returns>A newly created Game</returns>
        /// <response code="200">Returns the newly created Game</response>
        /// <response code="404">If the user doesn't exist</response>
        [ProducesResponseType(typeof(string), 201)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpPost("game/create")]
        [Produces("application/json")]
        public IActionResult Create([FromBody] CreateGameDTO gameDto)
        {
            var user = _userRepository.FindByLogin(gameDto.CreatorUserLogin);
            if (user == null)
            {
                return NotFound(gameDto.CreatorUserLogin);
            }
            var game = new GameEntity(gameDto.IsOpen, gameDto.RoundsCount, gameDto.RoundTime, user.Login);
            _gameRepository.Insert(game);
            return Created(game.GameId.ToString(), game);
        }
        
        /// <summary>
        /// Join User to Game
        /// </summary>
        /// <returns>A newly created Game</returns>
        /// <response code="200">Returns the newly created Game</response>
        /// <response code="404">If the User or Game  doesn't exist</response>
        /// <response code="400">If the User already in Game</response>
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPost("game/join")]
        [Produces("application/json")]
        public IActionResult Join([FromBody] GameDTO gameDto)
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
                return BadRequest(gameDto.UserLogin);
            }
            game.AddUser(user.Login);
            _gameRepository.UpdateGame(game);
            return Ok();
        }
        
        /// <summary>
        /// Get Words for Game
        /// </summary>
        /// <returns>An array of Words</returns>
        /// <response code="200">Returns the newly created array of Words</response>
        [ProducesResponseType(typeof(List<string>), 200)]
        [HttpGet("game/words")]
        [Produces("application/json")]
        public IActionResult Words()
        {
            return Json(_wordRepository.TakeWords().ToArray());
        }
        
        /// <summary>
        /// Change Game's state
        /// </summary>
        /// <returns>An array of Words</returns>
        /// <response code="200"></response>
        /// <response code="404">If the Game is doesn't exist</response>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), 404)]
        [HttpPatch("game/start")]
        [Produces("application/json")]
        public IActionResult Start([FromBody] GameDTO gameDto)
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

        /// <summary>
        /// Get Scores of current Game
        /// </summary>
        /// <returns>An array of Words</returns>
        /// <response code="200">Returns array of Scores</response>
        /// <response code="404">If the Game is doesn't exist</response>
        [ProducesResponseType(typeof(List<string>), 200)]
        [ProducesResponseType(typeof(string), 404)]
        [HttpPost("game/leaderBoard")]
        [Produces("application/json")]
        public IActionResult LeaderBoard([FromBody] GameDTO gameDto)
        {
            var game = _gameRepository.FindById(gameDto.GameId);
            if (game == null)
            {
                return NotFound(gameDto.GameId);
            }
            return Json(game.Scores);
        }

        /// <summary>
        /// Update Game every round
        /// </summary>
        /// <response code="200"></response>
        /// <response code="404">If the Game is doesn't exist</response>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), 404)]
        [HttpPost("game/update")]
        [Produces("application/json")]
        public IActionResult Update([FromBody] UpdateGameDTO gameDto)
        {
            var game = _gameRepository.FindById(gameDto.GameId);
            if (game == null)
            {
                return NotFound(gameDto.GameId);
            }
            game.UpdateScore(gameDto.Scores);
            game.ChangePresenter();
            game.PlusRound();
            _gameRepository.UpdateGame(game);
            return Ok();
        }
        
        /// <summary>
        /// Update Users at the end of the Game
        /// </summary>
        /// <response code="200"></response>
        /// <response code="404">If the Game is doesn't exist</response>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), 404)]
        [HttpPatch("game/end")]
        [Produces("application/json")]
        public IActionResult End([FromBody] GameDTO gameDto)
        {
            var game = _gameRepository.FindById(gameDto.GameId);
            if (game == null)
            {
                return NotFound(gameDto.GameId);
            }
            for (int i = 0; i < game.Players.Count; i++)
            {
                var user = _userRepository.FindByLogin(game.Players[i]);
                if (user != null)
                {
                    user.Guessed += game.Scores[i].Guessed;
                    user.AlmostGuessed += game.Scores[i].AlmostGuessed;
                    user.PlusGame();
                    if (user.Record < game.Scores[i].Record)
                    {
                        user.Record = game.Scores[i].Record;
                    }
                    _userRepository.UpdateUser(user);
                }
            }
            game.Status = Status.Ended;
            return Ok();
        }

        /// <summary>
        /// Update Users at the end of the Game
        /// </summary>
        /// <response code="200"></response>
        /// <response code="404">If the Game is doesn't exist</response>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), 404)]
        [HttpGet("game/opened")]
        [Produces("application/json")]
        
        
        public IActionResult Opened()
        {
            //TODO: Вернуть открытые игры
            return Ok();
        }
    }
#pragma warning restore 1591
}
