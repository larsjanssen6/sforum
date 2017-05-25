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

        public ReactionRepo(ConnectionInterface connection)
        {
            this.connection = connection;
        }

        public List<ReactionModel> index(int messageId)
        {
            ReactionModel reaction;
            List<ReactionModel> reactions = new List<ReactionModel>();

            try
            {
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
          }

          catch (Exception)
          {
              throw;
          }

          finally
          {
              connection.disConnect();
          }

            return reactions;
        }
    }
}
