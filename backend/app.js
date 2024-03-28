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

const fetchDataAndEmitReverseArray = async (dbName, collectionName, eventName,server_name) => {
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
console.log(result);
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
const setupChangeStream = async (dbName, collectionName, eventName,server_name) => {
  try{
  const db = dbInstance.db(dbName);
  const collection = db.collection(collectionName);

  const changeStream = collection.watch();

  changeStream.on('change', (change) => {
    console.log('Change detected:', change);
    // fetchDataAndEmitReverseArray(dbName, collectionName, eventName); // Fetch and emit updated data
  });

  changeStream.on('error', (error) => {
    console.error('Change stream error:', error);
  });
}catch (error){
  console.error(`Change stream (${dbName}):`, error);
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
    const res = await fetchDataByCompareIp("log_analysis", "ip_status", "ipStatus", ip)  
    io.emit('ipStatus', res);
  }
);
let notificationsFetched = false;
let server_name=socket.handshake.query.name;
// setupChangeStream('server1_clf', 'basic_data', 'logTableDashboard');
  await fetchDataAndEmitReverseArray("log_analysis", "basic_data", "logTableDashboardReverse",server_name);
  setupChangeStream("log_analysis", "basic_data", "logTableDashboardReverse",server_name);
  // setupChangeStreamLast("telegraf","cpu","cpugraf");
// await fetchChartDataPastHour('log_analysis', 'logs_count', 'emitLogsCount',server_name);
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

//  ========== user forecast ===========

io.on('connection', async (socket) => {
  // console.log(`Client Connected to userforecast: ${socket.id}`);

  try {

    const server_name=socket.handshake.query.name;
    const db = dbInstance.db("log_analysis");
    const collection = db.collection('cost_estimation_forecast');
    // const logsCollection = db.collection();
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
          Yhat: "$yhat",
          "hostname":server_name
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

  
  } catch (error) {
    console.error("Error during data fetching and emission:", error);
  }
});

//  ========== logs and Users count =============
io.on('connection', async (socket) => {
  socket.on('requestUserAndLogsForecast', async () => {
    try {
    
      const server_name=socket.handshake.query.name;
      const db = dbInstance.db('log_analysis');
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
        "hostname":server_name,
        ds: {
          $gte: startOf2023,
          $lte: endOfFuture,
        }
      }).toArray();
      socket.emit('userAndLogsForecast', { userForecast: userData, logsForecast: logData });
    
    } catch (error) {
      console.error(error);
      socket.emit('error', { message: 'Internal Server Error' });
    }
  });


//  ========== log graph at logs page value ======= 

// function formatDate(date) {
//   const year = date.getUTCFullYear();
//   const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
//   const day = date.getUTCDate().toString().padStart(2, '0');
//   const hours = date.getUTCHours().toString().padStart(2, '0');
//   const minutes = date.getUTCMinutes().toString().padStart(2, '0');
//   const seconds = date.getUTCSeconds().toString().padStart(2, '0');
//   const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');

//   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`;
// }

// const fetchChartDataPastHour = async (dbName, collectionName, eventName,server_name) => {
//   try {
    
 
//       const db = dbInstance.db(dbName);
//       const collection = db.collection(collectionName);
//     // const startDate = new Date('2023-12-01T12:00:00.000Z');
//     // const endDate = new Date('2023-12-20T14:00:00.000Z');

//     const sDate = new Date(); // Current date and time
//     const eDate = new Date();
//     sDate.setHours(sDate.getHours() - 10); // 20 days later

//     const startDate =  sDate;
//     const endDate =  eDate;
//       // console.log('start date' ,startDate);
//       // console.log('end',endDate);

//     const result = await collection.find({
//       "hostname":server_name,
//       timestamp: {
//         $gte: startDate,
//         $lte: endDate,
//       },
//     }).toArray();
//     // const total_logs = await collection.aggregate([
//     //   {
//     //     $match: {
//     //       "hostname":server_name,
//     //       timestamp: {
//     //         $gte: startDate,
//     //         $lte: endDate,
//     //       },
//     //     },
//     //   },
//     //   {
//     //     $group: {
//     //       _id: null,
//     //       totalLogsCount: {
//     //         $sum: '$logs_count',
//     //       },
//     //     },
//     //   },
//     // ]).toArray();
    
    

//     const chartData = {
//       data: result, 
//     };

//     io.emit(eventName, chartData);
//     // io.emit('total_logs_count', sumOfTotalLogs);
//     // console.log("logPage Graph",chartData);
    
//   } catch (error) {
//     console.error(`Error fetching chart data for the past hour from MongoDB (${dbName}):`, error);
//   }
// };

// Example usage

  socket.on('disconnect', () => {
    // console.log('User disconnected');
  });
});


