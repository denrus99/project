using System.IO;
using MongoDB.Bson.Serialization.Attributes;

namespace Crocodile.DataBase.UserDB
{
    [BsonIgnoreExtraElements]
    public class UserEntity
    {
        [BsonId] public string Login { get; }
        [BsonElement] public string Password { get; }
        [BsonElement] public string Photo { get; }
        [BsonElement] [BsonDefaultValue(0)] public int CountGames { get; set; }
        [BsonElement] [BsonDefaultValue(0)] public int Record { get; set; }
        [BsonElement] [BsonDefaultValue(0)] public int Guessed { get; set; }
        [BsonElement] [BsonDefaultValue(0)] public int AlmostGuessed { get; set; }
        [BsonConstructor]
        public UserEntity(string login, string password, string photo)
        {
            Login = login;
            Password = password;
            Photo = photo;
        }

        [BsonConstructor]
        public UserEntity(string login, string password)
        {
            Photo = Photo = "https://image.flaticon.com/icons/svg/2919/2919573.svg";
            Login = login;
            Password = password;
        }
        public void PlusGame()
        {
            CountGames++;
        }
    }
}