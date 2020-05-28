using System;
using System.Collections.Generic;
using MongoDB.Bson.Serialization.Attributes;

namespace Crocodile.DataBase.GameDB
{
    [BsonIgnoreExtraElements]
    public class GameEntity
    {
        [BsonId] public Guid GameId { get; set; }
        [BsonElement] public bool IsOpen { get; set; }
        [BsonElement] public int MaxRounds { get; set; }
        [BsonElement] public int TimeRound { get; set; }
        [BsonElement] public List<string> Players { get; set; }
        [BsonElement] public int IndexPresenter { get; set; }

        [BsonElement] public string StartUserName { get; set; }
        [BsonElement] public int CurrentRound { get; set; }
        [BsonElement] public List<Score> Scores { get; set; }
        [BsonIgnore] private Random rnd;
        [BsonElement] public Status Status { get; set; }

        [BsonConstructor]
        public GameEntity(bool isOpen, int maxRounds, int timeRound, string startUserName)
        {
            rnd = new Random();
            GameId = Guid.NewGuid();
            IsOpen = isOpen;
            MaxRounds = maxRounds;
            TimeRound = timeRound;
            IndexPresenter = 0;
            Players = new List<string> {startUserName};
            StartUserName = startUserName;
            Scores = new List<Score> {new Score(startUserName)};
            Status = Status.Waiting;
            CurrentRound = 0;
        }
        //TODO: Login не добавляется в массив игроков привязанный к игре в самой базе
        public void AddUser(string login)
        {
            Players.Add(login);
            Scores.Add(new Score(login));
        }

        public void ChangePresenter()
        {
            IndexPresenter = rnd.Next(Players.Count);
        }

        public void PlusRound()
        {
            CurrentRound++;
            if (CurrentRound >= MaxRounds)
            {
                Status = Status.Ended;
            }
        }

        public void UpdateScore(List<Score> scores)
        {
            for (int i = 0; i < scores.Count; i++)
            {
                Scores[i].Guessed += scores[i].Guessed;
                Scores[i].AlmostGuessed += scores[i].AlmostGuessed;
                Scores[i].CalculateRecord();
            }
        }

        public void StartGame()
        {
            Status = Status.Playing;
            IsOpen = false;
            CurrentRound++;
        }
    }

    public class Score
    {
        public string Login;
        public int Record { get; set; }
        public int Guessed { get; set; }
        public int AlmostGuessed { get; set; }

        public Score(string login)
        {
            Login = login;
            CalculateRecord();
        }

        public void CalculateRecord()
        {
            Record = Guessed * (int) Points.Guessed + AlmostGuessed * (int) Points.AlmostGuessed;
        }
    }
}