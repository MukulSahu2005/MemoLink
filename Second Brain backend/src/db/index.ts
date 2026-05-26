import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";      //

const connectDB=async()=>{
  try{
  const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n MongoDb connected: DB HOST :${connectionInstance.connection.host}`);    // to know o which host i am connecting
  }
  catch(error){
    console.log("MOONGO DB CONNECTION,FAILED ERROR :", error);
    process.exit(1);
  }
}

export default connectDB;
