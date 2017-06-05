using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Proftaak;
using System.Data.SqlClient;
using Killerapp.Repositories.RCorporation;
using Killerapp.Repositories.RReaction;
using Killerapp.Repositories.RMessage;

namespace SForumTest
{
    [TestClass]
    public class ReactionRepoUnitTest
    {
        [TestMethod]
        public void store_and_delete_a_reaction()
        {
            Connection one = new Connection();
            Connection two = new Connection();

            ReactionRepo repo = new ReactionRepo(new Connection());
            MessageRepo mRepo = new MessageRepo(new Connection(), new ReactionRepo(new Connection()));

            //Create message that reaction will belong to

            MessageModel message = new MessageModel();
            message.message = "testmessage";
            message.subject = "subject";
            message.forum = "1";
            message.software = "1";
            
            int id = mRepo.store(message, 1);
            
            //Create reaction 

            ReactionModel reaction = new ReactionModel();
            reaction.message_id = id;
            reaction.lastName = "lastname";
            reaction.reaction = "reaction";

            int idTwo = repo.store(reaction, 1);
            reaction.id = idTwo;

            one.Connect();
            SqlCommand sqlCommand = new SqlCommand("select * from reaction where reaction = 'reaction'", one.getConnection());
            SqlDataReader reader = sqlCommand.ExecuteReader();
            Assert.AreEqual(true, reader.HasRows);
            one.disConnect();
            
            //Delete reaction

            repo.destroy(id);

            two.Connect();

            SqlCommand sqlCommandTwo = new SqlCommand("select * from corporation where name = 'name' and email ='email' and zip = '3434-kj' and address = 'address'", two.getConnection());
            SqlDataReader readerTwo = sqlCommandTwo.ExecuteReader();
            Assert.AreEqual(false, readerTwo.HasRows);
            one.disConnect();
          }

        [TestMethod]
        public void update_a_message()
        {
          Connection one = new Connection();
          Connection two = new Connection();

          ReactionRepo repo = new ReactionRepo(new Connection());
          MessageRepo mRepo = new MessageRepo(new Connection(), new ReactionRepo(new Connection()));

          //Create message that reaction will belong to

          MessageModel message = new MessageModel();
          message.message = "testmessage";
          message.subject = "subject";
          message.forum = "1";
          message.software = "1";

          int id = mRepo.store(message, 1);

          //Create reaction 

          ReactionModel reaction = new ReactionModel();
          reaction.message_id = id;
          reaction.lastName = "lastname";
          reaction.reaction = "reaction";

          int idTwo = repo.store(reaction, 1);
          reaction.id = idTwo;
          //Give forum a new name

          reaction.reaction = "new name!";
          
          repo.update(reaction);

          one.Connect();
          SqlCommand sqlCommand = new SqlCommand("select * from reaction where reaction = 'new name!'", one.getConnection());
          SqlDataReader reader = sqlCommand.ExecuteReader();
          Assert.AreEqual(true, reader.HasRows);
          one.disConnect();

          repo.destroy(id);
        }
    }
}
