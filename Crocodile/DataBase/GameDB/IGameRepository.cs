using System;
using System.Collections.Generic;

namespace Crocodile.DataBase.GameDB
{
    public interface IGameRepository
    {
        GameEntity Insert(GameEntity game);
        GameEntity FindById(Guid id);
        void UpdateGame(GameEntity game);
        void DeleteGame(Guid id);
        List<GameEntity> GetOpenGames();
    }
}