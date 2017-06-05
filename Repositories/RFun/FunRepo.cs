using Killerapp.Repositories.RFun.models;
using Killerapp.Repositories.Software;
using Proftaak;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Repositories.RFun
{
    public class FunRepo : IFunRepo
    {
        ConnectionInterface connection;

        //Init constructor

        public FunRepo(ConnectionInterface connection)
        {
          this.connection = connection;
        }
        
        //Count the messages that a user has with a group by

        public List<GroupByModel> groupBy()
        {
            GroupByModel groupBy;
            List<GroupByModel> groupbys = new List<GroupByModel>();

            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select account.name as  'name', count(*) as 'messages' from account inner join message on account.id = message.account_id group by account.name", connection.getConnection());
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    groupBy = new GroupByModel();
                    groupBy.name = reader["name"].ToString();
                    groupBy.messages = Convert.ToInt32(reader["messages"]);
                    groupbys.Add(groupBy);
                }
            }

            connection.disConnect();
            return groupbys;
        }

        //Count the messages that a user has where name is lars with  a group by and having 

        public List<GroupByModel> groupByHaving()
        {
            GroupByModel groupBy;
            List<GroupByModel> groupbys = new List<GroupByModel>();

            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select account.name as  'name', count(*) as 'messages' from account inner join message on account.id = message.account_id group by account.name having account.name = 'Lars'", connection.getConnection());
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    groupBy = new GroupByModel();
                    groupBy.name = reader["name"].ToString();
                    groupBy.messages = Convert.ToInt32(reader["messages"]);
                    groupbys.Add(groupBy);
                }
            }

            connection.disConnect();
            return groupbys;
        }

        //Return all software that user lars has with an outer join

        public List<SoftwareModel> outerJoin()
        {
            SoftwareModel software;
            List<SoftwareModel> softwares = new List<SoftwareModel>();

            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select software.name from software full outer join corporation on software.corporation_id = corporation.id full outer join account on corporation.id = account.corporation_id where account.name = 'Lars'", connection.getConnection());
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    software = new SoftwareModel();
                    software.name = reader["name"].ToString();
                    softwares.Add(software);
                }
            }

            connection.disConnect();
            return softwares;
        }

        public List<RecursiveModel> recursive()
        {
            RecursiveModel recursiveModel;
            List<RecursiveModel> recursiveModels = new List<RecursiveModel>();

            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select c.name as 'name', c2.name as 'recurname' from corporation c inner join corporation c2 on c.corporation_id = c2.id", connection.getConnection());
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    recursiveModel = new RecursiveModel();
                    recursiveModel.name = reader["name"].ToString();
                    recursiveModel.recurname = reader["recurname"].ToString();
                    recursiveModels.Add(recursiveModel);
                }
            }

            connection.disConnect();
            return recursiveModels;
        }

        public List<GecorreleerdModel> gecorreleerde()
        {
            GecorreleerdModel gecorreleerdModel;
            List<GecorreleerdModel> gecorreleerde = new List<GecorreleerdModel>();

            connection.Connect();
            SqlCommand sqlCommand = new SqlCommand("select c.name as 'corporation', a.name as 'name', a.salary as 'salary' from corporation c inner join account a on c.id = a.corporation_id where a.salary = (select max(ac2.salary) from account ac2 where ac2.corporation_id = a.corporation_id)", connection.getConnection());
            SqlDataReader reader = sqlCommand.ExecuteReader();

            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    gecorreleerdModel = new GecorreleerdModel();
                    gecorreleerdModel.name = reader["corporation"].ToString();
                    gecorreleerdModel.corporation = reader["name"].ToString();
                    gecorreleerdModel.salary = Convert.ToInt32(reader["salary"]);
                    gecorreleerde.Add(gecorreleerdModel);
                }
            }

            connection.disConnect();
            return gecorreleerde;
        }
        
        public void challengeTrigger()
        {
            SqlCommand sqlCommand;
            connection.Connect();

            sqlCommand = new SqlCommand("checkSwearWords", connection.getConnection());
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.ExecuteNonQuery();
            connection.disConnect();
        }
    }
}

  

