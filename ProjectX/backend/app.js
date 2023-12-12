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
    console.log("Got data from MongoDB (${dbName}):", logDataValue);
    io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error("Error fetching data from MongoDB (${dbName}):", error);
  }
};

const fetchDataAndEmit = async (dbName, collectionName, eventName) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);
    const logDataValue = await logsCollection.findOne();
    console.log("Got data from MongoDB (${dbName}):", logDataValue);
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
    
    console.log("Got data from 7 (${dbName}):", logDataValue);
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

  try {

    await connectToDatabases();
   //DB FETCHES
    await fetchDataAndEmitArray("server1_clf", "basic_data", "logTableDashboard");
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

const check = async () => {
  const list = await checkDatabaseExistence("mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority", "sasad");
  console.log(list);
}
check();


server.listen(3001, () => {
  console.log('Server is listening on port 3001');
});