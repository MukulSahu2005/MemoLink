import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";


// Configure dotenv
dotenv.config({
  path: "./.env"
});

// Connect to MongoDB, then listen on port(run server)
connectDB()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`⚙️  Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed !!! ", err);
  });
