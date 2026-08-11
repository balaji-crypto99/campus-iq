const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_iq';

  try {
    // Set connection timeouts for fast failover to memory server if local Mongo DB is absent
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] Connected to MongoDB at ${primaryUri}`);
  } catch (error) {
    console.warn(`[Database] Could not connect to primary MongoDB (${primaryUri}): ${error.message}`);
    console.log('[Database] Initializing In-Memory MongoDB Server fallback...');

    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to In-Memory MongoDB Server at ${memUri}`);
    } catch (memErr) {
      console.error('[Database] Fatal: In-memory MongoDB failed to initialize', memErr);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
