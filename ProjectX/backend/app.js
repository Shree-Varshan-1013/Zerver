const http = require('http');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');

const dbConnect = require('./config/dbConfig');
const checkDatabaseExistence = require('./config/checkDatabase');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
// io.path("/performance");
// const page1Namespace = io.of('/performance');
// page1Namespace.on('connection', async (socket) => {
//   // Handle events specific to page 1
//   console.log('Client connected to page 1:', socket.id);

//   // Example: Emit data for page 1
//   await fetchDataAndEmitLast("server1_clf", "total_stars", "totalStars");
//   await fetchDataAndEmitLast("server1_clf", "cpu_usage", "cpuUsage");
//   await fetchDataAndEmitLast("server1_clf", "memory_usage", "memoryUsage");
//   // ... (other events)

//   socket.on('disconnect', () => {
//     console.log(`Client Disconnected from page 1: ${socket.id}`);
//   });
// });
let dbInstance; // Declare a variable to store the database instance globally
// let server_name =socket.handshake.query.name;
const connectToDatabases = async () => {
  try {
    // Establish a single database connection
    if (!dbInstance) {
      dbInstance = await dbConnect();
    }
  } catch (error) {
    console.error("Error establishing or using the database connection:", error);
    throw error;
  }
  return dbInstance;
};

const fetchDataAndEmitArray = async (dbName, collectionName, eventName) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);
    const logDataValue = await logsCollection.find().toArray();
    // console.log("Got data from MongoDB (${dbName}):", logDataValue);
    io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error("Error fetching data from MongoDB (${dbName}):", error);
  }
};

const fetchDataAndEmitReverseArray = async (dbName, collectionName, eventName) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);

    // Use sort to get data in reverse order based on timestamp
    const logDataValue = await logsCollection.find().sort({ timestamp: -1 }).toArray();
// const logDataValue = await logsCollection.find().sort({ _id: -1 }).toArray();
// console.log(`Got data from MongoDB (${dbName}):`, logDataValue);
io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error(`Error fetching data from MongoDB (${dbName}):`, error);
  }
};

const fetchDataAndEmitReverseArrayNotification = async (dbName, collectionName, eventName) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);

    const logDataValue = await logsCollection.find().sort({ _id: -1 }).toArray();

    io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error(`Error fetching data from MongoDB (${dbName}):`, error);
  }
};





const fetchDataAndEmit = async (dbName, collectionName, eventName,server_name) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);
    const logDataValue = await logsCollection.findOne({"hostname":server_name});
    // console.log("Got data from MongoDB (${dbName}):", logDataValue);
    io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error("Error fetching data from MongoDB (${dbName}):", error);
  }
};

const fetchDataAndEmitLast = async (dbName, collectionName, eventName,server_name) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);
    const logDataValue = await logsCollection.findOne({"hostname":server_name}, { sort: { timestamp: -1 } });
    console.log("Got data from MongoDB "+server_name+":", logDataValue);
    io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error("Error fetching data from MongoDB (${dbName}):", error);
  }
};

const fetchDataAndEmitArrayLimit = async (dbName, collectionName, eventName, limit,server_name) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);

    // Use the limit method to fetch the first 'limit' documents
    const logDataValue = await logsCollection.find({"hostname":server_name}).limit(limit).toArray();

    // console.log("Got data from 7 (${dbName}):", logDataValue);
    io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error("Error fetching data from MongoDB (${dbName}):", error);
  }
};
const fetchDataByCompareIp = async (dbName, collectionName, eventName, ip,server_name) => {
  try {
    const db = dbInstance.db(dbName);
    const ipData = db.collection(collectionName);

    const result = await ipData.findOne({"hostname":server_name ,ip_address: ip }, { sort: { timestamp: -1 } });

    io.emit(eventName, { data: result });
  } catch (error) {
    console.error("Error fetching data from MongoDB (${dbName}):", error);
  }
};

const fetchDataAndEmitArrayCount = async (dbName, collectionName, eventName,server_name) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);

    // Use the countDocuments method to get the total count of documents in the collection
    const dataSize = await logsCollection.find({"hostname":server_name}).count();

    // console.log(`Got data count from ${dbName}:`, dataSize);

    io.emit(eventName, { count: dataSize });
  } catch (error) {
    console.error(`Error fetching data count from MongoDB (${dbName}):`, error);
  }
};

