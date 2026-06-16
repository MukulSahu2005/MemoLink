import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";      //

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    const dbNameEncoded = encodeURIComponent(DB_NAME);
    let connectionString = uri;

    if (uri.includes("?")) {
      const parts = uri.split("?");
      const part0 = parts[0] || "";
      const query = parts[1] || "";
      const baseUri = part0.endsWith("/") ? part0 : `${part0}/`;
      connectionString = `${baseUri}${dbNameEncoded}?${query}`;
    } else {
      const baseUri = uri.endsWith("/") ? uri : `${uri}/`;
      connectionString = `${baseUri}${dbNameEncoded}`;
    }

    const connectionInstance = await mongoose.connect(connectionString);
    console.log(`\n MongoDb connected: DB HOST :${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGO DB CONNECTION FAILED ERROR :", error);
    process.exit(1);
  }
}

export default connectDB;
