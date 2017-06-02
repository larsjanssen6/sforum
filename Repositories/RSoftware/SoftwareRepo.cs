using Proftaak;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.Software
{
    public class SoftwareRepo : ISoftwareRepo
    {
        ConnectionInterface connection;

        public SoftwareRepo(ConnectionInterface connection)
        {
            this.connection = connection;
        }

        public List<SoftwareModel> index(int id)
        {
            SoftwareModel software;
            List<SoftwareModel> softwares = new List<SoftwareModel>();

            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select s.id, s.name as name, c.name as corporation from software s inner join corporation c on c.id = s.corporation_id  where s.corporation_id=@corporationId", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@corporationId", id);
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    software = new SoftwareModel();
                    software.id = Convert.ToInt32(reader["id"]);
                    software.name = reader["name"].ToString();
                    software.corporation = reader["corporation"].ToString();
                    softwares.Add(software);
                }
            }
              
            connection.disConnect();            
            return softwares;
        }

        public SoftwareModel find(int id)
        {
            SoftwareModel software = new SoftwareModel();
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select id, name, corporation_id from software where id = @softwareId", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@softwareId", id);
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    software.id = Convert.ToInt32(reader["id"]);
                    software.name = reader["name"].ToString();
                    software.corporation_id = Convert.ToInt32(reader["corporation_id"]);
                }
            }

            connection.disConnect();
            return software;
        }

        public void store(SoftwareModel software)
        {
            SqlCommand sqlCommand = new SqlCommand("insert into software (name, corporation_id) VALUES (@name, @corporation_id)", connection.getConnection());
            connection.Connect();

            sqlCommand.Parameters.AddWithValue("@name", software.name);
            sqlCommand.Parameters.AddWithValue("@corporation_id", software.corporation_id);
            sqlCommand.Connection = connection.getConnection();

            sqlCommand.ExecuteNonQuery();
          
            connection.disConnect();            
        }

        public void destroy(int id)
        {
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("delete software where id=@id;", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@id", id);
            sqlCommand.ExecuteNonQuery();
            connection.disConnect();                   
        }

        public void update(SoftwareModel software)
        {
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("update software set name = @name, corporation_id = @corporation_id where id = @id", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@id", software.id);
            sqlCommand.Parameters.AddWithValue("@name", software.name);
            sqlCommand.Parameters.AddWithValue("@corporation_id", software.corporation_id);
            sqlCommand.ExecuteNonQuery();
            connection.disConnect();          
        }
    }
}
