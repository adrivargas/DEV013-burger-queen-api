
const { MongoClient } = require('mongodb');
const config = require("./config");

const client = new MongoClient(config.dbUrl);

async function connect() {
  try {
    await client.connect();
    const db = client.db("burguerapi"); // Reemplaza <NOMBRE_DB> por el nombre del db
    return db;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    throw error; // Re-lanzar el error para que sea manejado por el código que llama a esta función
  }
}

module.exports = { connect };



