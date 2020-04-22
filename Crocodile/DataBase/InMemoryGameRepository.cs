using System;

namespace DBProject
{
    public class InMemoryGameRepository : IGameRepository
    
    {
        private const string CollectionName = "Games";
        public GameEntity Insert()
        {
            throw new NotImplementedException();
        }

        public GameEntity FindById(Guid id)
        {
            throw new NotImplementedException();
        }

        public void UpdateGame(GameEntity game)
        {
            throw new NotImplementedException();
        }
    }
}