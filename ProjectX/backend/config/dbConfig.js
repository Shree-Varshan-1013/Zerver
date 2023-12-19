const { MongoClient } = require('mongodb');

// const mongoURI = "mongodb+srv://test:test@log1cluster.c12lwe7.mongodb.net/?retryWrites=true&w=majority";
const mongoURI="mongodb+srv://test:test@sanenomore.mteelpf.mongodb.net/?retryWrites=true&w=majority";
let clientInstance = null;

const connectToDatabase = async () => {
  try {
    if (!clientInstance) {
      const client = new MongoClient(mongoURI);
      await client.connect();
      console.log("Connected to MongoDB");
      clientInstance = client;
    }
    return clientInstance;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
};

module.exports = connectToDatabase;
