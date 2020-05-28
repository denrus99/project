using System;
using Crocodile.DataBase.GameDB;
using Crocodile.DataBase.UserDB;
using Crocodile.DataBase.WordDB;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Crocodile.DataBase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

#pragma warning disable 1591
namespace Crocodile.Controllers
{
    public class CreateGameDTO
    {

        [Required]
        public bool IsOpen { get; set; }
        [Required]
        public int RoundsCount { get; set; }
        [Required]
        public int RoundTime { get; set; }
    }

    public class GameDTO
    {
        public Guid GameId { get; set; }
    }
    
    public class UpdateGameDTO
    {
        public Guid GameId { get; set; }
        public string LoginMaster { get; set; }
        public string LoginGuessed { get; set; }
    }
    
    public class UpdateGameSingleUserDTO
    {
        public Guid GameId { get; set; }
        public string Login { get; set; }
    }

    public class GameController : Controller
    {

        private readonly MongoGameRepository _gameRepository;
        private readonly MongoWordRepository _wordRepository;
        private readonly MongoUserRepository _userRepository;

        public GameController(MongoGameRepository gameRepository, MongoWordRepository wordRepository, MongoUserRepository userRepository)
        {
            _gameRepository = gameRepository;
            _wordRepository = wordRepository;
            _userRepository = userRepository;
        }
        
        /// <summary>
        /// Add new game
        /// </summary>
        /// <returns>A newly created Game</returns>
        /// <response code="200">Returns the newly created Game</response>
        /// <response code="403">If the User is not authorized.</response>
        [ProducesResponseType(typeof(string), 201)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpPost("game/create")]
        [Produces("application/json")]
        public IActionResult Create([FromBody] CreateGameDTO gameDto)
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            var game = new GameEntity(gameDto.IsOpen, gameDto.RoundsCount, gameDto.RoundTime, HttpContext.User.Identity.Name);
            _gameRepository.Insert(game);
            return Created(game.GameId.ToString(), game);
        }
        
        /// <summary>
        /// Join User to Game
        /// </summary>
        /// <returns>A newly created Game</returns>
        /// <response code="200">Returns the newly created Game</response>
        /// <response code="404">If the Game  doesn't exist</response>
        /// <response code="401">If the User is not authorized.</response>
        /// <response code="400">If the User already in Game</response>
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpPost("game/join")]
        [Produces("application/json")]
        public IActionResult Join([FromBody] GameDTO gameDto)
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

            if (game.Players.Contains(HttpContext.User.Identity.Name))
            {
                return Ok(game);
            }
            game.AddUser(HttpContext.User.Identity.Name);
            _gameRepository.UpdateGame(game);
            return Ok(game);
        }
        
        /// <summary>
        /// Get Words for Game
        /// </summary>
        /// <returns>An array of Words</returns>
        /// <response code="200">Returns the newly created array of Words</response>
        /// <response code="403">If the User is not authorized.</response>
        [ProducesResponseType(typeof(List<string>), 200)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpGet("game/words")]
        [Produces("application/json")]
        public IActionResult Words()
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            return Json(_wordRepository.TakeWords().ToArray());
        }
        
        /// <summary>
        /// Change Game's state
        /// </summary>
        /// <returns>An array of Words</returns>
        /// <response code="200"></response>
        /// <response code="403">If the User is not authorized.</response>
        /// <response code="404">If the Game is doesn't exist</response>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), 404)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpPost("game/start")]
        [Produces("application/json")]
        public IActionResult Start([FromBody] GameDTO gameDto)
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
            _gameRepository.UpdateGame(game);
            return Ok();
        }

        /// <summary>
        /// Get Scores of current Game
        /// </summary>
        /// <returns>An array of Words</returns>
        /// <response code="200">Returns array of Scores</response>
        /// <response code="403">If the User is not authorized.</response>
        /// <response code="404">If the Game is doesn't exist</response>
        [ProducesResponseType(typeof(List<string>), 200)]
        [ProducesResponseType(typeof(string), 404)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpPost("game/leaderBoard")]
        [Produces("application/json")]
        public IActionResult LeaderBoard([FromBody] GameDTO gameDto)
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

        /// <summary>
        /// Update Game every round
        /// </summary>
        /// <response code="200"></response>
        /// <response code="403">If the User is not authorized.</response>
        /// <response code="404">If the Game is doesn't exist</response>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), 404)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpPost("game/update")]
        [Produces("application/json")]
        public IActionResult Update([FromBody] UpdateGameDTO gameDto)
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
            var sc1 = game.Scores.First(x => x.Login == gameDto.LoginMaster);
            var sc2 = game.Scores.First(x => x.Login == gameDto.LoginGuessed);
            
            sc1.Guessed++;
            sc1.CalculateRecord();
            sc2.Guessed++;
            sc2.CalculateRecord();
            game.ChangePresenter();
            game.PlusRound();
            _gameRepository.UpdateGame(game);
            return Ok(game.Players[game.IndexPresenter]);
        }
        
        /// <summary>
        /// Update Game every round
        /// </summary>
        /// <response code="200"></response>
        /// <response code="403">If the User is not authorized.</response>
        /// <response code="404">If the Game is doesn't exist</response>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), 404)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpPost("game/updateSingleUser")]
        [Produces("application/json")]
        public IActionResult UpdateSingleUser([FromBody] UpdateGameSingleUserDTO gameDto)
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
            var sc = game.Scores.First(x => x.Login == gameDto.Login);
            sc.AlmostGuessed++;
            sc.CalculateRecord();
            _gameRepository.UpdateGame(game);
            return Ok();
        }
        
        /// <summary>
        /// Update Users at the end of the Game
        /// </summary>
        /// <response code="200"></response>
        /// <response code="403">If the User is not authorized.</response>
        /// <response code="404">If the Game is doesn't exist</response>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), 404)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpPatch("game/end")]
        [Produces("application/json")]
        public IActionResult End([FromBody] GameDTO gameDto)
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
            //game.Status = Status.Ended;
            return Ok();
        }

        /// <summary>
        /// Update Users at the end of the Game
        /// </summary>
        /// <response code="200"></response>
        /// <response code="403">If the User is not authorized.</response>
        /// <response code="404">If the Game is doesn't exist</response>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), 404)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [HttpGet("game/opened")]
        [Produces("application/json")]
        public IActionResult Opened()
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            //TODO: Вернуть открытые игры
            return Ok();
        }

        [HttpGet]
        public IActionResult Lobby(int page)
        {
            var games = _gameRepository.GetOpenGames().Select(game => game.GameId).Skip(page * 10).Take(10).ToArray();
            return Json(games);
        }
    }
#pragma warning restore 1591
}