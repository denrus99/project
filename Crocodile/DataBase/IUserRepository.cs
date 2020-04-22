﻿﻿﻿
namespace DBProject
{
    public interface IUserRepository
    {
        UserEntity Insert(UserEntity user);
        UserEntity FindByLogin(string login);
        void UpdateStatiscicAndScore(UserEntity user);
    }
}