using MongoDB.Bson.Serialization.Attributes;

namespace Crocodile.DataBase.WordDB
{
    public class WordEntity
    {
        [BsonId] public int Id;
        [BsonElement] public string Word;
        [BsonConstructor]
        public WordEntity(int id, string word)
        {
            Id = id;
            Word = word;
        }
    }
}