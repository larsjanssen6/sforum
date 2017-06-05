using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Proftaak;
using System.Data.SqlClient;
using Killerapp.Repositories.RCorporation;

namespace SForumTest
{
    [TestClass]
    public class CorporationRepoUnitTest
    {
        [TestMethod]
        public void store_and_delete_a_corporation()
        {
            Connection one = new Connection();
            Connection two = new Connection();

            CorporationRepo repo = new CorporationRepo(new Connection());

            //Create corporation

            CorporationModel corporation = new CorporationModel();
            corporation.name = "name";
            corporation.email = "email";
            corporation.zip = "3434-kj";
            corporation.address = "address";

            int id = repo.store(corporation);


            one.Connect();
            SqlCommand sqlCommand = new SqlCommand("select * from corporation where name = 'name' and email ='email' and zip = '3434-kj' and address = 'address'", one.getConnection());
            SqlDataReader reader = sqlCommand.ExecuteReader();
            Assert.AreEqual(true, reader.HasRows);
            one.disConnect();

            repo.destroy(id);

            two.Connect();

            //Delete corporation

            SqlCommand sqlCommandTwo = new SqlCommand("select * from corporation where name = 'name' and email ='email' and zip = '3434-kj' and address = 'address'", two.getConnection());
            SqlDataReader readerTwo = sqlCommandTwo.ExecuteReader();
            Assert.AreEqual(false, readerTwo.HasRows);
            one.disConnect();
        }

        [TestMethod]
        public void update_a_corporation()
        {
            //Create corporation

            Connection one = new Connection();

            CorporationRepo repo = new CorporationRepo(new Connection());

            CorporationModel corporation = new CorporationModel();
            corporation.name = "name";
            corporation.email = "email";
            corporation.zip = "3434-kj";
            corporation.address = "address";

            int id = repo.store(corporation);
            corporation.id = id;

            //Give corporation a new name

            corporation.name = "new name!";
            repo.update(corporation);

            one.Connect();
            SqlCommand sqlCommand = new SqlCommand("select * from corporation where name = 'new name!'", one.getConnection());
            SqlDataReader reader = sqlCommand.ExecuteReader();
            Assert.AreEqual(true, reader.HasRows);
            one.disConnect();

            repo.destroy(id);
        }
    }
}
