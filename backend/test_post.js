import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const MONGODB_URI = "mongodb+srv://mukulsahu2005_db_user:6TT6OkurIQUNKiHD@cluster0.fwq43aq.mongodb.net/?appName=Cluster0";
const JWT_SECRET = "YourSuperSecretJWTKey123!"; // from backend/.env

async function test() {
  try {
    await mongoose.connect(MONGODB_URI + "/SecondBrain");
    console.log("Connected to MongoDB!");

    // Find localtest user
    const user = await mongoose.connection.db.collection("users").findOne({ username: "localtest" });
    if (!user) {
      console.error("User localtest not found in DB!");
      return;
    }
    console.log("Found User in DB:", user);

    const payload = {
      _id: user._id.toString(),
      username: user.username
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    console.log("Generated Token:", token);

    const requestBody = {
      title: "Test Title",
      content: "Test Content",
      type: "document",
      tags: ["test"]
    };

    const response = await fetch("http://localhost:3004/api/v1/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    const status = response.status;
    const data = await response.json();
    console.log("Response Status:", status);
    console.log("Response Data:", JSON.stringify(data, null, 2));

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

test();
