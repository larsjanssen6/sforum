using Proftaak;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RCorporation
{
    public class CorporationRepo : ICorporationRepo
    {
        ConnectionInterface connection;

        public CorporationRepo(ConnectionInterface connection)
        {
            this.connection = connection;
        }

        public List<CorporationModel> index()
        {
            CorporationModel corporation;
            List<CorporationModel> corporations = new List<CorporationModel>();
            try
            {
                connection.Connect();
                SqlCommand sqlCommand = new SqlCommand("select * from corporation", connection.getConnection());
                SqlDataReader reader = sqlCommand.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                      corporation = new CorporationModel();
                      corporation.id = Convert.ToInt32(reader["id"]);
                      corporation.name = reader["name"].ToString();
                      corporation.address = reader["address"].ToString();
                      corporation.zip = reader["zip"].ToString();
                      corporation.email = reader["email"].ToString();
                      corporations.Add(corporation);
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

            return corporations;
        }

        public void destroy(int id)
        {
            try
            {
                connection.Connect();
                SqlCommand sqlCommand = new SqlCommand("delete corporation where id=@id;", connection.getConnection());
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
  }
}
