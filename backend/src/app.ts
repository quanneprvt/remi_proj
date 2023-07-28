import { Status } from "./interfaces";
require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import config from "config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/connectDB";
import routes from "./routes";
import { Server } from "socket.io";
import CronJob from "node-cron";
import { createServer } from "http";
import { verifyJwt } from "./utils/jwt";

const app = express();
const server = createServer(app);

// Middleware

// 1. Body Parser
app.use(express.json({ limit: "10kb" }));

// 2. Cookie Parser
app.use(cookieParser());

// 3. Logger
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// 4. Cors
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// 5. Routes
Object.keys(routes).forEach((routeName) => {
  app.use(`/api/${routeName}`, routes[routeName]);
});

// 7. Socket IO
const io = new Server(server, {
  path: "/subscription/",
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  // Validate Access Token
  const decoded = verifyJwt<{ sub: string }>(
    socket.handshake.auth.token,
    Buffer.from(config.get<string>("accessTokenPublicKey"), "base64").toString(
      "ascii"
    )
  );
  if (!decoded) {
    socket.disconnect();
  }
});

// Healthcheck
app.get("/healthChecker", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to my jitera test project 😂😂👈👈",
  });
});

// UnKnown Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || Status.ERROR;
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const port = config.get<number>("port");
if (process.env.NODE_ENV !== "test") {
  server.listen(port, () => {
    console.log(`Server started on port: ${port}`);
    // 👇 call the connectDB function here
    connectDB();
  });
}

export default {
  server,
  socket: io,
};
