﻿using System;
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
            gameCollection = database.GetCollection<GameEntity>(settings.GamesCollectionName);
        }
        
        public GameEntity Insert(GameEntity game)
        {
            gameCollection.InsertOne(game);
            return game;
        }

        public GameEntity FindById(Guid id)
        {
            return gameCollection.Find(x => x.GameId == id).SingleOrDefault();
        }

        public void UpdateGame(GameEntity game)
        {
            gameCollection.ReplaceOne(x => x.GameId == game.GameId, game);
        }

        public void DeleteGame(Guid id)
        {
            gameCollection.DeleteOne(x => x.GameId == id);
        }

        public List<GameEntity> GetOpenGames()
        {
            return gameCollection.Find(x => x.IsOpen == true).ToList();
        }
    }
}