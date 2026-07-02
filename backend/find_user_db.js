import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://mukulsahu2005_db_user:6TT6OkurIQUNKiHD@cluster0.fwq43aq.mongodb.net/?appName=Cluster0";

async function checkDb(dbName) {
  const conn = await mongoose.createConnection(MONGODB_URI.replace("/?", `/${dbName}?` || MONGODB_URI)).asPromise();
  const collections = await conn.db.listCollections().toArray();
  console.log(`--- DB: ${dbName} ---`);
  console.log("Collections:", collections.map(c => c.name));
  
  if (collections.some(c => c.name === "users")) {
    const usersCount = await conn.db.collection("users").countDocuments();
    console.log("Users count:", usersCount);
    const users = await conn.db.collection("users").find({}).toArray();
    console.log("Users:", users.map(u => u.username));
  }
  await conn.close();
}

async function run() {
  try {
    await checkDb("SecondBrain");
    await checkDb("test");
  } catch (err) {
    console.error(err);
  }
}

run();
