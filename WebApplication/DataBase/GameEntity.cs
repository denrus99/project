﻿﻿﻿using System;
using System.Collections.Generic;

namespace DBProject
{
    public class GameEntity
    {
        public Guid Id;
        public bool IsOpen;
        public int MaxRounds;
        public List<string> Players;
        public int IndexPresenter;
        public int CurrentRound;
        public List<Score> Scores;
        private Random rnd;
        public Status Status;
        
        public GameEntity(string id, bool isOpen, int maxRounds, UserEntity startUser)
        {
            rnd = new Random();
            Id = new Guid(id);
            IsOpen = isOpen;
            MaxRounds = maxRounds;
            Players = new List<string>{startUser.Login};
            Scores = new List<Score>{new Score(startUser.Login)};
            Status = Status.Playing;
            IndexPresenter = 0;
        }

        public void AddUser(UserEntity user)
        {
            Players.Add(user.Login);
        }

        public void ChangePresenter()
        {
            IndexPresenter = rnd.Next(Players.Count - 1);
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
            for (int i = 0; i < scores.Count - 1; i++)
            {
                Scores[i].Guessed += scores[i].Guessed;
                Scores[i].AlmostGuessed += scores[i].AlmostGuessed;
                Scores[i].CalculateRecord();
            }
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
            Record += Guessed * (int)Points.Guessed + AlmostGuessed * (int)Points.AlmostGuessed;
        }
    }
}