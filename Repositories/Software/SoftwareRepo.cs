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

        public List<Software> index(int id)
        {
            Software software;
            List<Software> softwares = new List<Software>();
            try
            {
                connection.Connect();
                SqlCommand sqlCommand = new SqlCommand("select * from software where corporation_id=@corporationId", connection.getConnection());
                sqlCommand.Parameters.AddWithValue("@corporationId", id);
                SqlDataReader reader = sqlCommand.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        software = new Software();
                        software.id = Convert.ToInt32(reader["id"]);
                        software.name = reader["name"].ToString();
                        softwares.Add(software);
                    }
                }
              }

              catch (Exception)
              {
                throw;
              }

              finally
              {
                connection.disConnect();
              }

              return softwares;
        }
    }
}
