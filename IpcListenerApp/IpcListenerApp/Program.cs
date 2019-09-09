using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IpcListenerApp
{
    class Program
    {
        static void Main(string[] args)
        {
            // read arguments for meas Ids, from time, to time
            string inpTimeFormat = "yyyy_MM_dd_HH_mm_ss";
            DateTime fromTime = DateTime.Now.AddMinutes(-5);
            DateTime toTime = fromTime.AddMinutes(0);
            int measId = -1;
            try
            {
                for (int argIter = 0; argIter < args.Length - 1; argIter++)
                {
                    // Console.WriteLine(args[argIter]);
                    if (args[argIter] == "--from_time")
                    {
                        fromTime = DateTime.ParseExact(args[argIter + 1], inpTimeFormat, CultureInfo.InvariantCulture);
                    }
                    if (args[argIter] == "--to_time")
                    {
                        toTime = DateTime.ParseExact(args[argIter + 1], inpTimeFormat, CultureInfo.InvariantCulture);
                    }
                    if (args[argIter] == "--meas_id")
                    {
                        measId = int.Parse(args[argIter + 1]);
                    }
                }
            }
            catch (Exception)
            {
                // return nothing or send empty array                
            }

            List<List<double>> timeseries = new List<List<double>>();
            Random r = new Random();
            int chunkSize = 50000;
            for (DateTime dt = fromTime; dt <= toTime; dt = dt.AddMilliseconds(40))
            {
                timeseries.Add(new List<double>() { dt.ToUniversalTime().Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds, r.Next(0, 500) });
            }

            string outStr = JsonConvert.SerializeObject(timeseries);
            // string seq = String.Join(", ", Enumerable.Range(0, 100000).Select(x => x.ToString()).ToArray());
            for (int chunkIter = 0; chunkIter < outStr.Length; chunkIter += chunkSize)
            {
                Console.Write(outStr.Substring(chunkIter, Math.Min(chunkSize, outStr.Length - chunkIter)));
                Console.Out.Flush();
            }
            // Console.Write(seq);
            // Console.WriteLine($"fromTime = {fromTime.ToString()}, toTime = {toTime.ToString()}, measId = {measId}");
            // Console.Out.Flush();
        }
    }
}
