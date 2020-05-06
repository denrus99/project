namespace Crocodile.DataBase.WordDB
{
    public class WordsDatabaseSettings : IWordsDatabaseSettings
    {
        public string WordsCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IWordsDatabaseSettings
    {
        string WordsCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}