using System;
using System.Collections.Generic;
using System.IO;
using MongoDB.Driver;

namespace Crocodile.DataBase.WordDB
{
    public class MongoWordRepository : IWordRepository
    {
        private readonly IMongoCollection<WordEntity> wordCollection;

        public MongoWordRepository(IWordsDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            wordCollection = database.GetCollection<WordEntity>(settings.WordsCollectionName);
            var checkCountDocuments = wordCollection.Find(x => true).CountDocuments();
            if (checkCountDocuments == 0)
            {
                var text = File.ReadAllText(@"wwwroot\words.txt");
                var words = text.Split("\r\n");
                for (int i = 0; i < words.Length; i++)
                {
                    wordCollection.InsertOne(new WordEntity(i, words[i]));
                }
            }
        }

        public List<string> TakeWords()
        {
            var wordsList = new List<string>();
            for (int i = 0; i < 3; i++)
            {
                wordsList.Add(TakeWord().Word);
            }

            return wordsList;
        }

        private WordEntity TakeWord()
        {
            var rnd = new Random();
            var count = (int) wordCollection.Find(x => true).CountDocuments();
            return wordCollection.Find(x =>
                x.Id == rnd.Next(count)).SingleOrDefault();
        }
    }
}