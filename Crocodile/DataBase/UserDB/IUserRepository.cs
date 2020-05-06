namespace Crocodile.DataBase.UserDB
{
    public interface IUserRepository
    {
        UserEntity Insert(UserEntity user);
        UserEntity FindByLogin(string login);
        void UpdateUser(UserEntity user);
<<<<<<< HEAD:Crocodile/DataBase/UserDB/IUserRepository.cs
        void DeleteUser(string id);
=======
        void DeleteUser(UserEntity user);
>>>>>>> origin/Rail:Crocodile/DataBase/IUserRepository.cs
    }
}