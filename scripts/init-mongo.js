// scripts/init-mongo.js
const { MongoClient } = require('mongodb');

async function init() {
  const url = process.env.MONGO_URL || 'mongodb://mongo:27017/gymdb';
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(); // Esto usa la base de datos definida en la URL
    const collections = await db.listCollections({ name: 'exercises' }).toArray();

    if (collections.length === 0) {
      console.log('Creando colección exercises...');
      await db.createCollection('exercises');
      console.log('Colección exercises creada.');
    } else {
      console.log('Colección exercises ya existe.');
    }
  } catch (err) {
    console.error('Error al inicializar MongoDB:', err);
  } finally {
    await client.close();
  }
}

init();
