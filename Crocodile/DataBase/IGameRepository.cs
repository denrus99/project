﻿﻿﻿using System;
using System.Collections.Generic;

namespace DBProject
{
    public interface IGameRepository
    {
        GameEntity Insert(GameEntity game);
        GameEntity FindById(Guid id);
        void UpdateGame(GameEntity game);
        void DeleteGame();
        List<GameEntity> GetOpenGames();
    }
}