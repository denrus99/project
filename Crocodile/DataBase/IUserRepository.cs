﻿﻿﻿
namespace DBProject
{
    public interface IUserRepository
    {
        UserEntity Insert(UserEntity user);
        UserEntity FindByLogin(string login);
        void UpdateUser(UserEntity user);
        void DeleteUser(UserEntity user);
    }
}