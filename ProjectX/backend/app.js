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

const connectToDatabases = async () => {
  try {
    // Establish a single database connection
    if (!dbInstance) {
      dbInstance = await dbConnect();
    }
    return dbInstance;
  } catch (error) {
    console.error("Error establishing or using the database connection:", error);
    throw error;
  }
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

// const setupChangeStream = async (dbName, collectionName, eventName) => {
//   const db = dbInstance.db(dbName);
//   const collection = db.collection(collectionName);

//   const changeStream = collection.watch();

//   changeStream.on('change', (change) => {
//     // console.log('Change detected:', change);
//     fetchDataAndEmitReverseArray(dbName, collectionName, eventName); // Fetch and emit updated data
//   });

//   changeStream.on('error', (error) => {
//     console.error('Change stream error:', error);
//   });
// };
const setupChangeStreamArray = async (dbName, collectionName, eventName) => {
  const db = dbInstance.db(dbName);
  const collection = db.collection(collectionName);

  const changeStream = collection.watch();

  changeStream.on('change', (change) => {
    // console.log('Change detected:', change);
    fetchDataAndEmitArray(dbName, collectionName, eventName); // Fetch and emit updated data
  });

  changeStream.on('error', (error) => {
    console.error('Change stream error:', error);
  });
};

const setupChangeStreamLast = async (dbName, collectionName, eventName) => {
  const db = dbInstance.db(dbName);
  const collection = db.collection(collectionName);

  const changeStream = collection.watch();

  changeStream.on('change', (change) => {
    // console.log('Change detected:', change);
    fetchDataAndEmitLast(dbName, collectionName, eventName); // Fetch and emit updated data
  });

  changeStream.on('error', (error) => {
    console.error('Change stream error:', error);
  });
};
const fetchDataAndEmit = async (dbName, collectionName, eventName) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);
    const logDataValue = await logsCollection.findOne();
    // console.log("Got data from MongoDB (${dbName}):", logDataValue);
    io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error("Error fetching data from MongoDB (${dbName}):", error);
  }
};

const fetchDataAndEmitLast = async (dbName, collectionName, eventName) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);
    const logDataValue = await logsCollection.findOne({}, { sort: { timestamp: -1 } });
    console.log("Got data from MongoDB "+dbName+":", logDataValue);
    io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error("Error fetching data from MongoDB (${dbName}):", error);
  }
};

const fetchDataAndEmitArrayLimit = async (dbName, collectionName, eventName, limit = 7) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);

    // Use the limit method to fetch the first 'limit' documents
    const logDataValue = await logsCollection.find().limit(limit).toArray();

    // console.log("Got data from 7 (${dbName}):", logDataValue);
    io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error("Error fetching data from MongoDB (${dbName}):", error);
  }
};
const fetchDataByCompareIp = async (dbName, collectionName, eventName, ip) => {
  try {
    const db = dbInstance.db(dbName);
    const ipData = db.collection(collectionName);

    const result = await ipData.findOne({ ip_address: ip }, { sort: { timestamp: -1 } });

    io.emit(eventName, { data: result });
  } catch (error) {
    console.error("Error fetching data from MongoDB (${dbName}):", error);
  }
};

const fetchDataAndEmitArrayCount = async (dbName, collectionName, eventName) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);

    // Use the countDocuments method to get the total count of documents in the collection
    const dataSize = await logsCollection.countDocuments();

    // console.log(`Got data count from ${dbName}:`, dataSize);

    io.emit(eventName, { count: dataSize });
  } catch (error) {
    console.error(`Error fetching data count from MongoDB (${dbName}):`, error);
  }
};

io.on('connection', async (socket) => {
  // console.log(`Client Connected: ${socket.id}`);

  socket.on("getDBName", (dbName) => {
    console.log("database name " + dbName);
  })

  var res = null;
  socket.on("getServer", async (server) => {
    res = await checkDatabaseExistence("mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority", server);
    io.emit("getResponse", res);
  })

  socket.on('checkIp', async (ip) => {
    // console.log(ip + "==== ip")
    const res = await fetchDataByCompareIp("server1_clf", "ip_status", "ipStatus", ip)  
    io.emit('ipStatus', res);
  }
);

let notificationsFetched = false;

// setupChangeStream('server1_clf', 'basic_data', 'logTableDashboard');
  await fetchDataAndEmitReverseArray("server1_clf", "basic_data", "logTableDashboardReverse");
  // setupChangeStream('server1_clf', 'basic_data', 'logTableDashboardReverse');
  // setupChangeStreamLast("telegraf","cpu","cpugraf");
  // await fetchDataAndEmitLast("server1_clf", "summary", "summaryData");
  // await fetchDataAndEmit("server2_db", "cpu_usage", "secondTable");
  await fetchDataAndEmit("server1_clf", "operating_systems_info_security", "operatingSystem");
  await fetchDataAndEmit("server1_clf", "vulnerabilities_count_security", "vCount");
  await fetchDataAndEmit("server1_clf", "vulnerabilities", "vData");
  await fetchDataAndEmitArrayLimit("server1_clf", "vulnerabilities_count_security", "vLimit");

  // await fetchDataAndEmitLast("server1_clf", "virtual_memory", "virtualMemory");
  await fetchDataAndEmitArray("server1_clf", "memory_usage", "memoryArray");
  await fetchDataAndEmitArray("server1_clf", "cpu_usage", "cpuArray");
  // await fetchDataAndEmitLast("server1_clf", "cost_estimation_forecast", "costEstimation");
  // await fetchDataAndEmitLast("server1_clf", "daily_users_forecast", "userForecast");
  // await fetchDataAndEmitLast("server1_clf", "logs_estimation_forecast", "logEstimation");
  await fetchDataAndEmitArray("69571Web", "dual_graph", "twoArray");
  // await fetchDataAndEmitLast("telegraf", "cpu", "cpugraf");
  await fetchDataAndEmitArray("server1_clf", "status_codes", "status_code");
  if (!notificationsFetched) {
    await fetchDataAndEmitReverseArrayNotification("server1_clf", "notifications", "getNotifications");
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

const setupChangeStreamCount = async (dbName, collectionName, eventName) => {
  const db = dbInstance.db(dbName);
  const collection = db.collection(collectionName);

  const changeStream = collection.watch();

  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      documentsAddedCount += 1;
    }
  });
};



