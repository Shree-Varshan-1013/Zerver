const { MongoClient } = require('mongodb');

const checkDatabaseExistence = async (dbInstance,sName) => {

    console.log("Hello");
    const sDb = dbInstance.db('servers'); // Use the admin database to list databases
    const databaseList = await sDb.collection("server_list");
    var cursor = databaseList.find({ "hostname": sName });
    // console.log(cursor);
    // console.log(databaseList);
    // const exists = databaseList.databases.some((db) => db.name === dbNameToCheck);
    // console.log("Cursor",cursor.hasNext());
    return cursor.hasNext();
};

module.exports = checkDatabaseExistence;