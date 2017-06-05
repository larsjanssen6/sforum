using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Proftaak;
using System.Data.SqlClient;
using Killerapp.Repositories.RMessage;
using Killerapp.Repositories.RReaction;

namespace SForumTest
{
    [TestClass]
    public class MessageRepoUnitTest
    {
        [TestMethod]
        public void store_and_delete_a_message()
        {
            Connection one = new Connection();
            Connection two = new Connection();

            MessageRepo repo = new MessageRepo(new Connection(), new ReactionRepo(new Connection()));

            //Create message

            MessageModel message = new MessageModel();
            message.message = "testmessage";
            message.subject = "subject";
            message.forum = "1";
            message.software = "1";

            int id = repo.store(message, 1);
            message.id = id;

            message.message = "updatetmessage";

            //Update message
            repo.update(message);

            one.Connect();
            SqlCommand sqlCommand = new SqlCommand("select * from message where message = 'updatetmessage'", one.getConnection());
            SqlDataReader reader = sqlCommand.ExecuteReader();
            Assert.AreEqual(true, reader.HasRows);
            one.disConnect();
            
            //Destroy message

            repo.destroy(id);
        }

        [TestMethod]
        public void update_a_message()
        {
            //Create message

            Connection one = new Connection();

            MessageRepo repo = new MessageRepo(new Connection(), new ReactionRepo(new Connection()));

            MessageModel message = new MessageModel();
            message.message = "testmessage";
            message.subject = "subject";
            message.forum = "1";
            message.software = "1";

            int id = repo.store(message, 1);
            message.id = id;

            //Give message a new name

            message.message = "new name!";
            repo.update(message);

            one.Connect();
            SqlCommand sqlCommand = new SqlCommand("select * from message where message = 'new name!'", one.getConnection());
            SqlDataReader reader = sqlCommand.ExecuteReader();
            Assert.AreEqual(true, reader.HasRows);
            one.disConnect();

            repo.destroy(id);
        }
    }
}
