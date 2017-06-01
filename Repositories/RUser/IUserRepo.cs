﻿using Killerapp.Repositories.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Proftaak.Repositories.UserRepo
{
    interface IUserRepo
    {
        bool login(string email, string password);
        List<UserModel> index();
        void destroy(int id);
        UserModel find(string email);
        UserModel find(int id);
    }
}
