// 1. SABSE PEHLI LINE EXACTLY YE HOGI (No 'from', self-executing import):
import "dotenv/config";

import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    // 3000 ko hata kar 10000 kar diya (Render ka default safe port)
    const port = process.env.PORT || 3000; 
    app.listen(port, () => {
      console.log(`⚙️  Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed !!! ", err);
  });