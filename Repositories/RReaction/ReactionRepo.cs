using Killerapp.Repositories.RMessage;
using Proftaak;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RReaction
{
    public class ReactionRepo : IReactionRepo
    {
        ConnectionInterface connection;

        //Init constructor

        public ReactionRepo(ConnectionInterface connection)
        {
            this.connection = connection;
        }
        
        //Return all reactions

        public List<ReactionModel> index(int messageId)
        {
            ReactionModel reaction;
            List<ReactionModel> reactions = new List<ReactionModel>();

            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select r.id, r.reaction, a.name, a.last_name from reaction r inner join account a on r.account_id = a.id where r.message_id = @messageId", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@messageId", messageId);
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    reaction = new ReactionModel();
                    reaction.id = Convert.ToInt32(reader["id"]);
                    reaction.name = reader["name"].ToString();
                    reaction.lastName = reader["last_name"].ToString();
                    reaction.reaction = reader["reaction"].ToString();
                    reactions.Add(reaction);
                }
            }
                
            connection.disConnect();          
            return reactions;
        }
        
        //Store a reaction

        public int store(ReactionModel reaction, int authId)
        {
            int id;
            SqlCommand sqlCommand = new SqlCommand("insert into reaction (account_id, message_id, reaction) VALUES (@account_id, @message_id, @reaction) select scope_identity()", connection.getConnection());
            connection.Connect();

            sqlCommand.Parameters.AddWithValue("@account_id", authId);
            sqlCommand.Parameters.AddWithValue("@message_id", reaction.message_id);
            sqlCommand.Parameters.AddWithValue("@reaction", reaction.reaction);
            sqlCommand.Connection = connection.getConnection();

            sqlCommand.Connection = connection.getConnection();
            id = (int)(decimal)sqlCommand.ExecuteScalar();
            

            connection.disConnect();
            return id;
        }

        //Return one reaction

        public ReactionModel find(int id)
        {
            ReactionModel reaction = new ReactionModel();
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select r.id, r.reaction, a.name, a.last_name from reaction r inner join account a on r.account_id = a.id where r.id = @reactionId", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@reactionId", id);
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    reaction.id = Convert.ToInt32(reader["id"]);
                    reaction.name = reader["name"].ToString();
                    reaction.lastName = reader["last_name"].ToString();
                    reaction.reaction = reader["reaction"].ToString();
                }
            }

            connection.disConnect();
            return reaction;
        }
        
        //Update a reaction

        public void update(ReactionModel reaction)
        {
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("update reaction set reaction = @reaction where id = @id", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@id", reaction.id);
            sqlCommand.Parameters.AddWithValue("@reaction", reaction.reaction);
            sqlCommand.ExecuteNonQuery();
          
            connection.disConnect();          
        }
        
        //Destroy a reaction

        public void destroy(int id)
        {
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("delete reaction where id=@id;", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@id", id);
            sqlCommand.ExecuteNonQuery();
            connection.disConnect();                 
            connection.disConnect();           
        }
    }
}
