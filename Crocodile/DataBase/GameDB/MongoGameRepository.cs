using System;
using System.Collections.Generic;
using MongoDB.Driver;

namespace Crocodile.DataBase.GameDB
{
    public class MongoGameRepository : IGameRepository
    {
        private readonly IMongoCollection<GameEntity> gameCollection;
        public MongoGameRepository(IGamesDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            gameCollection = database.GetCollection<GameEntity>(settings.UsersCollectionName);
        }
        
        public GameEntity Insert(GameEntity game)
        {
            gameCollection.InsertOne(game);
            return game;
        }

        public GameEntity FindById(Guid id)
        {
            return gameCollection.Find(x => x.Id == id).SingleOrDefault();
        }

        public void UpdateGame(GameEntity game)
        {
            gameCollection.ReplaceOne(x => x.Id == game.Id, game);
        }

        public void DeleteGame(Guid id)
        {
            gameCollection.DeleteOne(x => x.Id == id);
        }

        public List<GameEntity> GetOpenGames()
        {
            return gameCollection.Find(x => x.IsOpen == true).ToList();
        }
    }
}