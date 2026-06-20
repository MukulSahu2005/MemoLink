import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const session = require('express-session');

import userRouter from "./routes/user.routes.js";
import notesRouter from "./routes/notes.routes.js"
import authRouter from "./routes/auth.routes.js";

const app = express();

// Global middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.CORS_ORIGIN
].filter(Boolean) as string[];

// DEPLOYMENT => ASKING EXPRESS TO TRUST RENDER'S PROXY
app.set('trust proxy', 1);


app.use(cors({
  origin: function (origin, callback) {
    // server to server request =alllowed 
    if (!origin) return callback(null, true);

    // ARRAY doamins=> allowed
    if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }
    
    // else errror
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true 
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());


// Mount routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/auth", authRouter);


// Global error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || []
  });
});


// DEPLOYMENT= COKKIE AND SESSION HANDSHAKE
// Added session middleware so to allow the share of cookies 
app.use(session({
  secret:process.env.SESSION_SECRET || 'super-secret-local-key';
  resave: false,
  saveUninitialized: false,
  // cokkie settings 
  cookie: {
    // secure must be true in production (HTTPS), but false locally (HTTP)
    secure: process.env.NODE_ENV === 'production', 
    // sameSite 'none' allows Vercel to read cookies set by Render
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}))
export { app };
