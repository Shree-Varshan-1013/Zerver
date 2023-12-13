const { MongoClient } = require('mongodb');

const checkDatabaseExistence = async (mongoURI, dbNameToCheck) => {
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();
    const adminDb = client.db('admin'); // Use the admin database to list databases
    const databaseList = await adminDb.admin().listDatabases();
    console.log(databaseList);
    const exists = databaseList.databases.some((db) => db.name === dbNameToCheck);

    return exists;
  } catch (error) {
    console.error('Error checking database existence:', error);
    throw error;
  } finally {
    await client.close();
  }
};

module.exports = checkDatabaseExistence;