// ============ip Analysis data =============
io.on("connection", (socket) => {
  // console.log("Socket connected:", socket.id);

  socket.on("fetchChartData", async (data) => {
    const { ipAddress } = data;
    try {
      const mongouri = 'mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority';
      const client = await MongoClient.connect(mongouri);

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
    const mongouri = 'mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority';
    const client = await MongoClient.connect(mongouri);
    const dbInstance = client.db('server1_clf');
    const collection = dbInstance.collection('cost_estimation_forecast');

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
    console.log('labels',labels);
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
    io.emit('total_logs_count', sumOfTotalLogs);
    // console.log("logPage Graph",chartData);
    client.close();
  } catch (error) {
    console.error(`Error fetching chart data for the past hour from MongoDB (${dbName}):`, error);
  }
};

// Example usage
fetchChartDataPastHour('server1_clf', 'logs_count', 'emitLogsCount');




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
    sDate.setDate(sDate.getDate() - 20); // 20 days later

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
    
    // const sumOfTotalLogs = total_logs.length > 0 ? total_logs[0].totalLogsCount : 0;

    const chartData = {
      data: result, 
    };

    
    io.emit(eventName, chartData);
    // io.emit('total_logs_count', sumOfTotalLogs);
    // console.log("Dashboard",chartData);
    client.close();
  } catch (error) {
    console.error(`Error fetching chart data for the past hour from MongoDB (${dbName}):`, error);
  }
};

liveDashboardLogGraph('server1_clf', 'logs_count', 'request');

  socket.on('disconnect', () => {
    // console.log('User disconnected');
  });
});




//  =========== top 5 IP's ==============
// Connect to the server using socket.io
io.on('connection', async (socket) => {
  try {
    console.log('New client connected');
    // Your MongoDB connection details
    const mongouri = 'mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority';
    const client = await MongoClient.connect(mongouri);
    
    // Your MongoDB database and collection details
    const dbInstance = client.db('server1_clf');
    const logsCollection = dbInstance.collection('basic_data');

    // Date range for fetching data from 2023 until the future available date
    const startOf2023 = new Date('2007-12-01T00:00:00.000Z');
    const endOfFuture = new Date('2043-12-31T00:00:00.000Z');

    // Aggregate to count the occurrences of each IP address
    const pipeline = [
      {
        $match: {
          ds: {
            $gte: startOf2023,
            $lte: endOfFuture,
          },
        },
      },
      {
        $group: {
          _id: '$ip_address',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ];

    const topIPs = await logsCollection.aggregate(pipeline).toArray();

    // Emit top IPs to the connected client
    socket.emit('topIPs', topIPs);
    console.log('Top IPs sent to the connected client');

    // Close the MongoDB connection when done
    client.close();
  } catch (error) {
    console.error(error);
    // Emit an error event to the connected client
    socket.emit('error', { message: 'Internal Server Error' });
  }
});

server.listen(3001, async () => {
  console.log('Server is listening on port 3001');
  try {

    await connectToDatabases();
    setInterval(() => {
     async function fetchAll(dbName, cdata,edata){
      try {
        const db = dbInstance.db(dbName);
        data={};
        for(let i=0;i<cdata.length;i++){
          cName=cdata[i];
          const logsCollection = db.collection(cName);
          const logDataValue = await logsCollection.findOne({}, { sort: { timestamp: -1 } });
          data[cName]=logDataValue[edata[i]];
          console.log("Check",logDataValue,edata[i]);
        }
        console.log("Data",data);
        // console.log("Got data from MongoDB "+dbName+":", logDataValue);
        io.emit("all_metrices", data);
      } catch (error) {
        console.error("Error fetching data from MongoDB (${dbName}):", error);
      }
    };
    // fetchAll("telegraf",["cpu"],["usage_user"]);
    fetchDataAndEmitArrayCount("server1_clf", "error_logs", "error_count");
   
      fetchAll("server1_clf",["cpu_usage","total_stars","memory_usage","summary","virtual_memory","vulnerabilities"],["cpu_percent","total_stars","percent_used","summary","virtual_memory_info","Date"]);
      // Fetch data from MongoDB
    //    fetchDataAndEmitLast("telegraf", "cpu", "cpugraf");
    //    fetchDataAndEmitLast("server1_clf", "total_stars", "totalStars");
    //    fetchDataAndEmitLast("server1_clf", "cpu_usage", "cpuUsage");
    //    fetchDataAndEmitLast("server1_clf", "memory_usage", "memoryUsage");
    }, 5000);
    // setupChangeStreamCount('server1_clf', 'basic_data', 'request');
    //  await fetchDataAndEmitCount("server1_clf", "basic_data", "request");
  
    //check and emit logtable data in sameorder
    
  
  
  } catch (error) {
    console.error("Error during data fetching and emission:", error);
  }
  
});

