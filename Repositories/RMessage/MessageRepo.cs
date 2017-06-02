using Killerapp.Repositories.RReaction;
using Proftaak;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RMessage
{
    public class MessageRepo :IMessageRepo
    {
        ConnectionInterface connection;
        IReactionRepo reactionRepo;

        //Init constructor

        public MessageRepo(ConnectionInterface connection, IReactionRepo reactionRepo)
        {
            this.connection = connection;
            this.reactionRepo = reactionRepo;
        }
        
        //Return all messages based on a forum

        public List<MessageModel> index(int forumId)
        {
            MessageModel message;
            List<MessageModel> messages = new List<MessageModel>();

            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select m.id, f.name as forum, a.name as name, s.name as software, m.subject as subject, m.message as message from message m inner join forum f on f.id = m.forum_id inner join account a on a.id = m.account_id inner join software s on s.id = m.software_id where m.forum_id = @forumId", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@forumId", forumId);
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    message = new MessageModel();
                    message.id = Convert.ToInt32(reader["id"]);
                    message.forum = reader["forum"].ToString();
                    message.user = reader["name"].ToString();
                    message.software = reader["software"].ToString();
                    message.subject = reader["subject"].ToString();
                    message.message = reader["message"].ToString();
                    messages.Add(message);
                }
            }
             
            connection.disConnect();             
            return messages;
        }
        
        //Return one message

        public MessageModel find(int id)
        {
            MessageModel message = new MessageModel();

            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select m.id, f.name as forum, a.name as name, s.name as software, m.subject as subject, m.message as message from message m inner join forum f on f.id = m.forum_id inner join account a on a.id = m.account_id inner join software s on s.id = m.software_id where m.id = @id", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@id", id);
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    message.id = Convert.ToInt32(reader["id"]);
                    message.forum = reader["forum"].ToString();
                    message.user = reader["name"].ToString();
                    message.software = reader["software"].ToString();
                    message.subject = reader["subject"].ToString();
                    message.message = reader["message"].ToString();
                }
            }

            message.reactions = new List<ReactionModel>();
            message.reactions = reactionRepo.index(message.id);
            connection.disConnect();

            return message;
        }
        

        //Store a message

        public void store(MessageModel message, int authId)
        {
            SqlCommand sqlCommand = new SqlCommand("insert into message (forum_id, account_id, software_id, subject, message) VALUES (@forum_id, @account_id, @software_id, @subject, @message)", connection.getConnection());
            connection.Connect();

            sqlCommand.Parameters.AddWithValue("@forum_id", message.forum);
            sqlCommand.Parameters.AddWithValue("@account_id", authId);
            sqlCommand.Parameters.AddWithValue("@software_id", message.software);
            sqlCommand.Parameters.AddWithValue("@subject", message.subject);
            sqlCommand.Parameters.AddWithValue("@message", message.message);
            sqlCommand.Connection = connection.getConnection();

            sqlCommand.ExecuteNonQuery();           
            connection.disConnect();            
        }
        
        //Update a message

        public void update(MessageModel message)
        {
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("update message set subject = @subject, message = @message where id = @id", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@subject", message.subject);
            sqlCommand.Parameters.AddWithValue("@message", message.message);
            sqlCommand.Parameters.AddWithValue("@id", message.id);
            sqlCommand.ExecuteNonQuery();
            
            connection.disConnect();         
        }
        
        //Destroy a message

        public void destroy(int id)
        {
            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("delete message where id=@id;", connection.getConnection());
            sqlCommand.Parameters.AddWithValue("@id", id);
            sqlCommand.ExecuteNonQuery();                  
            connection.disConnect();           
        }
  }
}
