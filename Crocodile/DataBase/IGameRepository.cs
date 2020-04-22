﻿﻿﻿using System;

namespace DBProject
{
    public interface IGameRepository
    {
        GameEntity Insert();
        GameEntity FindById(Guid id);
        void UpdateGame(GameEntity game);
    }
}