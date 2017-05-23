using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Proftaak
{
  public class Connection : ConnectionInterface
  {
    public SqlConnection databaseConnection;
    public void Connect()
    {
      databaseConnection = new SqlConnection("Server=mssql.fhict.local;Database=dbi366017;User Id=dbi366017;Password=larsjanssen;");
      try
      {
        databaseConnection.Open();
      }
      catch (Exception)
      {
        throw;
      }
    }
    public void disConnect()
    {
        databaseConnection.Close();
    }

    public SqlConnection getConnection()
    {
      return databaseConnection;
    }
  }
}