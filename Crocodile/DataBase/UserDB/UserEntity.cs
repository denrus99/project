using System.IO;
using MongoDB.Bson.Serialization.Attributes;

namespace Crocodile.DataBase.UserDB
{
    [BsonIgnoreExtraElements]
    public class UserEntity
    {
        [BsonElement] public string Login { get; }
        [BsonElement] public string Password { get; }
        [BsonElement] public byte[] Photo { get; }
        [BsonElement] [BsonDefaultValue(0)] public int CountGames { get; set; }
        [BsonElement] [BsonDefaultValue(0)] public int Record { get; set; }
        [BsonElement] [BsonDefaultValue(0)] public int Guessed { get; set; }
        [BsonElement] [BsonDefaultValue(0)] public int AlmostGuessed { get; set; }

        [BsonIgnore] private readonly byte[] _defaultPhoto =
            File.ReadAllBytes(@"D:\It's assemble time\Нечто\project\Crocodile\wwwroot\DefaultUserPhoto.png");

        [BsonConstructor]
        public UserEntity(string login, string password, byte[] photo)
        {
            Login = login;
            Password = password;
            Photo = photo;
        }

        [BsonConstructor]
        public UserEntity(string login, string password)
        {
            Photo = _defaultPhoto;
            Login = login;
            Password = password;
        }
        public void PlusGame()
        {
            CountGames++;
        }
    }
}