io.on('connection', async (socket) => {
  console.log(`Client Connected: ${socket.id}`);

  socket.on("getDBName", (dbName) => {
    console.log("database name " + dbName);
  })

  var res = null;
  socket.on("getServer", async (server) => {
    res = await checkDatabaseExistence(dbInstance, server);
    io.emit("getResponse", res);
  })

  socket.on('checkIp', async (ip) => {
    // console.log(ip + "==== ip")
    const res = await fetchDataByCompareIp("server1_clf", "ip_status", "ipStatus", ip)  
    io.emit('ipStatus', res);
  }
);

let notificationsFetched = false;
let server_name=socket.handshake.query.name;
// setupChangeStream('server1_clf', 'basic_data', 'logTableDashboard');
  // await fetchDataAndEmitReverseArray("server1_clf", "basic_data", "logTableDashboardReverse");
  // setupChangeStream('server1_clf', 'basic_data', 'logTableDashboardReverse');
  // setupChangeStreamLast("telegraf","cpu","cpugraf");

  await fetchDataAndEmitLast("log_analysis","summary", "summaryData",server_name);
  // await fetchDataAndEmit("server2_db", "cpu_usage", "secondTable");
  // await fetchDataAndEmit("server1_clf", "operating_systems_info_security", "operatingSystem");
  await fetchDataAndEmit("log_analysis","vulnerabilities_count_security", "vCount",server_name,);
  // await fetchDataAndEmit("server1_clf", "vulnerabilities", "vData");
  await fetchDataAndEmitArrayLimit("log_analysis", "vulnerabilities_count_security", "vLimit",7,server_name,);
//  await fetchDataAndEmitLast("log_analysis", "total_stars", "total_stars",server_name);

  // await fetchDataAndEmitLast("server1_clf", "virtual_memory", "virtualMemory");
  await fetchDataAndEmitArray("log_analysis", "memory_usage", "memoryArray",server_name,);
  await fetchDataAndEmitArray("log_analysis","cpu_usage", "cpuArray",server_name,);
  // await fetchDataAndEmitLast("server1_clf", "cost_estimation_forecast", "costEstimation");
  // await fetchDataAndEmitLast("server1_clf", "daily_users_forecast", "userForecast");
  // await fetchDataAndEmitLast("server1_clf", "logs_estimation_forecast", "logEstimation");
  await fetchDataAndEmitArray("log_analysis", "dual_graph", "twoArray",server_name,);
  // await fetchDataAndEmitLast("telegraf", "cpu", "cpugraf");
  await fetchDataAndEmitArray( "log_analysis","status_codes", "status_code",server_name,);
  if (!notificationsFetched) {
    await fetchDataAndEmitReverseArrayNotification("log_analysis", "notifications", "getNotifications",server_name,);
    notificationsFetched = true;
  }

socket.on('disconnect', () => {
  console.log(`Client Disconnected: ${socket.id}`);
});
});



/// <============ integer values for  request and logTable count ========>

let documentsAddedCount = 0;

// let documentsAddedCount = 0;

const fetchDataAndEmitCount = async (dbName, collectionName, eventName) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);

    // Use sort to get data in reverse order based on timestamp
    const logDataValue = await logsCollection.find().sort({ timestamp: -1 }).toArray();

    // Get the count of added documents
    const addedDocumentsCount = logDataValue.length - documentsAddedCount;

    // Update the documentsAddedCount
    documentsAddedCount = logDataValue.length;

    // Emit the count of added documents to the frontend only if documents are added
    if (addedDocumentsCount >= 0) {
      io.emit(eventName, { addedDocumentsCount });
    }
  } catch (error) {
    console.error(`Error fetching data from MongoDB (${dbName}):`, error);
  }
};





