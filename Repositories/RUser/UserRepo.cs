using Killerapp.Repositories.User;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proftaak.Repositories.UserRepo
{
    public class UserRepo : IUserRepo
    {
        ConnectionInterface connection;

        public UserRepo(ConnectionInterface connection)
        {
            this.connection = connection;
        }

        public bool login(string email, string password)
        {
            string passwordDatabase = "";

            if (email == null || email == "" || password == null || password == "") return false;

            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("SELECT * from ACCOUNT where email like @email", connection.getConnection());

            sqlCommand.Parameters.AddWithValue("@email", email);
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    passwordDatabase = reader["password"].ToString();
                }
            }
  
            connection.disConnect();           
            return passwordDatabase == password;
        }

        public List<UserModel> index()
        {
            UserModel user;
            List<UserModel> users = new List<UserModel>();
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select * from account", connection.getConnection());
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    user = new UserModel();
                    user.id = Convert.ToInt32(reader["id"]);
                    user.corporation_id = Convert.ToInt32(reader["corporation_id"]);
                    user.role = Convert.ToInt32(reader["role"]);
                    user.salary = Convert.ToInt32(reader["salary"]);
                    user.email = reader["email"].ToString();
                    user.name = reader["name"].ToString();
                    user.lastName = reader["last_name"].ToString();
                    user.about = reader["about"].ToString();
                    user.gender = Convert.ToInt32(reader["gender"]);
                    user.birthDate = Convert.ToDateTime(reader["birthdate"]);
                    users.Add(user);
                }
            }
           
            connection.disConnect();         
            return users;
        }

        public void store(UserModel user)
        {
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("insert into account (name, last_name, corporation_id, role, gender, salary, email, about, password, birthdate) values(@name, @lastName, @corporation_id, @role, @gender, @salary, @email, @about, @password, '12-12-2017')", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@id", user.id);
            sqlCommand.Parameters.AddWithValue("@name", user.name);
            sqlCommand.Parameters.AddWithValue("@lastName", user.lastName);
            sqlCommand.Parameters.AddWithValue("@corporation_id", user.corporation_id);
            sqlCommand.Parameters.AddWithValue("@role", user.role);
            sqlCommand.Parameters.AddWithValue("@gender", user.gender);
            sqlCommand.Parameters.AddWithValue("@salary", user.salary);
            sqlCommand.Parameters.AddWithValue("@email", user.email);
            sqlCommand.Parameters.AddWithValue("@about", user.about);
            sqlCommand.Parameters.AddWithValue("@password", user.password);
            sqlCommand.ExecuteNonQuery();
               
            connection.disConnect();          
        }

        public void update(UserModel user)
        {
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("update account set name = @name, last_name = @lastName, corporation_id = @corporation_id, role = @role, gender = @gender, salary = @salary, email = @email, about = @about, password = @password where id = @id", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@id", user.id);
            sqlCommand.Parameters.AddWithValue("@name", user.name);
            sqlCommand.Parameters.AddWithValue("@lastName", user.lastName);
            sqlCommand.Parameters.AddWithValue("@corporation_id", user.corporation_id);
            sqlCommand.Parameters.AddWithValue("@role", user.role);
            sqlCommand.Parameters.AddWithValue("@gender", user.gender);
            sqlCommand.Parameters.AddWithValue("@salary", user.salary);
            sqlCommand.Parameters.AddWithValue("@email", user.email);
            sqlCommand.Parameters.AddWithValue("@about", user.about);
            sqlCommand.Parameters.AddWithValue("@password", user.password);
            sqlCommand.ExecuteNonQuery();
                    
            connection.disConnect();         
        }

        public void destroy(int id)
        {
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("delete account where id=@id;", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@id", id);
            sqlCommand.ExecuteNonQuery();
            connection.disConnect();          
        }

        public UserModel find(int id)
        {
            UserModel user = new UserModel();
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select * from account where id = @userId", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@userId", id);
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    user = new UserModel();
                    user.id = Convert.ToInt32(reader["id"]);
                    user.corporation_id = Convert.ToInt32(reader["corporation_id"]);
                    user.role = Convert.ToInt32(reader["role"]);
                    user.salary = Convert.ToInt32(reader["salary"]);
                    user.email = reader["email"].ToString();
                    user.name = reader["name"].ToString();
                    user.lastName = reader["last_name"].ToString();
                    user.about = reader["about"].ToString();
                    user.password = reader["password"].ToString();
                    user.gender = Convert.ToInt32(reader["gender"]);
                    user.birthDate = Convert.ToDateTime(reader["birthdate"]);
                }
            }

            connection.disConnect();
            return user;
        }

        public UserModel find(string email)
        {
            UserModel user = new UserModel();

            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select * from account where email=@email", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@email", email);
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                  user.id = Convert.ToInt32(reader["id"]);
                  user.corporation_id = Convert.ToInt32(reader["corporation_id"]);
                  user.role = Convert.ToInt32(reader["role"]);
                  user.salary = Convert.ToInt32(reader["salary"]);
                  user.email = reader["email"].ToString();
                  user.name = reader["name"].ToString();
                  user.lastName = reader["last_name"].ToString();
                  user.about = reader["about"].ToString();
                  user.gender = Convert.ToInt32(reader["gender"]);
                  user.birthDate = Convert.ToDateTime(reader["birthdate"]);
                }
            }

            connection.disConnect();
            return user;
        }
    }
}
