import userRouter from "./user.route";
import authRouter from "./auth.route";
import videoRouter from "./video.route";
import { Router } from "express";

export default {
  users: userRouter,
  auth: authRouter,
  videos: videoRouter,
} as { [key: string]: Router };
