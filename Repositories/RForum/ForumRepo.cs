﻿using Proftaak;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RForum
{
    public class ForumRepo : IForumRepo
    {
        ConnectionInterface connection;

        public ForumRepo(ConnectionInterface connection)
        {
          this.connection = connection;
        }

        public List<ForumModel> index()
        {
            ForumModel forum;
            List<ForumModel> forums = new List<ForumModel>();
            try
            {
                connection.Connect();
                SqlCommand sqlCommand = new SqlCommand("select * from forum", connection.getConnection());
                SqlDataReader reader = sqlCommand.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        forum = new ForumModel();
                        forum.id = Convert.ToInt32(reader["id"]);
                        forum.name = reader["name"].ToString();
                        forum.description = reader["description"].ToString();
                        forums.Add(forum);
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

            return forums;
        }

        public ForumModel find(int id)
        {
            ForumModel forum = new ForumModel();

            try
            {
                connection.Connect();
                SqlCommand sqlCommand = new SqlCommand("select * from forum where id=@id", connection.getConnection());
                sqlCommand.Parameters.AddWithValue("@id", id);
                SqlDataReader reader = sqlCommand.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                      forum.id = Convert.ToInt32(reader["id"]);
                      forum.name = reader["name"].ToString();
                      forum.description = reader["description"].ToString();
                    }
                }
            }

            catch (Exception ex)
            {
                throw;
            }

            return forum;
        }

        public void store(ForumModel forum)
        {
            try
            {
                SqlCommand sqlCommand = new SqlCommand("insert into forum (name, description) VALUES (@name, @description)", connection.getConnection());
                connection.Connect();
                sqlCommand.Parameters.AddWithValue("@name", forum.name);
                sqlCommand.Parameters.AddWithValue("@description", forum.description);

                sqlCommand.Connection = connection.getConnection();

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

        public void update(ForumModel forum)
        {
            try
            {
                connection.Connect();
                SqlCommand sqlCommand = new SqlCommand("update forum set name = @name, description = @description where id = @id", connection.getConnection());
                sqlCommand.Parameters.AddWithValue("@name", forum.name);
                sqlCommand.Parameters.AddWithValue("@description", forum.description);
                sqlCommand.Parameters.AddWithValue("@id", forum.id);
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

        public void destroy(int id)
        {
            try
            {
                connection.Connect();
                SqlCommand sqlCommand = new SqlCommand("delete forum where id=@id;", connection.getConnection());
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
