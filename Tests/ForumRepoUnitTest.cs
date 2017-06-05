using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Proftaak;
using Killerapp.Repositories.RForum;
using System.Data.SqlClient;

namespace SForumTest
{
    [TestClass]
    public class ForumRepoUnitTest
    {
        [TestMethod]
        public void store_and_delete_a_forum()
        {
            Connection one = new Connection();
            Connection two = new Connection();

            ForumRepo repo = new ForumRepo(new Connection());
            
            //Create forum

            ForumModel forum = new ForumModel();
            forum.name = "testname";
            forum.description = "testdescription";

            int id = repo.store(forum);


            one.Connect();
            SqlCommand sqlCommand = new SqlCommand("select * from forum where name = 'testname' and description ='testdescription'", one.getConnection());
            SqlDataReader reader = sqlCommand.ExecuteReader();
            Assert.AreEqual(true, reader.HasRows);
            one.disConnect();

            repo.destroy(id);

            two.Connect();

            //Delete forum

            SqlCommand sqlCommandTwo = new SqlCommand("select * from forum where name = 'testname' and description ='testdescription'", two.getConnection());
            SqlDataReader readerTwo = sqlCommandTwo.ExecuteReader();
            Assert.AreEqual(false, readerTwo.HasRows);
            one.disConnect();
        }

        [TestMethod]
        public void update_a_forum()
        {
            //Create forum

            Connection one = new Connection();

            ForumRepo repo = new ForumRepo(new Connection());

            ForumModel forum = new ForumModel();
            forum.name = "testname";
            forum.description = "testdescription";

            int id = repo.store(forum);
            forum.id = id;

            //Give forum a new name

            forum.name = "new name!";
            repo.update(forum);

            one.Connect();
            SqlCommand sqlCommand = new SqlCommand("select * from forum where name = 'new name!'", one.getConnection());
            SqlDataReader reader = sqlCommand.ExecuteReader();
            Assert.AreEqual(true, reader.HasRows);
            one.disConnect();

            repo.destroy(id);
        }
    }
}
