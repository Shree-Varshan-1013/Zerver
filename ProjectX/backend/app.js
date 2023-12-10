const { Server } = require("socket.io");
const http = require("http");
const { MongoClient } = require("mongodb");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const mongoURI =
  "mongodb+srv://test:test@sanenomore.mteelpf.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Emit data to connected clients every second
let counter = 0;
setInterval(() => {
  counter++;
  io.emit("dataFromServer", { value: counter });
}, 1000);

// Socket.io handling
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

client
  .connect()
  .then(async () => {
    console.log("Connected to MongoDB");
    const db = client.db("allLogs"); // Use the name of your database
    const logsCollection = db.collection("logs3");
    const document = await logsCollection.findOne({});
    console.log("Fetched document:", document);
    // Find all documents in the collection
    const allDocuments = await logsCollection.find({}).toArray();
    // console.log("Found documents:", allDocuments);

    console.log("hello");

    io.on("connection", (socket) => {
      logsCollection.find().toArray((err, data) => {
        if (err) {
          console.error("Error fetching data from MongoDB:", err);
        } else {
          console.log("got to db");
          socket.emit("logData", data);
        }
      });
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

server.listen(3001, () => {
  console.log("Server running on port 3001");
});



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

// const client = new MongoClient(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Emit data to connected clients every second
// let counter = 0;
// setInterval(() => {
//   counter = Math.random(1,100);
//   io.emit("dataFromServer", { value: counter });
// }, 3000);

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

//     console.log("hello");

//     // io.on("connection", (socket) => {
//     //   logsCollection.find().toArray((err, data) => {
//     //     if (err) {
//     //       console.error("Error fetching data from MongoDB:", err);
//     //     } else {
//     //       console.log("got to db");
//     //       socket.emit("logData", data);
//     //     }
//     //   });
//     // });
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });

// server.listen(3001, () => {
//   console.log("Server running on port 3001");
// });

// const { Server } = require("socket.io");
// const http = require("http");
// const { MongoClient } = require("mongodb");

// const server = http.createServer();
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// const mongoURI = "mongodb+srv://test:test@sanenomore.mteelpf.mongodb.net/?retryWrites=true&w=majority";

// const client = new MongoClient(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Array to store the last 12 data points
// let dataPoints = [];

// // Emit data to connected clients every second
// setInterval(() => {
//   const newRandomValue = Math.random() * 100;
//   const timestamp = Date.now();

//   // Add new data point to the array
//   dataPoints.push({
//     x: timestamp,
//     y: newRandomValue,
//   });

//   // Keep only the last 12 data points (representing the last hour with a 5-minute interval)
//   dataPoints = dataPoints.slice(-12);

//   // Emit the updated data to connected clients
//   io.emit("dataFromServer", { data: dataPoints });
// }, 3000);

// // Socket.io handling
// io.on("connection", (socket) => {
//   console.log("Client connected");

//   // Send the initial data to the client upon connection
//   socket.emit("dataFromServer", { data: dataPoints });

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

//     console.log("hello");

//     // io.on("connection", (socket) => {
//     //   logsCollection.find().toArray((err, data) => {
//     //     if (err) {
//     //       console.error("Error fetching data from MongoDB:", err);
//     //     } else {
//     //       console.log("got to db");
//     //       socket.emit("logData", data);
//     //     }
//     //   });
//     // });
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });

// server.listen(3001, () => {
//   console.log("Server running on port 3001");
// });




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

  // const client = new MongoClient(mongoURI, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  // // Array to store the last 12 data points
  // let dataPoints = [];

  // // Emit data to connected clients every second
  // setInterval(() => {
  //   const newRandomValue = Math.random() * 100;
  //   const timestamp = Date.now();

  //   // Add new data point to the array
  //   dataPoints.push({
  //     x: timestamp,
  //     y: newRandomValue,
  //   });

  //   // Keep only the last 12 data points (representing the last hour with a 5-minute interval)
  //   dataPoints = dataPoints.slice(-12);

  //   // Emit the updated data to connected clients
  //   io.emit("dataFromServer", { data: dataPoints });
  // }, 3000);

  // // Socket.io handling
  // io.on("connection", (socket) => {
  //   console.log("Client connected");

  //   // Send the initial data to the client upon connection
  //   socket.emit("dataFromServer", { data: dataPoints });

  //   socket.on("disconnect", () => {
  //     console.log("Client disconnected");
  //   });
  // });

  // client
  //   .connect()
  //   .then(() => {
  //     console.log("Connected to MongoDB");
  //     const db = client.db("allLogs");
  //     const logsCollection = db.collection("logs3");

  //     // Add MongoDB data fetching logic here if needed

  //   })
  //   .catch((err) => {
  //     console.error("Error connecting to MongoDB:", err);
  //   });

  // server.listen(3001, () => {
  //   console.log("Server running on port 3001");
  // });