// ============ip Analysis data =============
io.on("connection", (socket) => {
  // console.log("Socket connected:", socket.id);

  socket.on("fetchChartData", async (data) => {
    const { ipAddress } = data;
    try {
      // const mongouri = 'mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority';
      // const client = await MongoClient.connect(mongouri);

      // await connectToDatabases();
      const db = dbInstance.db('server1_clf');
      const collection = db.collection('basic_data');

      // Adjust the query based on your data structure
      const result = await collection.aggregate([
        {
          $match: {
            ip_address: ipAddress,
            timestamp: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }, // Fetch data for the past 30 days
          },
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
              statusCode: "$status_code",
            },
            count: { $sum: 1 },
          },
        },
      ]).toArray();

      // Format the data for sending to the frontend
      const series = [
        {
          name: "success",
          data: result
            .filter((entry) => entry._id.statusCode >= 200 && entry._id.statusCode < 300)
            .map((entry) => ({ x: entry._id.date, y: entry.count })),
        },
        {
          name: "failure",
          data: result
            .filter((entry) => entry._id.statusCode >= 400 && entry._id.statusCode < 500)
            .map((entry) => ({ x: entry._id.date, y: entry.count })),
        },
      ];

      // Emit the chart data to the frontend
      socket.emit("chartData", { series });
      console.log("ip Success and failure rate",series);

      client.close();
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  });
});



//  ========== user forecast ===========

io.on('connection', async (socket) => {
  // console.log(`Client Connected to userforecast: ${socket.id}`);

  try {
    // const mongouri = 'mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority';
    // const client = await MongoClient.connect(mongouri);
    // const dbInstance = client.db('server1_clf');
    // const collection = dbInstance.collection('cost_estimation_forecast');
    // const db = dbInstance.db("");
    // const logsCollection = db.collection(collectionName);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 10);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 10);
    
    const result = await collection.aggregate([
      {
        $match: {
          ds: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$ds",
          Yhat: "$yhat"
        }
      },
      {
        $sort: { date: 1 }
      }
    ]).toArray();
    
    const labels = result.map(entry => entry.date.toISOString().split('T')[0]);
    const seriesData = result.map(entry => entry.Yhat);

    socket.emit('userForecast', { labels, seriesData });
    // console.log('labels',labels);
    // console.log('seriesData',seriesData);

    client.close();
  } catch (error) {
    console.error("Error during data fetching and emission:", error);
  }
  
  socket.on('disconnect', () => {
    console.log(`Client Disconnected: ${socket.id}`);
  });
});





