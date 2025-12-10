const mongoose = require("mongoose");

let isConnected = false;

async function connectDB(retries = 5, delayMs = 1500) {
  if (isConnected) return mongoose.connection;

  const uri = process.env.MONGO_URI || process.env.DB_URI;
  if (!uri) throw new Error("Missing MONGO_URI or DB_URI in environment");

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(uri, {
        dbName: process.env.MONGO_DB || undefined,
        maxPoolSize: Number(process.env.MONGO_MAX_POOL || 10),
        serverSelectionTimeoutMS: 10000,
      });
      isConnected = true;
      console.log(`✔ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
      mongoose.connection.on("error", (err) => console.error("Mongo error:", err));
      mongoose.connection.on("disconnected", () => {
        isConnected = false;
        console.warn("Mongo disconnected");
      });
      return mongoose.connection;
    } catch (err) {
      console.error(`Mongo connect attempt ${attempt} failed:`, err.message);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

module.exports = connectDB;
