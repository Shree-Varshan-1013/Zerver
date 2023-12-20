  const http = require('http');
  const { Server } = require('socket.io');
  const { MongoClient } = require('mongodb');
  const cors = require('cors');
  const express = require('express');
  const app = express();
  const fs = require('fs');
  const readline = require('readline');   

  const dbConnect = require('./config/dbConfig');
  const checkDatabaseExistence = require('./config/checkDatabase');

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  app.use(cors());

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

  const AWS = require('aws-sdk');
  // const socketIO = require('socket.io');


  // AWS configuration
  AWS.config.update({
    accessKeyId: 'AKIAQXZF3HZ2WZ3ZG66X',
    secretAccessKey: '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',
    region: 'eu-north-1',
  });

  const s3 = new AWS.S3();

  const s4 = new AWS.S3();

  app.get('/api/getFileData', (req, res) => {
    const fileName = req.query.fileName;
    
    // Parameters for the S3 getObject operation
    const params = {
      Bucket: 'downloadfileshis',
      Key: fileName,
    };
  
    // Fetch the file data from S3
    const s3Stream = s4.getObject(params).createReadStream();
  
    const fileDataLines = []; // Array to store lines
  
    const rl = readline.createInterface({
      input: s3Stream,
      crlfDelay: Infinity, // Treats each line as a separate event
    });
  
    rl.on('line', (line) => {
      console.log('Line:', line);
      fileDataLines.push(line);
    });
  
    rl.on('close', () => {
      // Send the file data lines as a JSON response
      res.json({ fileDataLines });
    });
  
    rl.on('error', (err) => {
      console.error('Error reading file from S3:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });
  
  app.get('/api/downloadS3File', (req, res) => {
    const fileName = req.query.fileName;
  
    // Specify your S3 bucket name
    const bucketName = 'downloadfileshis';
  
    // Set the appropriate headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/octet-stream');
  
    // Create a read stream from the S3 object and pipe it to the response
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };
  
    s3.getObject(params)
      .createReadStream()
      .pipe(res);
  });

  // Function to list S3 objects and emit the data through Socket.IO
  const listS3ObjectsAndEmit = (socket) => {
    // S3 bucket and prefix (folder) to list objects from
    const bucketName = 'downloadfileshis';
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
    console.log('A user connected');

    // Initial list of objects on connection
    listS3ObjectsAndEmit(socket);

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    // Handle a custom event for updating the object list
    socket.on('updateObjectList', () => {
      // Call the function to list objects and emit the updated list
      listS3ObjectsAndEmit(socket);
    });
  });

  server.listen(3001, () => {
    console.log('Server is listening on port 3001');
  });

