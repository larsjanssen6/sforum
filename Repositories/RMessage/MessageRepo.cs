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

        public MessageRepo(ConnectionInterface connection)
        {
          this.connection = connection;
        }

        public List<MessageModel> index(int forumId)
        {
              MessageModel message;
              List<MessageModel> messages = new List<MessageModel>();

              try
                {
                  connection.Connect();
                  SqlCommand sqlCommand = new SqlCommand("select m.id, f.name as forum, a.name as user, s.name as software, m.subject as subject, m.message as message from message m inner join forum f on f.id = m.forum_id" +
                  "inner join account a on a.id = m.account_id inner join software s on s.id = m.software_id where m.forum_id = @forumId", connection.getConnection());
                  sqlCommand.Parameters.AddWithValue("@forumId", forumId);
                  SqlDataReader reader = sqlCommand.ExecuteReader();

                  if (reader.HasRows)
                  {
                      while (reader.Read())
                      {
                          message = new MessageModel();
                          message.id = Convert.ToInt32(reader["id"]);
                          message.forum = reader["forum"].ToString();
                          message.user = reader["user"].ToString();
                          message.software = reader["software"].ToString();
                          message.subject = reader["subject"].ToString();
                          message.message = reader["message"].ToString();
                          messages.Add(message);
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

              return messages;
        }
    }
}
