using System.Collections.Generic;

namespace Crocodile.DataBase.WordDB
{
    public interface IWordRepository
    {
        public List<string> TakeWords();
    }
}