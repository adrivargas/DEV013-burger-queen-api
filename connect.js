const { MongoClient } = require('mongodb');
const config = require('./config');

async function connect() {
  const { dbUrl } = config;

  try {
    // Crear un nuevo cliente de MongoDB
    const client = new MongoClient(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

    // Conectar al cliente
    await client.connect();

    console.log('Conexión a la base de datos establecida.');

    // Devolver el objeto de la base de datos
    return client.db("prueba");
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    throw error; // Re-lanzar el error para que sea manejado por el código que llama a esta función
  }
}

module.exports = { connect };