//  ========== logs and Users count =============
io.on('connection', async (socket) => {
  socket.on('requestUserAndLogsForecast', async () => {
    try {
      const mongouri = 'mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority';
      const client = await MongoClient.connect(mongouri);

      const db = dbInstance.db('server1_clf');
      const collection = db.collection('daily_users forecast');
      const collection2 = db.collection('logs_estimation_forecast');
      const startOf2023 = new Date('2023-12-09T00:00:00.000Z');
      const endOfFuture = new Date('2023-12-31T00:00:00.000Z');

      const userData = await collection.find({
        ds: {
          $gte: startOf2023,
          $lte: endOfFuture,
        }
      }).toArray();

      const logData = await collection2.find({
        ds: {
          $gte: startOf2023,
          $lte: endOfFuture,
        }
      }).toArray();
      socket.emit('userAndLogsForecast', { userForecast: userData, logsForecast: logData });
      client.close();
    } catch (error) {
      console.error(error);
      socket.emit('error', { message: 'Internal Server Error' });
    }
  });


//  ========== log graph at logs page value ======= 

function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`;
}

const fetchChartDataPastHour = async (dbName, collectionName, eventName) => {
  try {
    const mongouri = 'mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority';
    const client = await MongoClient.connect(mongouri);
    const dbInstance = client.db(dbName);
    const collection = dbInstance.collection(collectionName);

    // const startDate = new Date('2023-12-01T12:00:00.000Z');
    // const endDate = new Date('2023-12-20T14:00:00.000Z');

    const sDate = new Date(); // Current date and time
    const eDate = new Date();
    sDate.setHours(sDate.getHours() - 30); // 20 days later

    const startDate =  sDate;
    const endDate =  eDate;
      // console.log('start date' ,startDate);
      // console.log('end',endDate);

    const result = await collection.find({
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    }).toArray();
    const total_logs = await collection.aggregate([
      {
        $match: {
          timestamp: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalLogsCount: {
            $sum: '$logs_count',
          },
        },
      },
    ]).toArray();
    
    const sumOfTotalLogs = total_logs.length > 0 ? total_logs[0].totalLogsCount : 0;

    const chartData = {
      data: result, 
    };

    io.emit(eventName, chartData);
    // io.emit('total_logs_count', sumOfTotalLogs);
    // console.log("logPage Graph",chartData);
    client.close();
  } catch (error) {
    console.error(`Error fetching chart data for the past hour from MongoDB (${dbName}):`, error);
  }
};

// Example usage
// fetchChartDataPastHour('server1_clf', 'logs_count', 'emitLogsCount');




//  =========== live dashboard log graph ==========
const liveDashboardLogGraph = async (dbName, collectionName, eventName) => {
  try {
    const mongouri = 'mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority';
    const client = await MongoClient.connect(mongouri);
    // const db = dbInstance.db(dbName);
    const dbInstance = client.db(dbName);
    const collection = dbInstance.collection(collectionName);
    // const twentyFourHoursAgo = new Date();
    // const startDate = new Date('2023-12-01T12:00:00.000Z');
    // const endDate = new Date('2023-12-20T14:00:00.000Z');

    const sDate = new Date(); // Current date and time
    const eDate = new Date();
    sDate.setDate(sDate.getDate() - 0.5); // 20 days later

    const startDate =  sDate;
    const endDate =  eDate;
    
    // twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    // const startDate = twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);;
    // const endDate = twentyFourHoursAgo;

    const result = await collection.find({
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    }).toArray();
    // this is the request count in live dashboard
    const total_logs = await collection.aggregate([
      {
        $match: {
          timestamp: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalLogsCount: {
            $sum: '$logs_count',
          },
        },
      },
    ]).toArray();
    
    const sumOfTotalLogs = total_logs.length > 0 ? total_logs[0].totalLogsCount : 0;

    const chartData = {
      data: result, 
    };

    
    io.emit(eventName, chartData);
    io.emit('total_logs_count', sumOfTotalLogs);
    // io.emit('total_logs_count', sumOfTotalLogs);
    // console.log("Dashboard",chartData);
    client.close();
  } catch (error) {
    console.error(`Error fetching chart data for the past hour from MongoDB (${dbName}):`, error);
  }
};

// setInterval(() => {
//   liveDashboardLogGraph('server1_clf', 'logs_count', 'request');
  
// }, 5000);

  socket.on('disconnect', () => {
    // console.log('User disconnected');
  });
});




//  =========== top 5 IP's ==============
// Connect to the server using socket.io
// io.on('connection', async (socket) => {
//   try {
//     console.log('New client connected');
//     // Your MongoDB connection details
//     const mongouri = 'mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority';
//     const client = await MongoClient.connect(mongouri);
    
//     // Your MongoDB database and collection details
//     const dbInstance = client.db('server1_clf');
//     const logsCollection = dbInstance.collection('basic_data');

//     // Date range for fetching data from 2023 until the future available date
//     const startOf2023 = new Date('2007-12-01T00:00:00.000Z');
//     const endOfFuture = new Date('2043-12-31T00:00:00.000Z');

//     // Aggregate to count the occurrences of each IP address
//     const pipeline = [
//       {
//         $match: {
//           ds: {
//             $gte: startOf2023,
//             $lte: endOfFuture,
//           },
//         },
//       },
//       {
//         $group: {
//           _id: '$ip_address',
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $sort: { count: -1 },
//       },
//       {
//         $limit: 5,
//       },
//     ];

//     const topIPs = await logsCollection.aggregate(pipeline).toArray();

//     // Emit top IPs to the connected client
//     socket.emit('topIPs', topIPs);
//     console.log('Top IPs sent to the connected client');

//     // Close the MongoDB connection when done
//     client.close();
//   } catch (error) {
//     console.error(error);
//     // Emit an error event to the connected client
//     socket.emit('error', { message: 'Internal Server Error' });
//   }
// });

server.listen(3001, async () => {

  console.log('Server is listening on port 3001');
  var DatasetInterval;
  try {
    io.on('connection', async (socket) => {
      const server_name=socket.handshake.query.name;
    await connectToDatabases();
     DatasetInterval=setInterval(() => {
     async function fetchAll(server_name,fdata){
      let findata={};
      for (const [dbName, cdata] of Object.entries(fdata)) {
        const db = dbInstance.db(dbName);
        for(let i=0;i<cdata.length;i++){
          let cval = cdata[i]
          const logsCollection = db.collection(cval[0]);
          host_query = dbName == "machine_info"? {"tags.host":server_name} : {"hostname":server_name}
          const logDataValue = await logsCollection.findOne(host_query, { sort: { timestamp: -1 } });
          if(typeof(cval[1])!="string"){
            let subdata = {};
            for(let j=0;j<cval[1].length;j++){
              subdata[cval[1][j]]=logDataValue[cval[1][j]];
            }
            findata[cval[0]]=subdata;
          }
          else {
            findata[cval[0]]=logDataValue[cval[1]];
          }
          
        }
      }
      console.log("fin",server_name,findata);
      io.emit("all_metrices", findata);
      // try {
      //   for(let i=0;i<cdata.length;i++){
      //     cName=cdata[i];
      //     const logsCollection = db.collection(cName);
      //     const logDataValue = await logsCollection.findOne({"hostname":server_name}, { sort: { timestamp: -1 } });
      //     if(typeof(edata[i])!="string"){
      //       let subdata = {};
      //       for(let j=0;j<edata[i].length;j++){
      //         subdata[edata[i][j]]=logDataValue[edata[i][j]];
      //       }
      //       findata[cName]=subdata;
      //     }
      //     else{
      //       findata[cName]=logDataValue[edata[i]];
      //     // console.log("Check",logDataValue,edata[i]);
      //     }
      //   }
      //   console.log("Data",findata);
      //   // console.log("Got data from MongoDB "+dbName+":", logDataValue);
      //   io.emit("all_metrices", findata);
      // } catch (error) {
      //   console.error("Error fetching data from MongoDB (${dbName}):", error);
      // }
    };

    // fetchAll("telegraf",["cpu"],["usage_user"]);
   
    // fetchAll(server_name,"log_analysis",["cpu_usage","total_stars","virtual_memory","vulnerabilities","operating_systems_info_security"],["cpu_percent","total_stars","virtual_memory_info",["Date","CVE","KB","Title","AffectedProduct","AffectedComponent","Severity","Impact","Exploit"],["Name","Generation","Build","Version","Architecture","Installed_hotfixes"]]);
    fetchAll(server_name,{"machine_info":[["cpu","usage_system"],["mem","used_percent"]],"log_analysis":[["total_stars","total_stars"],["vulnerabilities",["Date","CVE","KB","Title","AffectedProduct","AffectedComponent","Severity","Impact","Exploit"]],["operating_systems_info_security",["Name","Generation","Build","Version","Architecture","Installed_hotfixes"]]]})
      // Fetch data from MongoDB
    //    fetchDataAndEmitLast("telegraf", "cpu", "cpugraf");
    // fetchDataAndEmitLast("log_analysis", "total_stars", "total_stars",server_name);
    // fetchDataAndEmitCount("log_analysis","")
    //    fetchDataAndEmitLast("server1_clf", "cpu_usage", "cpuUsage");
    //    fetchDataAndEmitLast("server1_clf", "memory_usage", "memoryUsage");
    }, 5000);
    // setupChangeStreamCount('server1_clf', 'basic_data', 'request');
    //  await fetchDataAndEmitCount("server1_clf", "basic_data", "request");
  
    //check and emit logtable data in sameorder
    
  
    });

    socket.on('disconnect', () => {
      console.log(`Client Disconnected: ${socket.id}`);
      clearInterval(DatasetInterval);
    });

  } catch (error) {
    console.error("Error during data fetching and emission:", error);
  }
  
});



//common error path
io.on('connection', async(socket) => {

})

// const http = require('http');
const AWS = require('aws-sdk');
// const socketIO = require('socket.io');


// AWS configuration
AWS.config.update({
  accessKeyId: 'AKIAQXZF3HZ2WZ3ZG66X',
  secretAccessKey: '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',
  region: 'eu-north-1',
});

const s3 = new AWS.S3();

// Function to list S3 objects and emit the data through Socket.IO
const listS3ObjectsAndEmit = (socket) => {
  // S3 bucket and prefix (folder) to list objects from
  const bucketName = 'log-saving-files';
  // const prefix = 'YOUR_PREFIX';

  const params = {
    Bucket: bucketName,
    // Prefix: prefix,
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.error(err);
      return socket.emit('error', 'Error listing objects');
    }

    const objects = data.Contents.map((obj) => obj.Key);

    // Emit the object list to connected clients
    console.log('data from s3',objects);
    socket.emit('objectList', objects);
  });
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected',socket.handshake.query.name);

  // Initial list of objects on connection
  // listS3ObjectsAndEmit(socket);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Handle a custom event for updating the object list
  socket.on('updateObjectList', () => {
    // Call the function to list objects and emit the updated list
    listS3ObjectsAndEmit(socket);
  });
});

// const port = 3000;
// server.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

