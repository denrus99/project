using MongoDB.Driver;

namespace Crocodile.DataBase.UserDB
{
    public class MongoUserRepository : IUserRepository
    {
        private readonly IMongoCollection<UserEntity> userCollection;

        public MongoUserRepository(IUsersDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            userCollection = database.GetCollection<UserEntity>(settings.UsersCollectionName);
            // var options = new CreateIndexOptions { Unique = true};
            // userCollection.Indexes.CreateOne("{Login : 1}", options);
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

        public void UpdateUser(UserEntity user)
        {
            userCollection.ReplaceOne(x => x.Login == user.Login, user);
        }

        public void DeleteUser(string login)
        {
            userCollection.DeleteOne(x => x.Login == login);
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