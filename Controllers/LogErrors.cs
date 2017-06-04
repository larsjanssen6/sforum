using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Killerapp.Controllers
{
    public class LogErrors
    {
        public void logError(Exception ex)
        {
            string strPath = @"error.txt";
            if (!System.IO.File.Exists(strPath))
            {
              System.IO.File.Create(strPath).Dispose();
            }

            using (StreamWriter sw = System.IO.File.AppendText(strPath))
            {
              sw.WriteLine("=============Error Logging ===========");
              sw.WriteLine("===========Start============= " + DateTime.Now);
              sw.WriteLine("Error Message: " + ex.Message);
              sw.WriteLine("Stack Trace: " + ex.StackTrace);
              sw.WriteLine("===========End============= " + DateTime.Now);
            }
        }
    }
}
