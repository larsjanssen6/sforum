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
            try
            {
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

        public SoftwareModel find(int id)
        {
            SoftwareModel software = new SoftwareModel();

            try
            {
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
            }

            catch (Exception ex)
            {
                throw;
            }

            return software;
        }

        public void destroy(int id)
        {
            try
            {
                connection.Connect();
                SqlCommand sqlCommand = new SqlCommand("delete software where id=@id;", connection.getConnection());
                sqlCommand.Parameters.AddWithValue("@id", id);
                sqlCommand.ExecuteNonQuery();
                connection.disConnect();

            }
            catch (Exception)
            {
                throw;
            }

            finally
            {
                connection.disConnect();
            }
        }

        public void update(SoftwareModel software)
        {
            try
            {
                connection.Connect();
                SqlCommand sqlCommand = new SqlCommand("update software set name = @name, corporation_id = @corporation_id where id = @id", connection.getConnection());
                sqlCommand.Parameters.AddWithValue("@id", software.id);
                sqlCommand.Parameters.AddWithValue("@name", software.name);
                sqlCommand.Parameters.AddWithValue("@corporation_id", software.corporation_id);
                sqlCommand.ExecuteNonQuery();
            }
            catch (Exception)
            {
                throw;
            }

            finally
            {
                connection.disConnect();
            }
        }
    }
}
