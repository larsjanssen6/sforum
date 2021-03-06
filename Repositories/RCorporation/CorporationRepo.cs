﻿using Proftaak;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RCorporation
{
    public class CorporationRepo : ICorporationRepo
    {
        ConnectionInterface connection;
        
        //Init constructor

        public CorporationRepo(ConnectionInterface connection)
        {
            this.connection = connection;
        }
        
        //Return all corporations

        public List<CorporationModel> index()
        {
            CorporationModel corporation;
            List<CorporationModel> corporations = new List<CorporationModel>();

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
            
            connection.disConnect();
            return corporations;
        }
        
        // Return a corporation

        public CorporationModel find(int id)
        {
            CorporationModel corporation = new CorporationModel();

            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select id, email, name, address, zip from corporation where id = @id", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@id", id);
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    corporation.id = Convert.ToInt32(reader["id"]);
                    corporation.email = reader["email"].ToString();
                    corporation.name = reader["name"].ToString();
                    corporation.address = reader["address"].ToString();
                    corporation.zip = reader["zip"].ToString();
                }
            }
            
            connection.disConnect();
            return corporation;
        }

        //Store a corporation and trigger stored procedure so software is automatically stored

        public int store(CorporationModel corporation)
        {
            SqlCommand sqlCommand;

            sqlCommand = new SqlCommand("insert into corporation (email, name, address, zip) VALUES (@email, @name, @address, @zip) select scope_identity()", connection.getConnection());
            connection.Connect();

            sqlCommand.Parameters.AddWithValue("@email", corporation.email);
            sqlCommand.Parameters.AddWithValue("@name", corporation.name);
            sqlCommand.Parameters.AddWithValue("@address", corporation.address);
            sqlCommand.Parameters.AddWithValue("@zip", corporation.zip);
            sqlCommand.Connection = connection.getConnection();

            int id = (int)(decimal)sqlCommand.ExecuteScalar();

            sqlCommand = new SqlCommand("createSoftware", connection.getConnection());
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@corporation_id", id);
            sqlCommand.ExecuteNonQuery();
            connection.disConnect();

            return id;
        }

        //Update a corporation

        public void update(CorporationModel corporation)
        {
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("update corporation set email = @email, name = @name, address = @address, zip = @zip where id = @id", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@email", corporation.email);
            sqlCommand.Parameters.AddWithValue("@name", corporation.name);
            sqlCommand.Parameters.AddWithValue("@address", corporation.address);
            sqlCommand.Parameters.AddWithValue("@zip", corporation.zip);
            sqlCommand.Parameters.AddWithValue("@id", corporation.id);
            sqlCommand.ExecuteNonQuery();
        
            connection.disConnect();         
        }
        
        //Destroy a corporation

        public void destroy(int id)
        {
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("delete corporation where id=@id;", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@id", id);
            sqlCommand.ExecuteNonQuery();
            connection.disConnect();
        }
    }
}
