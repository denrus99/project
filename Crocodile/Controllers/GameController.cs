﻿using System;
using Crocodile.DataBase.GameDB;
using Crocodile.DataBase.UserDB;
using Crocodile.DataBase.WordDB;
using Microsoft.AspNetCore.Mvc;

namespace Crocodile.Controllers
{
    public class GameController : Controller
    {
        private readonly IGameRepository gameRepository;
        private readonly IUserRepository userRepository;
        private readonly IWordRepository wordRepository;

        public GameController(IGameRepository gameRepository, IUserRepository userRepository)
        {
            this.gameRepository = gameRepository;
            this.userRepository = userRepository;
        }

        public IActionResult CreateGame(bool isOpen, int maxRounds, string userLogin)
        {
            var user = userRepository.FindByLogin(userLogin);
            if (user == null)
            {
                return NotFound(userLogin);
            }
            var game = new GameEntity(isOpen, maxRounds, user);
            var gameEntity = gameRepository.Insert(game);
            return Content(gameEntity.Id.ToString());
        }

        public IActionResult JoinToGame(string gameId, string userLogin)
        {
            var user = userRepository.FindByLogin(userLogin);
            if (user == null)
            {
                return NotFound(userLogin);
            }
            var game = gameRepository.FindById(new Guid(gameId));
            game.AddUser(user);
            return Ok();
        }

        public IActionResult JoinToOpenGame(string userLogin)
        {
            var user = userRepository.FindByLogin(userLogin);
            if (user == null)
            {
                return NotFound(userLogin);
            }
            var games = gameRepository.GetOpenGames();
            if (games.Count == 0)
            {
                return NotFound("Нет открытых игр!");
            }
            var rnd = new Random();
            var game = games[rnd.Next(0, games.Count + 1)];
            game.AddUser(user);
            return Content(game.Id.ToString());
        }

        public IActionResult GetWords()
        {
            return Json(wordRepository.TakeWords().ToArray());
        }

        public IActionResult StartGame(Guid id)
        {
            var game = gameRepository.FindById(new Guid());
            game.StartGame();
            return Ok();
        }

        public IActionResult GetLeaderBoard(string gameId)
        {
            var game = gameRepository.FindById(new Guid(gameId));
            return Json(game.Scores);
        }
    }
}
