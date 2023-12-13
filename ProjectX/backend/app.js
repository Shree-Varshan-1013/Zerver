const http = require('http');
const { Server } = require('socket.io');
const dbConnect = require('./config/dbConfig');
const checkDatabaseExistence = require('./config/checkDatabase');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

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
    
    // console.log(`Got data from MongoDB (${dbName}):`, logDataValue);
    io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error(`Error fetching data from MongoDB (${dbName}):`, error);
  }
};

const setupChangeStream = async (dbName, collectionName, eventName) => {
  const db = dbInstance.db(dbName);
  const collection = db.collection(collectionName);

  const changeStream = collection.watch();

  changeStream.on('change', (change) => {
    // console.log('Change detected:', change);
    fetchDataAndEmitReverseArray(dbName, collectionName, eventName); // Fetch and emit updated data
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
    // console.log("Got data from MongoDB (${dbName}):", logDataValue);
    io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error("Error fetching data from MongoDB (${dbName}):", error);
  }
};

const fetchDataAndEmitArrayLimit = async (dbName, collectionName, eventName, limit=7) => {
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

io.on('connection', async (socket) => {
  console.log(`Client Connected: ${socket.id}`);

  socket.on("getDBName", (dbName) => {
    console.log("database name " + dbName);
  })

  var res = null;
  socket.on("getServer", async (server) => {
    res = await checkDatabaseExistence("mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority", server);
    io.emit("getResponse", res);
  })


  try {

    await connectToDatabases();
   //DB FETCHES

   // total request and changes in graph
   setupChangeStreamCount('server1_clf', 'basic_data', 'request');
  //  await fetchDataAndEmitCount("server1_clf", "basic_data", "request");

   //check and emit logtable data in sameorder
    // setupChangeStream('server1_clf', 'basic_data', 'logTableDashboard');
    // await fetchDataAndEmitReverseArray("server1_clf", "basic_data", "logTableDashboardReverse");
    // setupChangeStream('server1_clf', 'basic_data', 'logTableDashboardReverse');
    // await fetchDataAndEmitLast("server1_clf", "summary", "summaryData");
    // await fetchDataAndEmit("server2_db", "cpu_usage", "secondTable");
    await fetchDataAndEmit("server1_clf", "operating_systems_info_security", "operatingSystem");
    await fetchDataAndEmit("server1_clf", "vulnerabilities_count_security", "vCount");
    await fetchDataAndEmit("server1_clf", "vulnerabilities", "vData");
    await fetchDataAndEmitArrayLimit("server1_clf", "vulnerabilities_count_security", "vLimit");
    await fetchDataAndEmitArray("server1_clf", "total_stars", "totalStars");
    await fetchDataAndEmitArray("server1_clf", "cpu_usage", "cpuUsage");
    await fetchDataAndEmitArray("server1_clf", "memory_usage", "memoryUsage");


  } catch (error) {
    console.error("Error during data fetching and emission:", error);
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

    // console.log(`Got data from MongoDB (${dbName}):`, logDataValue);

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
    console.log('Change detected:', change);

    // Increment the count when a document is added
    if (change.operationType === 'insert') {
      documentsAddedCount += 1;
    }
  });
};

// Use setInterval to fetch and emit count every second
setInterval(() => {
  // fetchDataAndEmitCount('server1_clf', 'basic_data', 'request');
}, 1000); // Fetch and emit count every second


server.listen(3001, () => {
  console.log('Server is listening on port 3001');
});
