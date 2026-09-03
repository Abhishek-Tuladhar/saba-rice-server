const mongoose = require("mongoose");

// Cache the connection across serverless invocations (Vercel reuses the
// module scope / global object between warm invocations of the same
// function instance, so this avoids reconnecting on every request).
let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log("MongoDB Connected...");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so the next request gets a fresh attempt instead of being
    // stuck on a rejected promise forever.
    cached.promise = null;
    console.error("Error connecting to MongoDB:", err.message);
    throw err;
  }

  return cached.conn;
};

module.exports = connectDB;
