import mongoose from "mongoose";

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return mongoose.connections[0].getClient(); // Return the native client if already connected
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB");
    return db.connection.getClient(); // Return the native client on successful connection
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

export default dbConnect;
