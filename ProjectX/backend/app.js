// const { Server } = require("socket.io");
// const http = require("http");
// const { MongoClient } = require("mongodb");


// const server = http.createServer();
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// const mongoURI =
//   "mongodb+srv://test:test@sanenomore.mteelpf.mongodb.net/?retryWrites=true&w=majority";

// const  mongo_uri1 = "mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority"

// const client = new MongoClient(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const client1 = new MongoClient(mongo_uri1, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Emit data to connected clients every second
let counter = 0;
setInterval(() => {
  counter++;
  io.emit("dataFromServer", { value: counter });
}, 1000);

// // Socket.io handling
// io.on("connection", (socket) => {
//   console.log("Client connected");

//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

// client
//   .connect()
//   .then(async () => {
//     console.log("Connected to MongoDB");
//     const db = client.db("allLogs"); // Use the name of your database
//     const logsCollection = db.collection("logs3");
//     const document = await logsCollection.findOne({});
//     console.log("Fetched document:", document);
//     // Find all documents in the collection
//     const allDocuments = await logsCollection.find({}).toArray();
//     // console.log("Found documents:", allDocuments);
//     io.emit('logData', document);
//     console.log("hello");

//     io.on("connection", (socket) => {
//       logsCollection.find().toArray((err, data) => {
//         if (err) {
//           console.error("Error fetching data from MongoDB:", err);
//         } else {
//           console.log("got to db");
//           socket.emit("logData", document);
//         }
//       });
//     });
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB 2:", err);
//   });

//   client1
//   .connect()
//   .then(async () => {
//     console.log("Connected to MongoDB 2");
//     const db2 = client1.db("server1_clf");
//     const logsCollection2 = db2.collection("basic_data");

//     // Function to fetch and emit data
//     const fetchDataAndEmit = async () => {
//       try {
//         const logDataValue = await logsCollection2.find({}).toArray();
//         console.log("Got data from MongoDB:", logDataValue);
//         io.emit("logTableDashboard", { data: logDataValue });
//       } catch (error) {
//         console.error("Error fetching data from MongoDB:", error);
//       }
//     };

//     // Initial call to fetch and emit data
//     fetchDataAndEmit();

//     // Schedule fetchDataAndEmit to run every 5 seconds
//     setInterval(fetchDataAndEmit, 5000);

//     io.on("connection", (socket) => {
//       console.log("Socket connected on the client side");
//     });
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB 2:", err);
//   });


// server.listen(3001, () => {
//   console.log("Server running on port 3001");
// });


//=============================================

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
    console.log(`Got data from MongoDB (${dbName}):`, logDataValue);
    io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error(`Error fetching data from MongoDB (${dbName}):`, error);
  }
};

const fetchDataAndEmit = async (dbName, collectionName, eventName) => {
  try {
    const db = dbInstance.db(dbName);
    const logsCollection = db.collection(collectionName);
    const logDataValue = await logsCollection.findOne();
    console.log(`Got data from MongoDB (${dbName}):`, logDataValue);
    io.emit(eventName, { data: logDataValue });
  } catch (error) {
    console.error(`Error fetching data from MongoDB (${dbName}):`, error);
  }
};

io.on('connection', async (socket) => {
  console.log(`Client Connected: ${socket.id}`);

  try {

    await connectToDatabases();

    await fetchDataAndEmitArray("server1_clf", "basic_data", "logTableDashboard");

    // await fetchDataAndEmit("server2_db", "cpu_usage", "secondTable");

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