//  =========== live dashboard log graph ==========
async function  liveDashboardLogGraph(dbName, collectionName, eventName){
  try {

    // const db = dbInstance.db(dbName);
    const db = dbInstance.db(dbName);
      const collection = db.collection(collectionName);
    // const twentyFourHoursAgo = new Date();
    // const startDate = new Date('2023-12-01T12:00:00.000Z');
    // const endDate = new Date('2023-12-20T14:00:00.000Z');

    const sDate = new Date(); // Current date and time
    const eDate = new Date();
    sDate.setDate(sDate.getDate() - 0.05);

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
    const total_logs=result.length;
    

    const chartData = {
      data: result, 
    };

    
    io.emit(eventName, chartData);
    io.emit('total_logs_count', total_logs);

  } catch (error) {
    console.error(`Error fetching chart data for the past hour from MongoDB (${dbName}):`, error);
  }
};
liveDashboardLogGraph('log_analysis', 'logs_count', 'request');


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
  var dints = {};
  try {
    io.on('connection', async (socket) => {
      const server_name=socket.handshake.query.name;
    await connectToDatabases();
    if(!dints.hasOwnProperty(server_name)){
     dints[server_name] = setInterval(() => {
     async function fetchAll(server_name,fdata){
      let findata={};
      for (const [dbName, cdata] of Object.entries(fdata)) {
        const db = dbInstance.db(dbName);
        for(let i=0;i<cdata.length;i++){
          let cval = cdata[i]
          const logsCollection = db.collection(cval[0]);
          host_query = dbName == "machine_info"? {"tags.host":server_name} : {"hostname":server_name}
          const logDataValue = await logsCollection.findOne(host_query, { sort:{timestamp:1} });
          if(!logDataValue) return
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
    fetchAll(server_name,{"machine_info":[["cpu","usage_system"],["mem",["available_percent","used_percent"]]],"log_analysis":[["total_stars","total_stars"],["vulnerabilities",["Date","CVE","KB","Title","AffectedProduct","AffectedComponent","Severity","Impact","Exploit"]],["operating_systems_info_security",["Name","Generation","Build","Version","Architecture","Installed_hotfixes"]]]})
    // fetchAll(server_name,{"machine_info":[["cpu","usage_system"],["mem",["available_percent","used_percent"]]]});
      // Fetch data from MongoDB
    //    fetchDataAndEmitLast("telegraf", "cpu", "cpugraf");
    // fetchDataAndEmitLast("log_analysis", "total_stars", "total_stars",server_name);
    // fetchDataAndEmitCount("log_analysis","")
    //    fetchDataAndEmitLast("server1_clf", "cpu_usage", "cpuUsage");
    //    fetchDataAndEmitLast("server1_clf", "memory_usage", "memoryUsage");
    }, 5000);

  }
    // setupChangeStreamCount('server1_clf', 'basic_data', 'request');
    //  await fetchDataAndEmitCount("log_analysis", "logs_count", "request");
  
    //check and emit logtable data in sameorder
    
  
    });

    socket.on('disconnect', () => {
      console.log(`Client Disconnected: ${socket.id}`);
      clearInterval(dints[server_name]);
      dints.delete(server_name)
    });

  } catch (error) {
    console.error("Error during data fetching and emission:", error);
  }
  
});



//common error path


// Versioning S3
const AWS = require('aws-sdk');
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
  // Handle a custom event for updating the object list
  socket.on('updateObjectList', () => {
    // Call the function to list objects and emit the updated list
    listS3ObjectsAndEmit(socket);
  });
});


