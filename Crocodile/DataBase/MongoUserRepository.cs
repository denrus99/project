﻿﻿﻿using MongoDB.Driver;

namespace DBProject
{
    public class MongoUserRepository : IUserRepository
    {
        private readonly IMongoCollection<UserEntity> userCollection;
        private const string CollectionName = "users";
        
        public MongoUserRepository(IMongoDatabase database)
        {
            userCollection = database.GetCollection<UserEntity>(CollectionName);
            var options = new CreateIndexOptions { Unique = true};
            userCollection.Indexes.CreateOne("{Login : 1}", options);
        }
        
        public UserEntity Insert(UserEntity user)
        {
            userCollection.InsertOne(user);
            return user;
        }

        public UserEntity FindByLogin(string login)
        {
            return userCollection.Find(x => x.Login == login).SingleOrDefault();
        }

        public void UpdateStatiscicAndScore(UserEntity user)
        {
            var findUser = userCollection.Find(x => x.Login == user.Login).SingleOrDefault();
            findUser.Guessed += user.Guessed;
            findUser.AlmostGuessed += user.AlmostGuessed;
            if (findUser.Record < user.Record)
            {
                findUser.Record = user.Record;
            }
            findUser.PlusGame();
            userCollection.ReplaceOne(x => x.Login == user.Login, findUser);
        }
    }
}