import express from "express";
import {
  getAllVideosHandler,
  createVideoHandler,
  updateVideoHandler,
  getMyVideosHandler,
} from "../controllers/video.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.get("/all", deserializeUser, requireUser, getAllVideosHandler);
router.get("/me", deserializeUser, requireUser, getMyVideosHandler);
router.put("/", deserializeUser, requireUser, updateVideoHandler);
router.post("/", deserializeUser, requireUser, createVideoHandler);

export default router;
